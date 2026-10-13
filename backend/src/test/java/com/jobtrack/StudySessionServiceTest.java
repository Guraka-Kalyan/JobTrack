package com.jobtrack;

import com.jobtrack.dto.StudySessionRequest;
import com.jobtrack.dto.StudySessionResponse;
import com.jobtrack.entity.StudySession;
import com.jobtrack.repository.StudySessionRepository;
import com.jobtrack.service.StudySessionService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudySessionServiceTest {

    @Mock
    private StudySessionRepository repository;

    @InjectMocks
    private StudySessionService service;

    @Test
    @DisplayName("Should create study session with valid duration")
    void testCreateStudySession() {
        StudySessionRequest request = new StudySessionRequest();
        request.setStudyDate(LocalDate.now());
        request.setSubject("Core Java");
        request.setTopic("Multithreading and Concurrency");
        request.setDurationMinutes(90);
        request.setCompleted(true);

        StudySession entity = new StudySession(LocalDate.now(), "Core Java", "Multithreading and Concurrency", 90, true);
        entity.setId(10L);

        when(repository.save(any(StudySession.class))).thenReturn(entity);

        StudySessionResponse response = service.createSession(request);

        assertNotNull(response);
        assertEquals(10L, response.getId());
        assertEquals("Core Java", response.getSubject());
        assertEquals(90, response.getDurationMinutes());
        assertEquals("1 hr 30 min", response.getFormattedDuration());
    }

    @Test
    @DisplayName("Should toggle completion status of study session")
    void testToggleComplete() {
        StudySession entity = new StudySession(LocalDate.now(), "JDBC", "PreparedStatement vs Statement", 60, false);
        entity.setId(5L);

        when(repository.findById(5L)).thenReturn(Optional.of(entity));
        when(repository.save(any(StudySession.class))).thenAnswer(invocation -> invocation.getArgument(0));

        StudySessionResponse response = service.toggleComplete(5L);

        assertNotNull(response);
        assertTrue(response.getCompleted());
    }
}
