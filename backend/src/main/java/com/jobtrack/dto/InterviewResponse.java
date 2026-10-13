package com.jobtrack.dto;

import com.jobtrack.entity.Interview;
import com.jobtrack.enums.InterviewMode;
import com.jobtrack.enums.InterviewRound;
import com.jobtrack.enums.InterviewStatus;
import java.time.LocalDateTime;

/**
 * DTO for returning Interview data, enriched with related Job Application info.
 */
public class InterviewResponse {

    private Long id;
    private Long jobApplicationId;
    private String companyName;
    private String jobTitle;
    private InterviewRound roundName;
    private String roundNameLabel;
    private LocalDateTime scheduledAt;
    private InterviewMode interviewMode;
    private String interviewModeLabel;
    private String meetingLink;
    private String location;
    private InterviewStatus status;
    private String statusLabel;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public InterviewResponse() {
    }

    public static InterviewResponse fromEntity(Interview entity) {
        InterviewResponse response = new InterviewResponse();
        response.setId(entity.getId());
        if (entity.getJobApplication() != null) {
            response.setJobApplicationId(entity.getJobApplication().getId());
            response.setCompanyName(entity.getJobApplication().getCompanyName());
            response.setJobTitle(entity.getJobApplication().getJobTitle());
        }
        response.setRoundName(entity.getRoundName());
        response.setRoundNameLabel(entity.getRoundName() != null ? entity.getRoundName().getDisplayName() : null);
        response.setScheduledAt(entity.getScheduledAt());
        response.setInterviewMode(entity.getInterviewMode());
        response.setInterviewModeLabel(entity.getInterviewMode() != null ? entity.getInterviewMode().getDisplayName() : null);
        response.setMeetingLink(entity.getMeetingLink());
        response.setLocation(entity.getLocation());
        response.setStatus(entity.getStatus());
        response.setStatusLabel(entity.getStatus() != null ? entity.getStatus().getDisplayName() : null);
        response.setNotes(entity.getNotes());
        response.setCreatedAt(entity.getCreatedAt());
        response.setUpdatedAt(entity.getUpdatedAt());
        return response;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getJobApplicationId() {
        return jobApplicationId;
    }

    public void setJobApplicationId(Long jobApplicationId) {
        this.jobApplicationId = jobApplicationId;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public InterviewRound getRoundName() {
        return roundName;
    }

    public void setRoundName(InterviewRound roundName) {
        this.roundName = roundName;
    }

    public String getRoundNameLabel() {
        return roundNameLabel;
    }

    public void setRoundNameLabel(String roundNameLabel) {
        this.roundNameLabel = roundNameLabel;
    }

    public LocalDateTime getScheduledAt() {
        return scheduledAt;
    }

    public void setScheduledAt(LocalDateTime scheduledAt) {
        this.scheduledAt = scheduledAt;
    }

    public InterviewMode getInterviewMode() {
        return interviewMode;
    }

    public void setInterviewMode(InterviewMode interviewMode) {
        this.interviewMode = interviewMode;
    }

    public String getInterviewModeLabel() {
        return interviewModeLabel;
    }

    public void setInterviewModeLabel(String interviewModeLabel) {
        this.interviewModeLabel = interviewModeLabel;
    }

    public String getMeetingLink() {
        return meetingLink;
    }

    public void setMeetingLink(String meetingLink) {
        this.meetingLink = meetingLink;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public InterviewStatus getStatus() {
        return status;
    }

    public void setStatus(InterviewStatus status) {
        this.status = status;
    }

    public String getStatusLabel() {
        return statusLabel;
    }

    public void setStatusLabel(String statusLabel) {
        this.statusLabel = statusLabel;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
