package com.jobtrack.entity;

import com.jobtrack.enums.InterviewMode;
import com.jobtrack.enums.InterviewRound;
import com.jobtrack.enums.InterviewStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity representing an Interview round linked to a JobApplication.
 *
 * Concepts for learners:
 * - @ManyToOne(fetch = FetchType.LAZY): Many interviews belong to one job application.
 *   LAZY loading prevents pulling full application graph into memory unless needed.
 * - @JoinColumn(name = "job_application_id", nullable = false): Specifies foreign key column.
 */
@Entity
@Table(name = "interviews")
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_application_id", nullable = false)
    private JobApplication jobApplication;

    @Enumerated(EnumType.STRING)
    @Column(name = "round_name", nullable = false, length = 50)
    private InterviewRound roundName = InterviewRound.TECHNICAL;

    @Column(name = "scheduled_at", nullable = false)
    private LocalDateTime scheduledAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "interview_mode", nullable = false, length = 30)
    private InterviewMode interviewMode = InterviewMode.ONLINE;

    @Column(name = "meeting_link", length = 500)
    private String meetingLink;

    @Column(length = 200)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private InterviewStatus status = InterviewStatus.SCHEDULED;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Interview() {
    }

    public Interview(JobApplication jobApplication, InterviewRound roundName, LocalDateTime scheduledAt, InterviewMode interviewMode) {
        this.jobApplication = jobApplication;
        this.roundName = roundName;
        this.scheduledAt = scheduledAt;
        this.interviewMode = interviewMode;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = InterviewStatus.SCHEDULED;
        }
        if (this.roundName == null) {
            this.roundName = InterviewRound.TECHNICAL;
        }
        if (this.interviewMode == null) {
            this.interviewMode = InterviewMode.ONLINE;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public JobApplication getJobApplication() {
        return jobApplication;
    }

    public void setJobApplication(JobApplication jobApplication) {
        this.jobApplication = jobApplication;
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
