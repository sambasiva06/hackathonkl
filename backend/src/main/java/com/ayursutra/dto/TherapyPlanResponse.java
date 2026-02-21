package com.ayursutra.dto;

import com.ayursutra.model.enums.Phase;
import lombok.*;

import java.time.LocalDate;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class TherapyPlanResponse {
    private Long id;
    private Long patientId;
    private String patientName;
    private Long practitionerId;
    private String practitionerName;
    private Phase phase;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
}
