package com.ayursutra.repository;

import com.ayursutra.model.TherapySession;
import com.ayursutra.model.enums.SessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TherapySessionRepository extends JpaRepository<TherapySession, Long> {
    List<TherapySession> findByTherapyPlanId(Long therapyPlanId);

    @Query("SELECT s FROM TherapySession s WHERE s.therapyPlan.patient.id = :patientId ORDER BY s.scheduledDate ASC")
    List<TherapySession> findByPatientId(@Param("patientId") Long patientId);

    @Query("SELECT s FROM TherapySession s WHERE s.therapyPlan.practitioner.id = :practitionerId AND s.status = :status ORDER BY s.scheduledDate ASC")
    List<TherapySession> findByPractitionerIdAndStatus(@Param("practitionerId") Long practitionerId, @Param("status") SessionStatus status);

    @Query("SELECT s FROM TherapySession s WHERE s.therapyPlan.practitioner.id = :practitionerId ORDER BY s.scheduledDate ASC")
    List<TherapySession> findByPractitionerId(@Param("practitionerId") Long practitionerId);

    @Query("SELECT s FROM TherapySession s WHERE s.scheduledDate BETWEEN :start AND :end AND s.status = 'SCHEDULED'")
    List<TherapySession> findUpcomingSessions(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
