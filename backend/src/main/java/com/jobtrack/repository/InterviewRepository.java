package com.jobtrack.repository;

import com.jobtrack.entity.Interview;
import com.jobtrack.enums.InterviewStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Spring Data JPA Repository for Interview entity.
 */
@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {

    // Find all interviews for a specific job application
    List<Interview> findByJobApplicationIdOrderByScheduledAtDesc(Long jobApplicationId);

    // Find upcoming scheduled interviews ordered by earliest first
    @Query("SELECT i FROM Interview i WHERE i.scheduledAt >= :now AND i.status != 'CANCELLED' ORDER BY i.scheduledAt ASC")
    List<Interview> findUpcomingInterviews(@Param("now") LocalDateTime now);

    // Find recent past interviews
    @Query("SELECT i FROM Interview i WHERE i.scheduledAt < :now ORDER BY i.scheduledAt DESC")
    List<Interview> findPastInterviews(@Param("now") LocalDateTime now);

    // Count interviews by status
    long countByStatus(InterviewStatus status);
}
