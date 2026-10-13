package com.jobtrack.dto;

import com.jobtrack.enums.InterviewMode;
import com.jobtrack.enums.InterviewRound;
import com.jobtrack.enums.InterviewStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

/**
 * DTO for creating or updating an Interview round.
 */
public class InterviewRequest {

    @NotNull(message = "Job application ID is required")
    private Long jobApplicationId;

    @NotNull(message = "Interview round is required")
    private InterviewRound roundName = InterviewRound.TECHNICAL;

    @NotNull(message = "Interview schedule date and time is required")
    private LocalDateTime scheduledAt;

    private InterviewMode interviewMode = InterviewMode.ONLINE;

    @Size(max = 500, message = "Meeting link must not exceed 500 characters")
    private String meetingLink;

    @Size(max = 200, message = "Location must not exceed 200 characters")
    private String location;

    private InterviewStatus status = InterviewStatus.SCHEDULED;

    private String notes;

    public InterviewRequest() {
    }

    // Getters and Setters
    public Long getJobApplicationId() {
        return jobApplicationId;
    }

    public void setJobApplicationId(Long jobApplicationId) {
        this.jobApplicationId = jobApplicationId;
    }

    public InterviewRound getRoundName() {
        return roundName;
    }

    public void setRoundName(InterviewRound roundName) {
        this.roundName = roundName;
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

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
