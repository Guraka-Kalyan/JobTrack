package com.jobtrack.dto;

import java.util.List;
import java.util.Map;

/**
 * Aggregated analytics overview data for the Analytics page.
 */
public class AnalyticsOverviewResponse {

    private long totalApplications;
    private long totalInterviews;
    private long totalOffers;
    private long totalStudyMinutes;
    private double totalStudyHours;
    private long followUpsTotal;
    private long followUpsCompleted;
    private double followUpCompletionRate;

    // Status breakdown
    private Map<String, Long> statusDistribution;

    // Monthly application submissions (e.g., "Jan 2026", "Feb 2026", etc.)
    private List<MonthlyApplicationStat> monthlyApplications;

    // Preparation hours by subject
    private List<SubjectPreparationStat> preparationBySubject;

    public static class MonthlyApplicationStat {
        private String month;
        private long count;

        public MonthlyApplicationStat() {
        }

        public MonthlyApplicationStat(String month, long count) {
            this.month = month;
            this.count = count;
        }

        public String getMonth() {
            return month;
        }

        public void setMonth(String month) {
            this.month = month;
        }

        public long getCount() {
            return count;
        }

        public void setCount(long count) {
            this.count = count;
        }
    }

    public static class SubjectPreparationStat {
        private String subject;
        private long minutes;
        private double hours;

        public SubjectPreparationStat() {
        }

        public SubjectPreparationStat(String subject, long minutes, double hours) {
            this.subject = subject;
            this.minutes = minutes;
            this.hours = hours;
        }

        public String getSubject() {
            return subject;
        }

        public void setSubject(String subject) {
            this.subject = subject;
        }

        public long getMinutes() {
            return minutes;
        }

        public void setMinutes(long minutes) {
            this.minutes = minutes;
        }

        public double getHours() {
            return hours;
        }

        public void setHours(double hours) {
            this.hours = hours;
        }
    }

    public AnalyticsOverviewResponse() {
    }

    // Getters and Setters
    public long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }

    public long getTotalInterviews() {
        return totalInterviews;
    }

    public void setTotalInterviews(long totalInterviews) {
        this.totalInterviews = totalInterviews;
    }

    public long getTotalOffers() {
        return totalOffers;
    }

    public void setTotalOffers(long totalOffers) {
        this.totalOffers = totalOffers;
    }

    public long getTotalStudyMinutes() {
        return totalStudyMinutes;
    }

    public void setTotalStudyMinutes(long totalStudyMinutes) {
        this.totalStudyMinutes = totalStudyMinutes;
    }

    public double getTotalStudyHours() {
        return totalStudyHours;
    }

    public void setTotalStudyHours(double totalStudyHours) {
        this.totalStudyHours = totalStudyHours;
    }

    public long getFollowUpsTotal() {
        return followUpsTotal;
    }

    public void setFollowUpsTotal(long followUpsTotal) {
        this.followUpsTotal = followUpsTotal;
    }

    public long getFollowUpsCompleted() {
        return followUpsCompleted;
    }

    public void setFollowUpsCompleted(long followUpsCompleted) {
        this.followUpsCompleted = followUpsCompleted;
    }

    public double getFollowUpCompletionRate() {
        return followUpCompletionRate;
    }

    public void setFollowUpCompletionRate(double followUpCompletionRate) {
        this.followUpCompletionRate = followUpCompletionRate;
    }

    public Map<String, Long> getStatusDistribution() {
        return statusDistribution;
    }

    public void setStatusDistribution(Map<String, Long> statusDistribution) {
        this.statusDistribution = statusDistribution;
    }

    public List<MonthlyApplicationStat> getMonthlyApplications() {
        return monthlyApplications;
    }

    public void setMonthlyApplications(List<MonthlyApplicationStat> monthlyApplications) {
        this.monthlyApplications = monthlyApplications;
    }

    public List<SubjectPreparationStat> getPreparationBySubject() {
        return preparationBySubject;
    }

    public void setPreparationBySubject(List<SubjectPreparationStat> preparationBySubject) {
        this.preparationBySubject = preparationBySubject;
    }
}
