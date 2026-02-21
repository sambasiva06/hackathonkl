package com.ayursutra.dto;

import com.ayursutra.model.enums.Phase;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class TherapyPlanRequest {

    @NotNull(message = "Patient ID is required")
    private Long patientId;

    @NotNull(message = "Phase is required")
    private Phase phase;

    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
}
