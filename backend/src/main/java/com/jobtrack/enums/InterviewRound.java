package com.jobtrack.enums;

public enum InterviewRound {
    ASSESSMENT("Assessment"),
    TECHNICAL("Technical"),
    HR("HR"),
    MANAGERIAL("Managerial"),
    FINAL("Final"),
    OTHER("Other");

    private final String displayName;

    InterviewRound(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
