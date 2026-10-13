package com.jobtrack.controller;

import com.jobtrack.dto.InterviewRequest;
import com.jobtrack.dto.InterviewResponse;
import com.jobtrack.enums.InterviewStatus;
import com.jobtrack.service.InterviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller exposing endpoints for Interview management.
 */
@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    private final InterviewService service;

    public InterviewController(InterviewService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<InterviewResponse>> getAllInterviews(
            @RequestParam(required = false) Long applicationId
    ) {
        if (applicationId != null) {
            return ResponseEntity.ok(service.getInterviewsByApplication(applicationId));
        }
        return ResponseEntity.ok(service.getAllInterviews());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InterviewResponse> getInterviewById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getInterviewById(id));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<InterviewResponse>> getUpcomingInterviews() {
        return ResponseEntity.ok(service.getUpcomingInterviews());
    }

    @GetMapping("/past")
    public ResponseEntity<List<InterviewResponse>> getPastInterviews() {
        return ResponseEntity.ok(service.getPastInterviews());
    }

    @PostMapping
    public ResponseEntity<InterviewResponse> createInterview(@Valid @RequestBody InterviewRequest request) {
        InterviewResponse created = service.createInterview(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InterviewResponse> updateInterview(
            @PathVariable Long id,
            @Valid @RequestBody InterviewRequest request
    ) {
        InterviewResponse updated = service.updateInterview(id, request);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<InterviewResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload
    ) {
        String statusStr = payload.get("status");
        InterviewStatus status = InterviewStatus.valueOf(statusStr.toUpperCase());
        InterviewResponse updated = service.updateStatus(id, status);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInterview(@PathVariable Long id) {
        service.deleteInterview(id);
        return ResponseEntity.noContent().build();
    }
}
