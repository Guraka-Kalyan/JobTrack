package com.jobtrack.controller;

import com.jobtrack.dto.JobApplicationRequest;
import com.jobtrack.dto.JobApplicationResponse;
import com.jobtrack.enums.ApplicationStatus;
import com.jobtrack.enums.EmploymentType;
import com.jobtrack.enums.WorkMode;
import com.jobtrack.service.JobApplicationService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * REST Controller exposing endpoints for Job Applications.
 *
 * Concepts for learners:
 * - @RestController combines @Controller and @ResponseBody, automatically serializing
 *   return objects to JSON using Jackson.
 * - @RequestMapping("/api/applications") sets the base URL path.
 * - @Valid triggers Jakarta Bean Validation on incoming request bodies.
 * - HTTP Status codes: 200 (OK), 201 (CREATED), 204 (NO CONTENT), 400 (BAD REQUEST), 404 (NOT FOUND).
 */
@RestController
@RequestMapping("/api/applications")
public class JobApplicationController {

    private final JobApplicationService service;

    public JobApplicationController(JobApplicationService service) {
        this.service = service;
    }

    /**
     * Retrieve all job applications with optional search, filtering, and sorting.
     */
    @GetMapping
    public ResponseEntity<List<JobApplicationResponse>> getAllApplications(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) ApplicationStatus status,
            @RequestParam(required = false) WorkMode workMode,
            @RequestParam(required = false) EmploymentType employmentType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "100") int size,
            @RequestParam(required = false, defaultValue = "applicationDate") String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String sortDir
    ) {
        // If filters or search are supplied
        if (search != null || status != null || workMode != null || employmentType != null || startDate != null || endDate != null) {
            return ResponseEntity.ok(service.getApplicationsFiltered(
                    search, status, workMode, employmentType, startDate, endDate, page, size, sortBy, sortDir
            ).getContent());
        }
        return ResponseEntity.ok(service.getAllApplications());
    }

    /**
     * Retrieve a single job application by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<JobApplicationResponse> getApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getApplicationById(id));
    }

    /**
     * Create a new job application.
     */
    @PostMapping
    public ResponseEntity<JobApplicationResponse> createApplication(@Valid @RequestBody JobApplicationRequest request) {
        JobApplicationResponse created = service.createApplication(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * Update an existing job application.
     */
    @PutMapping("/{id}")
    public ResponseEntity<JobApplicationResponse> updateApplication(
            @PathVariable Long id,
            @Valid @RequestBody JobApplicationRequest request
    ) {
        JobApplicationResponse updated = service.updateApplication(id, request);
        return ResponseEntity.ok(updated);
    }

    /**
     * Delete an existing job application.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable Long id) {
        service.deleteApplication(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Quick endpoint to update follow-up date and completion status.
     */
    @PatchMapping("/{id}/follow-up")
    public ResponseEntity<JobApplicationResponse> updateFollowUp(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload
    ) {
        LocalDate nextDate = null;
        if (payload.get("nextFollowUpDate") != null) {
            nextDate = LocalDate.parse((String) payload.get("nextFollowUpDate"));
        }
        Boolean completed = payload.get("followUpCompleted") != null ? (Boolean) payload.get("followUpCompleted") : null;
        String notes = (String) payload.get("notes");

        return ResponseEntity.ok(service.updateFollowUp(id, nextDate, completed, notes));
    }

    /**
     * Retrieve all applications that have follow-ups scheduled.
     */
    @GetMapping("/follow-ups")
    public ResponseEntity<List<JobApplicationResponse>> getApplicationsWithFollowUps() {
        return ResponseEntity.ok(service.getApplicationsWithFollowUps());
    }
}
