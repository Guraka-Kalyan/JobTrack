package com.jobtrack;

import com.jobtrack.dto.InterviewRequest;
import com.jobtrack.dto.InterviewResponse;
import com.jobtrack.entity.Interview;
import com.jobtrack.entity.JobApplication;
import com.jobtrack.enums.ApplicationStatus;
import com.jobtrack.enums.InterviewMode;
import com.jobtrack.enums.InterviewRound;
import com.jobtrack.enums.InterviewStatus;
import com.jobtrack.exception.ResourceNotFoundException;
import com.jobtrack.repository.InterviewRepository;
import com.jobtrack.repository.JobApplicationRepository;
import com.jobtrack.service.InterviewService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InterviewServiceTest {

    @Mock
    private InterviewRepository interviewRepository;

    @Mock
    private JobApplicationRepository applicationRepository;

    @InjectMocks
    private InterviewService interviewService;

    @Test
    @DisplayName("Should schedule interview and promote application status to INTERVIEW")
    void testCreateInterview_Success() {
        JobApplication application = new JobApplication("Infosys", "Java Developer", LocalDate.now(), ApplicationStatus.APPLIED);
        application.setId(1L);

        InterviewRequest request = new InterviewRequest();
        request.setJobApplicationId(1L);
        request.setRoundName(InterviewRound.TECHNICAL);
        request.setScheduledAt(LocalDateTime.now().plusDays(2));
        request.setInterviewMode(InterviewMode.ONLINE);

        Interview savedInterview = new Interview(application, InterviewRound.TECHNICAL, request.getScheduledAt(), InterviewMode.ONLINE);
        savedInterview.setId(100L);

        when(applicationRepository.findById(1L)).thenReturn(Optional.of(application));
        when(interviewRepository.save(any(Interview.class))).thenReturn(savedInterview);

        InterviewResponse response = interviewService.createInterview(request);

        assertNotNull(response);
        assertEquals(100L, response.getId());
        assertEquals(1L, response.getJobApplicationId());
        assertEquals("Infosys", response.getCompanyName());
        // Verify application status was updated to INTERVIEW
        assertEquals(ApplicationStatus.INTERVIEW, application.getStatus());
        verify(applicationRepository, times(1)).save(application);
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when application does not exist")
    void testCreateInterview_ApplicationNotFound() {
        InterviewRequest request = new InterviewRequest();
        request.setJobApplicationId(999L);
        request.setScheduledAt(LocalDateTime.now().plusDays(1));

        when(applicationRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> interviewService.createInterview(request));
        verify(interviewRepository, never()).save(any(Interview.class));
    }
}
