package com.ayursutra.repository;

import com.ayursutra.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    Optional<Feedback> findBySessionId(Long sessionId);

    List<Feedback> findByPatientId(Long patientId);

    @Query("SELECT f FROM Feedback f WHERE f.session.therapyPlan.practitioner.id = :practitionerId ORDER BY f.createdAt DESC")
    List<Feedback> findByPractitionerId(@Param("practitionerId") Long practitionerId);
}
