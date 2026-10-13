package com.jobtrack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the JobTrack Spring Boot application.
 *
 * Concepts for learners:
 * - @SpringBootApplication enables auto-configuration, component scanning (@ComponentScan),
 *   and property configuration (@Configuration).
 * - SpringApplication.run() bootstraps the Spring context, sets up the embedded Tomcat server,
 *   and starts listening on port 8080.
 */
@SpringBootApplication
public class JobTrackApplication {

    public static void main(String[] args) {
        SpringApplication.run(JobTrackApplication.class, args);
    }
}
