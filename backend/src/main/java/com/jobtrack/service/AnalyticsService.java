package com.jobtrack.service;

import com.jobtrack.dto.AnalyticsOverviewResponse;
import com.jobtrack.enums.ApplicationStatus;
import com.jobtrack.repository.InterviewRepository;
import com.jobtrack.repository.JobApplicationRepository;
import com.jobtrack.repository.StudySessionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * Service calculating comprehensive analytics from persisted database records.
 */
@Service
public class AnalyticsService {

    private final JobApplicationRepository applicationRepository;
    private final InterviewRepository interviewRepository;
    private final StudySessionRepository studySessionRepository;

    public AnalyticsService(
            JobApplicationRepository applicationRepository,
            InterviewRepository interviewRepository,
            StudySessionRepository studySessionRepository
    ) {
        this.applicationRepository = applicationRepository;
        this.interviewRepository = interviewRepository;
        this.studySessionRepository = studySessionRepository;
    }

    @Transactional(readOnly = true)
    public AnalyticsOverviewResponse getOverview() {
        AnalyticsOverviewResponse response = new AnalyticsOverviewResponse();

        long totalApps = applicationRepository.count();
        response.setTotalApplications(totalApps);
        response.setTotalInterviews(interviewRepository.count());
        response.setTotalOffers(applicationRepository.countByStatus(ApplicationStatus.OFFER));

        // Study session metrics
        Long totalMinutes = studySessionRepository.sumTotalDurationMinutes();
        long minutes = totalMinutes != null ? totalMinutes : 0L;
        response.setTotalStudyMinutes(minutes);
        response.setTotalStudyHours(Math.round((minutes / 60.0) * 10.0) / 10.0);

        // Follow-up completion tracking
        long followUpsTotal = applicationRepository.findByNextFollowUpDateIsNotNullOrderByNextFollowUpDateAsc().size();
        long followUpsCompleted = applicationRepository.findByNextFollowUpDateIsNotNullOrderByNextFollowUpDateAsc()
                .stream()
                .filter(a -> Boolean.TRUE.equals(a.getFollowUpCompleted()))
                .count();

        response.setFollowUpsTotal(followUpsTotal);
        response.setFollowUpsCompleted(followUpsCompleted);
        double completionRate = followUpsTotal > 0
                ? Math.round(((double) followUpsCompleted / followUpsTotal * 100.0) * 10.0) / 10.0
                : 0.0;
        response.setFollowUpCompletionRate(completionRate);

        // Status Distribution
        Map<String, Long> statusDist = new LinkedHashMap<>();
        for (ApplicationStatus status : ApplicationStatus.values()) {
            statusDist.put(status.name(), applicationRepository.countByStatus(status));
        }
        response.setStatusDistribution(statusDist);

        // Monthly Applications (last 6 months)
        List<AnalyticsOverviewResponse.MonthlyApplicationStat> monthlyStats = new ArrayList<>();
        YearMonth currentMonth = YearMonth.now();
        DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("MMM yyyy");

        for (int i = 5; i >= 0; i--) {
            YearMonth targetMonth = currentMonth.minusMonths(i);
            LocalDate start = targetMonth.atDay(1);
            LocalDate end = targetMonth.atEndOfMonth();
            long count = applicationRepository.countByApplicationDateBetween(start, end);
            monthlyStats.add(new AnalyticsOverviewResponse.MonthlyApplicationStat(targetMonth.format(monthFormatter), count));
        }
        response.setMonthlyApplications(monthlyStats);

        // Preparation by Subject
        List<Object[]> subjectData = studySessionRepository.sumDurationMinutesGroupedBySubject();
        List<AnalyticsOverviewResponse.SubjectPreparationStat> prepStats = new ArrayList<>();
        for (Object[] row : subjectData) {
            String subject = (String) row[0];
            Number totalMin = (Number) row[1];
            long minVal = totalMin != null ? totalMin.longValue() : 0L;
            double hours = Math.round((minVal / 60.0) * 10.0) / 10.0;
            prepStats.add(new AnalyticsOverviewResponse.SubjectPreparationStat(subject, minVal, hours));
        }
        response.setPreparationBySubject(prepStats);

        return response;
    }
}
