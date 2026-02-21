package com.ayursutra.dto;

import lombok.*;

import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class DashboardResponse {
    private long totalPatients;
    private long totalSessions;
    private long completedSessions;
    private long upcomingSessions;
    private long pendingFeedback;
    private List<TherapySessionResponse> upcomingSessionList;
    private List<PatientProfileResponse> recentPatients;
}
