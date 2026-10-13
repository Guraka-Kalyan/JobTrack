package com.jobtrack.service;

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
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service managing interview scheduling and updates.
 */
@Service
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final JobApplicationRepository applicationRepository;

    public InterviewService(InterviewRepository interviewRepository, JobApplicationRepository applicationRepository) {
        this.interviewRepository = interviewRepository;
        this.applicationRepository = applicationRepository;
    }

    @Transactional(readOnly = true)
    public List<InterviewResponse> getAllInterviews() {
        return interviewRepository.findAll(Sort.by(Sort.Direction.DESC, "scheduledAt"))
                .stream()
                .map(InterviewResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public InterviewResponse getInterviewById(Long id) {
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interview", "id", id));
        return InterviewResponse.fromEntity(interview);
    }

    @Transactional(readOnly = true)
    public List<InterviewResponse> getInterviewsByApplication(Long applicationId) {
        return interviewRepository.findByJobApplicationIdOrderByScheduledAtDesc(applicationId)
                .stream()
                .map(InterviewResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<InterviewResponse> getUpcomingInterviews() {
        return interviewRepository.findUpcomingInterviews(LocalDateTime.now())
                .stream()
                .map(InterviewResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<InterviewResponse> getPastInterviews() {
        return interviewRepository.findPastInterviews(LocalDateTime.now())
                .stream()
                .map(InterviewResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public InterviewResponse createInterview(InterviewRequest request) {
        JobApplication application = applicationRepository.findById(request.getJobApplicationId())
                .orElseThrow(() -> new ResourceNotFoundException("JobApplication", "id", request.getJobApplicationId()));

        Interview interview = new Interview();
        interview.setJobApplication(application);
        interview.setRoundName(request.getRoundName() != null ? request.getRoundName() : InterviewRound.TECHNICAL);
        interview.setScheduledAt(request.getScheduledAt());
        interview.setInterviewMode(request.getInterviewMode() != null ? request.getInterviewMode() : InterviewMode.ONLINE);
        interview.setMeetingLink(request.getMeetingLink());
        interview.setLocation(request.getLocation());
        interview.setStatus(request.getStatus() != null ? request.getStatus() : InterviewStatus.SCHEDULED);
        interview.setNotes(request.getNotes());

        // Helpful workflow rule: if the application is still APPLIED or WISHLIST, promote it to INTERVIEW
        if (application.getStatus() == ApplicationStatus.APPLIED || application.getStatus() == ApplicationStatus.WISHLIST) {
            application.setStatus(ApplicationStatus.INTERVIEW);
            applicationRepository.save(application);
        }

        Interview saved = interviewRepository.save(interview);
        return InterviewResponse.fromEntity(saved);
    }

    @Transactional
    public InterviewResponse updateInterview(Long id, InterviewRequest request) {
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interview", "id", id));

        if (request.getJobApplicationId() != null &&
            !request.getJobApplicationId().equals(interview.getJobApplication().getId())) {
            JobApplication newApp = applicationRepository.findById(request.getJobApplicationId())
                    .orElseThrow(() -> new ResourceNotFoundException("JobApplication", "id", request.getJobApplicationId()));
            interview.setJobApplication(newApp);
        }

        if (request.getRoundName() != null) {
            interview.setRoundName(request.getRoundName());
        }
        if (request.getScheduledAt() != null) {
            interview.setScheduledAt(request.getScheduledAt());
        }
        if (request.getInterviewMode() != null) {
            interview.setInterviewMode(request.getInterviewMode());
        }
        interview.setMeetingLink(request.getMeetingLink());
        interview.setLocation(request.getLocation());
        if (request.getStatus() != null) {
            interview.setStatus(request.getStatus());
        }
        interview.setNotes(request.getNotes());

        Interview updated = interviewRepository.save(interview);
        return InterviewResponse.fromEntity(updated);
    }

    @Transactional
    public InterviewResponse updateStatus(Long id, InterviewStatus status) {
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interview", "id", id));
        interview.setStatus(status);
        Interview updated = interviewRepository.save(interview);
        return InterviewResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteInterview(Long id) {
        if (!interviewRepository.existsById(id)) {
            throw new ResourceNotFoundException("Interview", "id", id);
        }
        interviewRepository.deleteById(id);
    }
}
