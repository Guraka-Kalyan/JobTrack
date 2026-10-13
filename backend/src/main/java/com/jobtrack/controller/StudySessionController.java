package com.jobtrack.controller;

import com.jobtrack.dto.StudySessionRequest;
import com.jobtrack.dto.StudySessionResponse;
import com.jobtrack.service.StudySessionService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST Controller exposing endpoints for Study and Interview Preparation tracking.
 */
@RestController
@RequestMapping("/api/study-sessions")
public class StudySessionController {

    private final StudySessionService service;

    public StudySessionController(StudySessionService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<StudySessionResponse>> getAllSessions(
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        if (subject != null || startDate != null || endDate != null) {
            return ResponseEntity.ok(service.getFilteredSessions(subject, startDate, endDate));
        }
        return ResponseEntity.ok(service.getAllSessions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudySessionResponse> getSessionById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getSessionById(id));
    }

    @PostMapping
    public ResponseEntity<StudySessionResponse> createSession(@Valid @RequestBody StudySessionRequest request) {
        StudySessionResponse created = service.createSession(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudySessionResponse> updateSession(
            @PathVariable Long id,
            @Valid @RequestBody StudySessionRequest request
    ) {
        StudySessionResponse updated = service.updateSession(id, request);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/toggle-complete")
    public ResponseEntity<StudySessionResponse> toggleComplete(@PathVariable Long id) {
        StudySessionResponse updated = service.toggleComplete(id);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSession(@PathVariable Long id) {
        service.deleteSession(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary() {
        Map<String, Object> summary = new HashMap<>();
        long totalMin = service.getTotalStudyMinutes();
        long weeklyMin = service.getWeeklyStudyMinutes();
        summary.put("totalMinutes", totalMin);
        summary.put("totalHours", Math.round((totalMin / 60.0) * 10.0) / 10.0);
        summary.put("weeklyMinutes", weeklyMin);
        summary.put("weeklyHours", Math.round((weeklyMin / 60.0) * 10.0) / 10.0);
        return ResponseEntity.ok(summary);
    }
}
