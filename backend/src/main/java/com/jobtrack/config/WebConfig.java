package com.jobtrack.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web MVC Configuration for CORS (Cross-Origin Resource Sharing).
 *
 * Concepts for learners:
 * - When React runs on http://localhost:5173 and calls Spring Boot on http://localhost:8080,
 *   the browser blocks the request by default (Same-Origin Policy).
 * - WebMvcConfigurer allows configuring CORS rules so our React frontend can safely call the REST API.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                // allowedOriginPatterns supports wildcards (needed for Vercel preview URLs)
                // This allows: localhost for dev, and any *.vercel.app for production
                .allowedOriginPatterns(
                        "http://localhost:5173",
                        "http://127.0.0.1:5173",
                        "http://localhost:3000",
                        "https://job-track-eta-jet.vercel.app",  // your exact Vercel production URL
                        "https://*.vercel.app"                   // all Vercel preview deployments
                )
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
