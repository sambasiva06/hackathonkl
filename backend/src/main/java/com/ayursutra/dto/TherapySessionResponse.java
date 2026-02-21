package com.ayursutra.dto;

import com.ayursutra.model.enums.Phase;
import com.ayursutra.model.enums.SessionStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class TherapySessionResponse {
    private Long id;
    private Long therapyPlanId;
    private Phase phase;
    private String procedureName;
    private LocalDateTime scheduledDate;
    private String notes;
    private SessionStatus status;
    private String practitionerName;
    private String patientName;
    private FeedbackResponse feedback;
}
