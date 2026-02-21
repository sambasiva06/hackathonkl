package com.ayursutra.dto;

import lombok.*;

import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class TherapyProgressResponse {
    private long totalSessions;
    private long completedSessions;
    private double completionPercentage;
    private List<PhaseProgress> phases;

    @Getter @Setter
    @NoArgsConstructor @AllArgsConstructor
    @Builder
    public static class PhaseProgress {
        private String phase;
        private long total;
        private long completed;
        private double percentage;
        private List<TherapySessionResponse> sessions;
    }
}
