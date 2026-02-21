package com.ayursutra.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class TherapySessionRequest {

    @NotNull(message = "Therapy plan ID is required")
    private Long therapyPlanId;

    @NotBlank(message = "Procedure name is required")
    private String procedureName;

    @NotNull(message = "Scheduled date is required")
    private LocalDateTime scheduledDate;

    private String notes;
}
