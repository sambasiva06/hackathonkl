package com.ayursutra.repository;

import com.ayursutra.model.TherapyPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TherapyPlanRepository extends JpaRepository<TherapyPlan, Long> {
    List<TherapyPlan> findByPatientId(Long patientId);
    List<TherapyPlan> findByPractitionerId(Long practitionerId);
}
