package com.jobtrack.dto;

import com.jobtrack.entity.StudySession;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO for returning StudySession data in API responses.
 */
public class StudySessionResponse {

    private Long id;
    private LocalDate studyDate;
    private String subject;
    private String topic;
    private String activityDescription;
    private Integer durationMinutes;
    private String formattedDuration;
    private Boolean completed;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public StudySessionResponse() {
    }

    public static StudySessionResponse fromEntity(StudySession entity) {
        StudySessionResponse response = new StudySessionResponse();
        response.setId(entity.getId());
        response.setStudyDate(entity.getStudyDate());
        response.setSubject(entity.getSubject());
        response.setTopic(entity.getTopic());
        response.setActivityDescription(entity.getActivityDescription());
        response.setDurationMinutes(entity.getDurationMinutes());
        response.setFormattedDuration(formatMinutes(entity.getDurationMinutes()));
        response.setCompleted(entity.getCompleted());
        response.setNotes(entity.getNotes());
        response.setCreatedAt(entity.getCreatedAt());
        response.setUpdatedAt(entity.getUpdatedAt());
        return response;
    }

    private static String formatMinutes(Integer minutes) {
        if (minutes == null || minutes <= 0) {
            return "0 mins";
        }
        int hours = minutes / 60;
        int remaining = minutes % 60;
        if (hours == 0) {
            return remaining + " min" + (remaining > 1 ? "s" : "");
        } else if (remaining == 0) {
            return hours + " hr" + (hours > 1 ? "s" : "");
        } else {
            return hours + " hr " + remaining + " min";
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getStudyDate() {
        return studyDate;
    }

    public void setStudyDate(LocalDate studyDate) {
        this.studyDate = studyDate;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getActivityDescription() {
        return activityDescription;
    }

    public void setActivityDescription(String activityDescription) {
        this.activityDescription = activityDescription;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public String getFormattedDuration() {
        return formattedDuration;
    }

    public void setFormattedDuration(String formattedDuration) {
        this.formattedDuration = formattedDuration;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
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
