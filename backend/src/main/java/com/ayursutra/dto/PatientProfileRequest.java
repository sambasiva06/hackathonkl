package com.ayursutra.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class PatientProfileRequest {

    @NotBlank(message = "Patient name is required")
    private String name;

    @NotBlank(message = "Patient email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    private Integer age;
    private String gender;
    private String bloodGroup;
    private String emergencyContact;
    private String medicalHistory;
    private String prakriti;
    private String notes;
}
