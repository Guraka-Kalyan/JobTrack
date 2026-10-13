package com.jobtrack.repository;

import com.jobtrack.entity.JobApplication;
import com.jobtrack.enums.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

/**
 * Spring Data JPA Repository for JobApplication entity.
 *
 * Concepts for learners:
 * - Extending JpaRepository<JobApplication, Long> gives us standard CRUD operations:
 *   save(), findById(), findAll(), deleteById(), count(), etc. without writing any SQL!
 * - Spring Data JPA generates queries automatically based on method names
 *   (e.g., countByStatus, findTop5ByOrderByApplicationDateDesc).
 * - @Query allows custom JPQL (Java Persistence Query Language) when complex filtering is needed.
 */
@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    // Count applications by status (e.g., OFFER, INTERVIEW)
    long countByStatus(ApplicationStatus status);

    // Count applications in interview stages
    long countByStatusIn(Collection<ApplicationStatus> statuses);

    // Count applications submitted within a date range (e.g. this week)
    long countByApplicationDateBetween(LocalDate startDate, LocalDate endDate);

    // Count follow-ups due on or before a date that have not been completed
    long countByFollowUpCompletedFalseAndNextFollowUpDateLessThanEqual(LocalDate date);

    // Recent 5 applications for dashboard
    List<JobApplication> findTop5ByOrderByApplicationDateDescCreatedAtDesc();

    // Overdue follow-ups: follow_up_date < today and not completed
    List<JobApplication> findByFollowUpCompletedFalseAndNextFollowUpDateLessThanOrderByNextFollowUpDateAsc(LocalDate date);

    // Due today follow-ups: follow_up_date == today and not completed
    List<JobApplication> findByFollowUpCompletedFalseAndNextFollowUpDateOrderByCompanyNameAsc(LocalDate date);

    // Upcoming follow-ups: follow_up_date > today
    List<JobApplication> findByFollowUpCompletedFalseAndNextFollowUpDateGreaterThanOrderByNextFollowUpDateAsc(LocalDate date);

    // All applications with a next follow-up date configured
    List<JobApplication> findByNextFollowUpDateIsNotNullOrderByNextFollowUpDateAsc();

    // Flexible filtered search query with pagination
    @Query("SELECT j FROM JobApplication j WHERE " +
           "(:search IS NULL OR LOWER(j.companyName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(j.jobTitle) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(j.location) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:status IS NULL OR j.status = :status) AND " +
           "(:workMode IS NULL OR j.workMode = :workMode) AND " +
           "(:employmentType IS NULL OR j.employmentType = :employmentType) AND " +
           "(:startDate IS NULL OR j.applicationDate >= :startDate) AND " +
           "(:endDate IS NULL OR j.applicationDate <= :endDate)")
    Page<JobApplication> findWithFilters(
            @Param("search") String search,
            @Param("status") ApplicationStatus status,
            @Param("workMode") com.jobtrack.enums.WorkMode workMode,
            @Param("employmentType") com.jobtrack.enums.EmploymentType employmentType,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable
    );
}
