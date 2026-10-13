package com.jobtrack;

import com.jobtrack.dto.JobApplicationRequest;
import com.jobtrack.dto.JobApplicationResponse;
import com.jobtrack.entity.JobApplication;
import com.jobtrack.enums.ApplicationStatus;
import com.jobtrack.enums.WorkMode;
import com.jobtrack.exception.ResourceNotFoundException;
import com.jobtrack.repository.JobApplicationRepository;
import com.jobtrack.service.JobApplicationService;
import org.junit.jupiter.api.BeforeEach;
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

/**
 * Unit tests for JobApplicationService using Mockito.
 *
 * Concepts for learners:
 * - @ExtendWith(MockitoExtension.class) initializes Mockito mocks without booting the entire Spring container.
 * - @Mock creates a simulated JobApplicationRepository.
 * - @InjectMocks injects the mocked repository into JobApplicationService.
 * - Fast, isolated execution ensuring business logic correctness.
 */
@ExtendWith(MockitoExtension.class)
class JobApplicationServiceTest {

    @Mock
    private JobApplicationRepository repository;

    @InjectMocks
    private JobApplicationService service;

    private JobApplication sampleApplication;

    @BeforeEach
    void setUp() {
        sampleApplication = new JobApplication("Google", "Software Engineer", LocalDate.now(), ApplicationStatus.APPLIED);
        sampleApplication.setId(1L);
        sampleApplication.setWorkMode(WorkMode.HYBRID);
    }

    @Test
    @DisplayName("Should create application successfully")
    void testCreateApplication() {
        JobApplicationRequest request = new JobApplicationRequest();
        request.setCompanyName("Google");
        request.setJobTitle("Software Engineer");
        request.setStatus(ApplicationStatus.APPLIED);
        request.setWorkMode(WorkMode.HYBRID);

        when(repository.save(any(JobApplication.class))).thenReturn(sampleApplication);

        JobApplicationResponse response = service.createApplication(request);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Google", response.getCompanyName());
        assertEquals("Software Engineer", response.getJobTitle());
        verify(repository, times(1)).save(any(JobApplication.class));
    }

    @Test
    @DisplayName("Should find application by ID successfully")
    void testGetApplicationById_Success() {
        when(repository.findById(1L)).thenReturn(Optional.of(sampleApplication));

        JobApplicationResponse response = service.getApplicationById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Google", response.getCompanyName());
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when application does not exist")
    void testGetApplicationById_NotFound() {
        when(repository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.getApplicationById(999L));
    }

    @Test
    @DisplayName("Should delete application when ID exists")
    void testDeleteApplication_Success() {
        when(repository.existsById(1L)).thenReturn(true);
        doNothing().when(repository).deleteById(1L);

        assertDoesNotThrow(() -> service.deleteApplication(1L));
        verify(repository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException on delete when ID does not exist")
    void testDeleteApplication_NotFound() {
        when(repository.existsById(999L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> service.deleteApplication(999L));
        verify(repository, never()).deleteById(anyLong());
    }
}
