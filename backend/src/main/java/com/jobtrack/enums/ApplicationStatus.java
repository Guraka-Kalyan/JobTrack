package com.jobtrack.enums;

/**
 * Represents the lifecycle stages of a job application.
 */
public enum ApplicationStatus {
    WISHLIST("Wishlist"),
    APPLIED("Applied"),
    ASSESSMENT("Assessment"),
    INTERVIEW("Interview"),
    OFFER("Offer"),
    REJECTED("Rejected"),
    WITHDRAWN("Withdrawn");

    private final String displayName;

    ApplicationStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
