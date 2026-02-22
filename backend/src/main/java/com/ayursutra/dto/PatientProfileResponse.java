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
    private Integer age;
    private String gender;
    private String bloodGroup;
    private String emergencyContact;
    private String medicalHistory;
    private String notes;
    private String practitionerName;
    private Long practitionerId;
}
