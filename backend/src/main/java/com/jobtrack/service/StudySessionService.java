package com.jobtrack.service;

import com.jobtrack.dto.StudySessionRequest;
import com.jobtrack.dto.StudySessionResponse;
import com.jobtrack.entity.StudySession;
import com.jobtrack.exception.ResourceNotFoundException;
import com.jobtrack.repository.StudySessionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service managing preparation/study sessions and calculations.
 */
@Service
public class StudySessionService {

    private final StudySessionRepository repository;

    public StudySessionService(StudySessionRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<StudySessionResponse> getAllSessions() {
        return repository.findAllByOrderByStudyDateDescCreatedAtDesc()
                .stream()
                .map(StudySessionResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StudySessionResponse> getFilteredSessions(String subject, LocalDate startDate, LocalDate endDate) {
        String cleanSubject = (subject != null && !subject.isBlank() && !subject.equalsIgnoreCase("ALL")) ? subject.trim() : null;
        return repository.findWithFilters(cleanSubject, startDate, endDate)
                .stream()
                .map(StudySessionResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StudySessionResponse getSessionById(Long id) {
        StudySession session = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("StudySession", "id", id));
        return StudySessionResponse.fromEntity(session);
    }

    @Transactional
    public StudySessionResponse createSession(StudySessionRequest request) {
        StudySession session = new StudySession();
        mapRequestToEntity(request, session);
        StudySession saved = repository.save(session);
        return StudySessionResponse.fromEntity(saved);
    }

    @Transactional
    public StudySessionResponse updateSession(Long id, StudySessionRequest request) {
        StudySession session = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("StudySession", "id", id));
        mapRequestToEntity(request, session);
        StudySession updated = repository.save(session);
        return StudySessionResponse.fromEntity(updated);
    }

    @Transactional
    public StudySessionResponse toggleComplete(Long id) {
        StudySession session = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("StudySession", "id", id));
        session.setCompleted(!Boolean.TRUE.equals(session.getCompleted()));
        StudySession updated = repository.save(session);
        return StudySessionResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteSession(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("StudySession", "id", id);
        }
        repository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public long getTotalStudyMinutes() {
        Long sum = repository.sumTotalDurationMinutes();
        return sum != null ? sum : 0L;
    }

    @Transactional(readOnly = true)
    public long getWeeklyStudyMinutes() {
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate endOfWeek = today.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));
        Long sum = repository.sumDurationMinutesBetween(startOfWeek, endOfWeek);
        return sum != null ? sum : 0L;
    }

    private void mapRequestToEntity(StudySessionRequest request, StudySession session) {
        session.setStudyDate(request.getStudyDate() != null ? request.getStudyDate() : LocalDate.now());
        session.setSubject(request.getSubject().trim());
        session.setTopic(request.getTopic().trim());
        session.setActivityDescription(request.getActivityDescription());
        session.setDurationMinutes(request.getDurationMinutes());
        session.setCompleted(request.getCompleted() != null ? request.getCompleted() : true);
        session.setNotes(request.getNotes());
    }
}
