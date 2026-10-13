package com.jobtrack.service;

import com.jobtrack.dto.JobApplicationRequest;
import com.jobtrack.dto.JobApplicationResponse;
import com.jobtrack.entity.JobApplication;
import com.jobtrack.enums.ApplicationStatus;
import com.jobtrack.enums.EmploymentType;
import com.jobtrack.enums.WorkMode;
import com.jobtrack.exception.ResourceNotFoundException;
import com.jobtrack.repository.JobApplicationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service handling business logic for Job Applications.
 *
 * Concepts for learners:
 * - @Service marks this as a Spring-managed service bean in the Service Layer.
 * - Constructor injection is used for JobApplicationRepository (industry best practice).
 * - @Transactional ensures database operations run within a database transaction boundary.
 */
@Service
public class JobApplicationService {

    private final JobApplicationRepository repository;

    public JobApplicationService(JobApplicationRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<JobApplicationResponse> getAllApplications() {
        return repository.findAll(Sort.by(Sort.Direction.DESC, "applicationDate", "createdAt"))
                .stream()
                .map(JobApplicationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<JobApplicationResponse> getApplicationsFiltered(
            String search,
            ApplicationStatus status,
            WorkMode workMode,
            EmploymentType employmentType,
            LocalDate startDate,
            LocalDate endDate,
            int page,
            int size,
            String sortBy,
            String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return repository.findWithFilters(search, status, workMode, employmentType, startDate, endDate, pageable)
                .map(JobApplicationResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public JobApplicationResponse getApplicationById(Long id) {
        JobApplication application = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("JobApplication", "id", id));
        return JobApplicationResponse.fromEntity(application);
    }

    @Transactional
    public JobApplicationResponse createApplication(JobApplicationRequest request) {
        JobApplication application = new JobApplication();
        mapRequestToEntity(request, application);
        JobApplication saved = repository.save(application);
        return JobApplicationResponse.fromEntity(saved);
    }

    @Transactional
    public JobApplicationResponse updateApplication(Long id, JobApplicationRequest request) {
        JobApplication application = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("JobApplication", "id", id));
        mapRequestToEntity(request, application);
        JobApplication updated = repository.save(application);
        return JobApplicationResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteApplication(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("JobApplication", "id", id);
        }
        repository.deleteById(id);
    }

    @Transactional
    public JobApplicationResponse updateFollowUp(Long id, LocalDate nextFollowUpDate, Boolean completed, String notes) {
        JobApplication application = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("JobApplication", "id", id));
        if (nextFollowUpDate != null) {
            application.setNextFollowUpDate(nextFollowUpDate);
        }
        if (completed != null) {
            application.setFollowUpCompleted(completed);
        }
        if (notes != null && !notes.isBlank()) {
            String currentNotes = application.getNotes() != null ? application.getNotes() : "";
            application.setNotes(currentNotes + "\n[Follow-up Note " + LocalDate.now() + "]: " + notes);
        }
        JobApplication updated = repository.save(application);
        return JobApplicationResponse.fromEntity(updated);
    }

    @Transactional(readOnly = true)
    public List<JobApplicationResponse> getApplicationsWithFollowUps() {
        return repository.findByNextFollowUpDateIsNotNullOrderByNextFollowUpDateAsc()
                .stream()
                .map(JobApplicationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    private void mapRequestToEntity(JobApplicationRequest request, JobApplication application) {
        application.setCompanyName(request.getCompanyName().trim());
        application.setJobTitle(request.getJobTitle().trim());
        application.setJobUrl(request.getJobUrl());
        application.setCompanyWebsite(request.getCompanyWebsite());
        application.setLocation(request.getLocation());
        application.setWorkMode(request.getWorkMode());
        application.setEmploymentType(request.getEmploymentType());
        application.setSalaryRange(request.getSalaryRange());
        application.setApplicationDate(request.getApplicationDate() != null ? request.getApplicationDate() : LocalDate.now());
        application.setStatus(request.getStatus() != null ? request.getStatus() : ApplicationStatus.APPLIED);
        application.setRecruiterName(request.getRecruiterName());
        application.setRecruiterEmail(request.getRecruiterEmail());
        application.setNextFollowUpDate(request.getNextFollowUpDate());
        application.setFollowUpCompleted(request.getFollowUpCompleted() != null ? request.getFollowUpCompleted() : false);
        application.setNotes(request.getNotes());
    }
}
