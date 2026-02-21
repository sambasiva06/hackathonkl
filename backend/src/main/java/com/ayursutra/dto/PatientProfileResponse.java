package com.ayursutra.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PatientProfileResponse {
    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String prakriti;
    private String notes;
}
