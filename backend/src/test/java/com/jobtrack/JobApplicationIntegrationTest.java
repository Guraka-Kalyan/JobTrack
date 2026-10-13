package com.jobtrack;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobtrack.dto.JobApplicationRequest;
import com.jobtrack.enums.ApplicationStatus;
import com.jobtrack.enums.WorkMode;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * End-to-end integration tests using MockMvc.
 *
 * Concepts for learners:
 * - @SpringBootTest boots the entire Spring application context.
 * - @AutoConfigureMockMvc provides MockMvc to perform mock HTTP calls without starting a physical server.
 * - Verifies the full flow: HTTP Request -> Controller -> Service -> Repository -> Database.
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
class JobApplicationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("POST /api/applications should create application and return 201 Created")
    void testCreateApplicationEndpoint() throws Exception {
        JobApplicationRequest request = new JobApplicationRequest();
        request.setCompanyName("Microsoft");
        request.setJobTitle("Software Engineer - Fresher");
        request.setStatus(ApplicationStatus.APPLIED);
        request.setWorkMode(WorkMode.HYBRID);
        request.setApplicationDate(LocalDate.now());

        mockMvc.perform(post("/api/applications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.companyName").value("Microsoft"))
                .andExpect(jsonPath("$.jobTitle").value("Software Engineer - Fresher"))
                .andExpect(jsonPath("$.status").value("APPLIED"));
    }

    @Test
    @DisplayName("POST /api/applications with blank companyName should return 400 Bad Request with validation errors")
    void testCreateApplication_ValidationError() throws Exception {
        JobApplicationRequest invalidRequest = new JobApplicationRequest();
        invalidRequest.setCompanyName(""); // Invalid: blank
        invalidRequest.setJobTitle("Software Engineer");

        mockMvc.perform(post("/api/applications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Validation Failed"))
                .andExpect(jsonPath("$.fieldErrors.companyName").exists());
    }

    @Test
    @DisplayName("GET /api/dashboard/summary should return 200 OK with aggregated statistics")
    void testDashboardSummaryEndpoint() throws Exception {
        mockMvc.perform(get("/api/dashboard/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalApplications").isNumber())
                .andExpect(jsonPath("$.statusCounts").isMap())
                .andExpect(jsonPath("$.weeklyActivity").isArray());
    }

    @Test
    @DisplayName("GET /api/analytics/overview should return 200 OK with analytics data")
    void testAnalyticsOverviewEndpoint() throws Exception {
        mockMvc.perform(get("/api/analytics/overview"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalApplications").isNumber())
                .andExpect(jsonPath("$.statusDistribution").isMap())
                .andExpect(jsonPath("$.monthlyApplications").isArray());
    }
}
