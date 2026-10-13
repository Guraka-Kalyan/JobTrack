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
 * Concepts for learners:
 * - Computes real aggregated totals and distributions.
 * - Handles empty datasets gracefully without returning null or throwing exceptions.
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
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate endOfWeek = today.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));

        DashboardSummaryResponse summary = new DashboardSummaryResponse();

        // 1. Metric cards
        summary.setTotalApplications(applicationRepository.count());
        summary.setApplicationsThisWeek(applicationRepository.countByApplicationDateBetween(startOfWeek, endOfWeek));
        summary.setInterviewStageApplications(
                applicationRepository.countByStatusIn(List.of(ApplicationStatus.INTERVIEW, ApplicationStatus.ASSESSMENT))
        );
        summary.setOffersReceived(applicationRepository.countByStatus(ApplicationStatus.OFFER));
        summary.setFollowUpsDue(applicationRepository.countByFollowUpCompletedFalseAndNextFollowUpDateLessThanEqual(today));

        // Study hours
        long studyMinutesThisWeek = studySessionService.getWeeklyStudyMinutes();
        summary.setPreparationHoursThisWeek(Math.round((studyMinutesThisWeek / 60.0) * 10.0) / 10.0);

        long totalStudyMinutes = studySessionService.getTotalStudyMinutes();
        summary.setTotalPreparationHours(Math.round((totalStudyMinutes / 60.0) * 10.0) / 10.0);

        // 2. Status distribution counts
        Map<String, Long> statusCounts = new LinkedHashMap<>();
        for (ApplicationStatus status : ApplicationStatus.values()) {
            statusCounts.put(status.name(), applicationRepository.countByStatus(status));
        }
        summary.setStatusCounts(statusCounts);

        // 3. Weekly activity for last 4 weeks
        List<DashboardSummaryResponse.WeeklyActivityDto> weeklyActivity = new ArrayList<>();
        for (int i = 3; i >= 0; i--) {
            LocalDate weekStart = startOfWeek.minusWeeks(i);
            LocalDate weekEnd = weekStart.plusDays(6);
            long count = applicationRepository.countByApplicationDateBetween(weekStart, weekEnd);
            String label = (i == 0) ? "This Week" : (i == 1 ? "Last Week" : i + " Weeks Ago");
            weeklyActivity.add(new DashboardSummaryResponse.WeeklyActivityDto(label, count));
        }
        summary.setWeeklyActivity(weeklyActivity);

        // 4. Latest 5 applications
        List<JobApplicationResponse> recent = applicationRepository.findTop5ByOrderByApplicationDateDescCreatedAtDesc()
                .stream()
                .map(JobApplicationResponse::fromEntity)
                .collect(Collectors.toList());
        summary.setRecentApplications(recent);

        // 5. Upcoming interviews
        List<InterviewResponse> upcoming = interviewService.getUpcomingInterviews();
        if (upcoming.size() > 5) {
            upcoming = upcoming.subList(0, 5);
        }
        summary.setUpcomingInterviews(upcoming);

        // 6. Follow-up alerts
        List<JobApplicationResponse> overdue = applicationRepository
                .findByFollowUpCompletedFalseAndNextFollowUpDateLessThanOrderByNextFollowUpDateAsc(today)
                .stream()
                .map(JobApplicationResponse::fromEntity)
                .collect(Collectors.toList());
        summary.setOverdueFollowUps(overdue);

        List<JobApplicationResponse> dueToday = applicationRepository
                .findByFollowUpCompletedFalseAndNextFollowUpDateOrderByCompanyNameAsc(today)
                .stream()
                .map(JobApplicationResponse::fromEntity)
                .collect(Collectors.toList());
        summary.setTodayFollowUps(dueToday);

        return summary;
    }
}
