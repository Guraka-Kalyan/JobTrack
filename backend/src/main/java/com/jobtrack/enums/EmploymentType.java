package com.jobtrack.enums;

public enum EmploymentType {
    FULL_TIME("Full-time"),
    INTERNSHIP("Internship"),
    CONTRACT("Contract"),
    PART_TIME("Part-time");

    private final String displayName;

    EmploymentType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
