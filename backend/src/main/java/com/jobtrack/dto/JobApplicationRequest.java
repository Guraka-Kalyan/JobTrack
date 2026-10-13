package com.jobtrack.dto;

import com.jobtrack.enums.ApplicationStatus;
import com.jobtrack.enums.EmploymentType;
import com.jobtrack.enums.WorkMode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

/**
 * DTO for creating or updating a Job Application.
 *
 * Concepts for learners:
 * - DTO (Data Transfer Object) separates the HTTP API payload from the internal Database Entity.
 * - Jakarta Bean Validation annotations validate incoming client data before business logic runs.
 */
public class JobApplicationRequest {

    @NotBlank(message = "Company name is required")
    @Size(max = 150, message = "Company name must not exceed 150 characters")
    private String companyName;

    @NotBlank(message = "Job title is required")
    @Size(max = 150, message = "Job title must not exceed 150 characters")
    private String jobTitle;

    @Size(max = 500, message = "Job URL must not exceed 500 characters")
    private String jobUrl;

    @Size(max = 255, message = "Company website must not exceed 255 characters")
    private String companyWebsite;

    @Size(max = 150, message = "Location must not exceed 150 characters")
    private String location;

    private WorkMode workMode;

    private EmploymentType employmentType;

    @Size(max = 100, message = "Salary range must not exceed 100 characters")
    private String salaryRange;

    private LocalDate applicationDate;

    private ApplicationStatus status = ApplicationStatus.APPLIED;

    @Size(max = 120, message = "Recruiter name must not exceed 120 characters")
    private String recruiterName;

    @Size(max = 150, message = "Recruiter email must not exceed 150 characters")
    private String recruiterEmail;

    private LocalDate nextFollowUpDate;

    private Boolean followUpCompleted = false;

    private String notes;

    public JobApplicationRequest() {
    }

    // Getters and Setters
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

    public EmploymentType getEmploymentType() {
        return employmentType;
    }

    public void setEmploymentType(EmploymentType employmentType) {
        this.employmentType = employmentType;
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
}
