package com.jobtrack.enums;

public enum WorkMode {
    ON_SITE("On-site"),
    HYBRID("Hybrid"),
    REMOTE("Remote");

    private final String displayName;

    WorkMode(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
