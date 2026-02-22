package com.ayursutra.repository;

import com.ayursutra.model.PatientProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PatientProfileRepository extends JpaRepository<PatientProfile, Long> {
    Optional<PatientProfile> findByUserId(Long userId);

    boolean existsByUserId(Long userId);

    @org.springframework.data.jpa.repository.Query("SELECT p FROM PatientProfile p WHERE p.practitioner.id = :practitionerId")
    java.util.List<PatientProfile> findByPractitionerId(@org.springframework.data.repository.query.Param("practitionerId") Long practitionerId);
}
