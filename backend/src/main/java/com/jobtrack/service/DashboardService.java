package com.jobtrack.service;

import com.jobtrack.dto.DashboardSummaryResponse;
import com.jobtrack.dto.InterviewResponse;
import com.jobtrack.dto.JobApplicationResponse;
import com.jobtrack.entity.JobApplication;
import com.jobtrack.enums.ApplicationStatus;
import com.jobtrack.repository.InterviewRepository;
import com.jobtrack.repository.JobApplicationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service calculating real-time dashboard metrics from MySQL.
 *
 * PERFORMANCE — query count reduced from 22 to 7:
 *
 * Before: every metric was a separate COUNT query, including a loop of 7
 * countByStatus() calls and 4 countByApplicationDateBetween() calls.
 * Each extra query is a synchronous round-trip to the cloud database.
 *
 * After: three batch queries replace 16 individual queries.
 * The results are aggregated in Java (fast, in-memory) instead of the DB.
 *
 *   Query 1 – countGroupByStatus()           replaces 9 queries
 *   Query 2 – countApplicationsByDateFrom()  replaces 5 queries
 *   Query 3 – findByFollowUpDue()            replaces 3 queries
 *   Queries 4-7 – unchanged (top5, upcoming, study hours x2)
 */
@Service
public class DashboardService {

    private final JobApplicationRepository applicationRepository;
    private final InterviewRepository interviewRepository;
    private final InterviewService interviewService;
    private final StudySessionService studySessionService;

    public DashboardService(
            JobApplicationRepository applicationRepository,
            InterviewRepository interviewRepository,
            InterviewService interviewService,
            StudySessionService studySessionService
    ) {
        this.applicationRepository = applicationRepository;
        this.interviewRepository = interviewRepository;
        this.interviewService = interviewService;
        this.studySessionService = studySessionService;
    }

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getDashboardSummary() {
        LocalDate today        = LocalDate.now();
        LocalDate startOfWeek  = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate fourWeeksAgo = startOfWeek.minusWeeks(3); // start of 4-week window

        DashboardSummaryResponse summary = new DashboardSummaryResponse();

        // =====================================================================
        // QUERY 1 — status distribution  (GROUP BY replaces 9 separate queries)
        //
        // Old code fired:
        //   countByStatusIn([INTERVIEW, ASSESSMENT])   1 query
        //   countByStatus(OFFER)                        1 query
        //   for each of 7 statuses: countByStatus()    7 queries
        //                                        TOTAL: 9 queries
        //
        // New code: one GROUP BY query, then derive all three values in Java.
        // =====================================================================
        Map<String, Long> statusCounts = new LinkedHashMap<>();
        for (ApplicationStatus s : ApplicationStatus.values()) {
            statusCounts.put(s.name(), 0L); // pre-fill zeros for statuses with no rows
        }
        applicationRepository.countGroupByStatus().forEach(row -> {
            ApplicationStatus status = (ApplicationStatus) row[0];
            Long count               = (Long) row[1];
            statusCounts.put(status.name(), count);
        });
        summary.setStatusCounts(statusCounts);

        // Derive other metrics from the map — no additional queries needed
        summary.setTotalApplications(
            statusCounts.values().stream().mapToLong(Long::longValue).sum()
        );
        summary.setOffersReceived(
            statusCounts.getOrDefault(ApplicationStatus.OFFER.name(), 0L)
        );
        summary.setInterviewStageApplications(
            statusCounts.getOrDefault(ApplicationStatus.INTERVIEW.name(), 0L) +
            statusCounts.getOrDefault(ApplicationStatus.ASSESSMENT.name(), 0L)
        );

        // =====================================================================
        // QUERY 2 — date-grouped counts  (replaces 5 separate queries)
        //
        // Old code fired:
        //   countByApplicationDateBetween(this week)  1 query
        //   for 4 weeks: countByApplicationDateBetween 4 queries (week 0 duplicated)
        //                                        TOTAL: 5 queries (1 was a duplicate)
        //
        // New code: one query returns per-day counts for the entire 4-week window.
        // Java then sums each week's days and derives applicationsThisWeek too.
        // =====================================================================
        Map<LocalDate, Long> dateCountMap = new HashMap<>();
        applicationRepository.countApplicationsByDateFrom(fourWeeksAgo)
            .forEach(row -> dateCountMap.put((LocalDate) row[0], (Long) row[1]));

        List<DashboardSummaryResponse.WeeklyActivityDto> weeklyActivity = new ArrayList<>();
        long applicationsThisWeek = 0;
        for (int i = 3; i >= 0; i--) {
            LocalDate weekStart = startOfWeek.minusWeeks(i);
            LocalDate weekEnd   = weekStart.plusDays(6);
            long count = 0;
            for (LocalDate d = weekStart; !d.isAfter(weekEnd); d = d.plusDays(1)) {
                count += dateCountMap.getOrDefault(d, 0L);
            }
            String label = (i == 0) ? "This Week" : (i == 1 ? "Last Week" : i + " Weeks Ago");
            weeklyActivity.add(new DashboardSummaryResponse.WeeklyActivityDto(label, count));
            if (i == 0) applicationsThisWeek = count;
        }
        summary.setWeeklyActivity(weeklyActivity);
        summary.setApplicationsThisWeek(applicationsThisWeek);

        // =====================================================================
        // QUERY 3 — follow-up alerts  (replaces 3 separate queries)
        //
        // Old code fired:
        //   countByFollowUpCompleted...LessThanEqual   1 query (metric card count)
        //   findByFollowUpCompleted...LessThan         1 query (overdue list)
        //   findByFollowUpCompleted...Equal            1 query (today list)
        //                                        TOTAL: 3 queries
        //
        // New code: one query fetches all due applications (nextFollowUpDate <= today).
        // Java splits them into overdue (< today) and due-today (== today).
        // =====================================================================
        List<JobApplication> allDue = applicationRepository
            .findByFollowUpCompletedFalseAndNextFollowUpDateLessThanEqualOrderByNextFollowUpDateAsc(today);

        summary.setFollowUpsDue((long) allDue.size());

        summary.setOverdueFollowUps(allDue.stream()
            .filter(a -> a.getNextFollowUpDate().isBefore(today))
            .map(JobApplicationResponse::fromEntity)
            .collect(Collectors.toList()));

        summary.setTodayFollowUps(allDue.stream()
            .filter(a -> a.getNextFollowUpDate().isEqual(today))
            .sorted(Comparator.comparing(a -> a.getCompanyName().toLowerCase()))
            .map(JobApplicationResponse::fromEntity)
            .collect(Collectors.toList()));

        // =====================================================================
        // QUERIES 4-7 — unchanged; each makes exactly one database call
        // =====================================================================

        // Query 4: top 5 recent applications.
        // The @BatchSize(20) on JobApplication.interviews means that
        // entity.getInterviews().size() inside fromEntity() fires at most
        // one IN-clause query for all 5 apps instead of 5 separate SELECTs.
        summary.setRecentApplications(
            applicationRepository.findTop5ByOrderByApplicationDateDescCreatedAtDesc()
                .stream()
                .map(JobApplicationResponse::fromEntity)
                .collect(Collectors.toList())
        );

        // Query 5: upcoming interviews
        List<InterviewResponse> upcoming = interviewService.getUpcomingInterviews();
        if (upcoming.size() > 5) {
            upcoming = upcoming.subList(0, 5);
        }
        summary.setUpcomingInterviews(upcoming);

        // Query 6: study hours this week
        long studyMinutesThisWeek = studySessionService.getWeeklyStudyMinutes();
        summary.setPreparationHoursThisWeek(Math.round((studyMinutesThisWeek / 60.0) * 10.0) / 10.0);

        // Query 7: total study hours
        long totalStudyMinutes = studySessionService.getTotalStudyMinutes();
        summary.setTotalPreparationHours(Math.round((totalStudyMinutes / 60.0) * 10.0) / 10.0);

        return summary;
    }
}
