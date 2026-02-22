package com.ayursutra.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "patient_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @ManyToOne
    @JoinColumn(name = "practitioner_id")
    private User practitioner;

    private Integer age;
    private String gender;
    private String bloodGroup;
    private String emergencyContact;

    @Column(length = 100)
    private String prakriti;

    @Column(columnDefinition = "TEXT")
    private String medicalHistory;

    @Column(columnDefinition = "TEXT")
    private String notes;

    public Long getId() { return id; }
    public User getUser() { return user; }
    public User getPractitioner() { return practitioner; }
    public Integer getAge() { return age; }
    public String getGender() { return gender; }
    public String getBloodGroup() { return bloodGroup; }
    public String getEmergencyContact() { return emergencyContact; }
    public String getPrakriti() { return prakriti; }
    public String getMedicalHistory() { return medicalHistory; }
    public String getNotes() { return notes; }
}
