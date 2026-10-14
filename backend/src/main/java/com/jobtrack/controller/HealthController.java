package com.jobtrack.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * HealthController - A lightweight endpoint to check if the server is running.
 *
 * Why this exists:
 * - Free cloud services (like Render) put apps to sleep after inactivity.
 * - UptimeRobot (free service) pings this endpoint every 5 minutes to keep the server awake.
 * - This endpoint does NO database queries — it just returns 200 OK instantly.
 * - This is much better than pinging /api/applications which hits the database.
 *
 * Usage: GET /api/health
 */
@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "JobTrack Backend",
                "timestamp", LocalDateTime.now().toString()
        ));
    }
}
