package com.jobtrack.enums;

public enum InterviewMode {
    ONLINE("Online / Video"),
    IN_PERSON("In-Person"),
    PHONE("Phone");

    private final String displayName;

    InterviewMode(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
