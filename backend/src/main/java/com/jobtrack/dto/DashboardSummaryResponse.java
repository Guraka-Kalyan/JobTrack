package com.jobtrack.dto;

import java.util.List;
import java.util.Map;

/**
 * Aggregated statistics DTO for the main Dashboard view.
 * All numbers are calculated directly from backend database records.
 */
public class DashboardSummaryResponse {

    private long totalApplications;
    private long applicationsThisWeek;
    private long interviewStageApplications;
    private long offersReceived;
    private long followUpsDue;
    private double preparationHoursThisWeek;
    private double totalPreparationHours;

    // Status counts for status distribution chart
    private Map<String, Long> statusCounts;

    // Applications submitted recently (weekly activity)
    private List<WeeklyActivityDto> weeklyActivity;

    // Top 5 recent applications
    private List<JobApplicationResponse> recentApplications;

    // Upcoming interviews
    private List<InterviewResponse> upcomingInterviews;

    // Follow-up alerts
    private List<JobApplicationResponse> overdueFollowUps;
    private List<JobApplicationResponse> todayFollowUps;

    public static class WeeklyActivityDto {
        private String weekLabel;
        private long count;

        public WeeklyActivityDto() {
        }

        public WeeklyActivityDto(String weekLabel, long count) {
            this.weekLabel = weekLabel;
            this.count = count;
        }

        public String getWeekLabel() {
            return weekLabel;
        }

        public void setWeekLabel(String weekLabel) {
            this.weekLabel = weekLabel;
        }

        public long getCount() {
            return count;
        }

        public void setCount(long count) {
            this.count = count;
        }
    }

    public DashboardSummaryResponse() {
    }

    // Getters and Setters
    public long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }

    public long getApplicationsThisWeek() {
        return applicationsThisWeek;
    }

    public void setApplicationsThisWeek(long applicationsThisWeek) {
        this.applicationsThisWeek = applicationsThisWeek;
    }

    public long getInterviewStageApplications() {
        return interviewStageApplications;
    }

    public void setInterviewStageApplications(long interviewStageApplications) {
        this.interviewStageApplications = interviewStageApplications;
    }

    public long getOffersReceived() {
        return offersReceived;
    }

    public void setOffersReceived(long offersReceived) {
        this.offersReceived = offersReceived;
    }

    public long getFollowUpsDue() {
        return followUpsDue;
    }

    public void setFollowUpsDue(long followUpsDue) {
        this.followUpsDue = followUpsDue;
    }

    public double getPreparationHoursThisWeek() {
        return preparationHoursThisWeek;
    }

    public void setPreparationHoursThisWeek(double preparationHoursThisWeek) {
        this.preparationHoursThisWeek = preparationHoursThisWeek;
    }

    public double getTotalPreparationHours() {
        return totalPreparationHours;
    }

    public void setTotalPreparationHours(double totalPreparationHours) {
        this.totalPreparationHours = totalPreparationHours;
    }

    public Map<String, Long> getStatusCounts() {
        return statusCounts;
    }

    public void setStatusCounts(Map<String, Long> statusCounts) {
        this.statusCounts = statusCounts;
    }

    public List<WeeklyActivityDto> getWeeklyActivity() {
        return weeklyActivity;
    }

    public void setWeeklyActivity(List<WeeklyActivityDto> weeklyActivity) {
        this.weeklyActivity = weeklyActivity;
    }

    public List<JobApplicationResponse> getRecentApplications() {
        return recentApplications;
    }

    public void setRecentApplications(List<JobApplicationResponse> recentApplications) {
        this.recentApplications = recentApplications;
    }

    public List<InterviewResponse> getUpcomingInterviews() {
        return upcomingInterviews;
    }

    public void setUpcomingInterviews(List<InterviewResponse> upcomingInterviews) {
        this.upcomingInterviews = upcomingInterviews;
    }

    public List<JobApplicationResponse> getOverdueFollowUps() {
        return overdueFollowUps;
    }

    public void setOverdueFollowUps(List<JobApplicationResponse> overdueFollowUps) {
        this.overdueFollowUps = overdueFollowUps;
    }

    public List<JobApplicationResponse> getTodayFollowUps() {
        return todayFollowUps;
    }

    public void setTodayFollowUps(List<JobApplicationResponse> todayFollowUps) {
        this.todayFollowUps = todayFollowUps;
    }
}
