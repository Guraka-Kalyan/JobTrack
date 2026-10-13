package com.jobtrack.dto;

import com.jobtrack.entity.JobApplication;
import com.jobtrack.enums.ApplicationStatus;
import com.jobtrack.enums.EmploymentType;
import com.jobtrack.enums.WorkMode;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO for returning Job Application data in API responses.
 */
public class JobApplicationResponse {

    private Long id;
    private String companyName;
    private String jobTitle;
    private String jobUrl;
    private String companyWebsite;
    private String location;
    private WorkMode workMode;
    private String workModeLabel;
    private EmploymentType employmentType;
    private String employmentTypeLabel;
    private String salaryRange;
    private LocalDate applicationDate;
    private ApplicationStatus status;
    private String statusLabel;
    private String recruiterName;
    private String recruiterEmail;
    private LocalDate nextFollowUpDate;
    private Boolean followUpCompleted;
    private String notes;
    private int interviewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public JobApplicationResponse() {
    }

    public static JobApplicationResponse fromEntity(JobApplication entity) {
        JobApplicationResponse response = new JobApplicationResponse();
        response.setId(entity.getId());
        response.setCompanyName(entity.getCompanyName());
        response.setJobTitle(entity.getJobTitle());
        response.setJobUrl(entity.getJobUrl());
        response.setCompanyWebsite(entity.getCompanyWebsite());
        response.setLocation(entity.getLocation());
        response.setWorkMode(entity.getWorkMode());
        response.setWorkModeLabel(entity.getWorkMode() != null ? entity.getWorkMode().getDisplayName() : null);
        response.setEmploymentType(entity.getEmploymentType());
        response.setEmploymentTypeLabel(entity.getEmploymentType() != null ? entity.getEmploymentType().getDisplayName() : null);
        response.setSalaryRange(entity.getSalaryRange());
        response.setApplicationDate(entity.getApplicationDate());
        response.setStatus(entity.getStatus());
        response.setStatusLabel(entity.getStatus() != null ? entity.getStatus().getDisplayName() : null);
        response.setRecruiterName(entity.getRecruiterName());
        response.setRecruiterEmail(entity.getRecruiterEmail());
        response.setNextFollowUpDate(entity.getNextFollowUpDate());
        response.setFollowUpCompleted(entity.getFollowUpCompleted());
        response.setNotes(entity.getNotes());
        response.setInterviewCount(entity.getInterviews() != null ? entity.getInterviews().size() : 0);
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

    public String getJobUrl() {
        return jobUrl;
    }

    public void setJobUrl(String jobUrl) {
        this.jobUrl = jobUrl;
    }

    public String getCompanyWebsite() {
        return companyWebsite;
    }

    public void setCompanyWebsite(String companyWebsite) {
        this.companyWebsite = companyWebsite;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public WorkMode getWorkMode() {
        return workMode;
    }

    public void setWorkMode(WorkMode workMode) {
        this.workMode = workMode;
    }

    public String getWorkModeLabel() {
        return workModeLabel;
    }

    public void setWorkModeLabel(String workModeLabel) {
        this.workModeLabel = workModeLabel;
    }

    public EmploymentType getEmploymentType() {
        return employmentType;
    }

    public void setEmploymentType(EmploymentType employmentType) {
        this.employmentType = employmentType;
    }

    public String getEmploymentTypeLabel() {
        return employmentTypeLabel;
    }

    public void setEmploymentTypeLabel(String employmentTypeLabel) {
        this.employmentTypeLabel = employmentTypeLabel;
    }

    public String getSalaryRange() {
        return salaryRange;
    }

    public void setSalaryRange(String salaryRange) {
        this.salaryRange = salaryRange;
    }

    public LocalDate getApplicationDate() {
        return applicationDate;
    }

    public void setApplicationDate(LocalDate applicationDate) {
        this.applicationDate = applicationDate;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public String getStatusLabel() {
        return statusLabel;
    }

    public void setStatusLabel(String statusLabel) {
        this.statusLabel = statusLabel;
    }

    public String getRecruiterName() {
        return recruiterName;
    }

    public void setRecruiterName(String recruiterName) {
        this.recruiterName = recruiterName;
    }

    public String getRecruiterEmail() {
        return recruiterEmail;
    }

    public void setRecruiterEmail(String recruiterEmail) {
        this.recruiterEmail = recruiterEmail;
    }

    public LocalDate getNextFollowUpDate() {
        return nextFollowUpDate;
    }

    public void setNextFollowUpDate(LocalDate nextFollowUpDate) {
        this.nextFollowUpDate = nextFollowUpDate;
    }

    public Boolean getFollowUpCompleted() {
        return followUpCompleted;
    }

    public void setFollowUpCompleted(Boolean followUpCompleted) {
        this.followUpCompleted = followUpCompleted;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public int getInterviewCount() {
        return interviewCount;
    }

    public void setInterviewCount(int interviewCount) {
        this.interviewCount = interviewCount;
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
