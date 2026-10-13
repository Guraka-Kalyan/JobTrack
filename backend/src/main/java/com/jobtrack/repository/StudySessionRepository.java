package com.jobtrack.repository;

import com.jobtrack.entity.StudySession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Spring Data JPA Repository for StudySession entity.
 */
@Repository
public interface StudySessionRepository extends JpaRepository<StudySession, Long> {

    // Retrieve all sessions ordered by date descending
    List<StudySession> findAllByOrderByStudyDateDescCreatedAtDesc();

    // Filter by subject
    List<StudySession> findBySubjectIgnoreCaseOrderByStudyDateDesc(String subject);

    // Sum of all durations in minutes
    @Query("SELECT COALESCE(SUM(s.durationMinutes), 0) FROM StudySession s WHERE s.completed = true")
    Long sumTotalDurationMinutes();

    // Sum of durations in minutes within a date range (e.g. this week)
    @Query("SELECT COALESCE(SUM(s.durationMinutes), 0) FROM StudySession s WHERE s.studyDate >= :startDate AND s.studyDate <= :endDate AND s.completed = true")
    Long sumDurationMinutesBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Group study minutes by subject for Analytics
    @Query("SELECT s.subject, COALESCE(SUM(s.durationMinutes), 0) FROM StudySession s WHERE s.completed = true GROUP BY s.subject ORDER BY SUM(s.durationMinutes) DESC")
    List<Object[]> sumDurationMinutesGroupedBySubject();

    // Filter by date range and subject
    @Query("SELECT s FROM StudySession s WHERE " +
           "(:subject IS NULL OR LOWER(s.subject) = LOWER(:subject)) AND " +
           "(:startDate IS NULL OR s.studyDate >= :startDate) AND " +
           "(:endDate IS NULL OR s.studyDate <= :endDate) " +
           "ORDER BY s.studyDate DESC, s.createdAt DESC")
    List<StudySession> findWithFilters(
            @Param("subject") String subject,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}
