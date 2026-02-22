package com.ayursutra.service;

import com.ayursutra.dto.*;
import com.ayursutra.exception.BadRequestException;
import com.ayursutra.exception.ResourceNotFoundException;
import com.ayursutra.model.*;
import com.ayursutra.model.enums.Role;
import com.ayursutra.model.enums.SessionStatus;
import com.ayursutra.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PractitionerService {

    private final UserRepository userRepository;
    private final PatientProfileRepository patientProfileRepository;
    private final TherapyPlanRepository therapyPlanRepository;
    private final TherapySessionRepository therapySessionRepository;
    private final FeedbackRepository feedbackRepository;
    private final NotificationService notificationService;

    public PractitionerService(UserRepository userRepository,
                               PatientProfileRepository patientProfileRepository,
                               TherapyPlanRepository therapyPlanRepository,
                               TherapySessionRepository therapySessionRepository,
                               FeedbackRepository feedbackRepository,
                               NotificationService notificationService) {
        this.userRepository = userRepository;
        this.patientProfileRepository = patientProfileRepository;
        this.therapyPlanRepository = therapyPlanRepository;
        this.therapySessionRepository = therapySessionRepository;
        this.feedbackRepository = feedbackRepository;
        this.notificationService = notificationService;
    }

    public PatientProfileResponse createPatient(PatientProfileRequest request, Long practitionerId) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        // Create user account for the patient
        User patientUser = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder()
                        .encode(request.getPassword()))
                .role(Role.PATIENT)
                .build();
        patientUser = userRepository.save(patientUser);

        // Create patient profile
        PatientProfile profile = PatientProfile.builder()
                .user(patientUser)
                .practitioner(userRepository.findById(practitionerId).orElse(null))
                .age(request.getAge())
                .gender(request.getGender())
                .bloodGroup(request.getBloodGroup())
                .emergencyContact(request.getEmergencyContact())
                .medicalHistory(request.getMedicalHistory())
                .prakriti(request.getPrakriti())
                .notes(request.getNotes())
                .build();
        profile = patientProfileRepository.save(profile);

        notificationService.sendWelcomeNotification(patientUser);

        return toPatientProfileResponse(profile);
    }

    public List<PatientProfileResponse> getAllPatients(Long practitionerId) {
        return patientProfileRepository.findByPractitionerId(practitionerId).stream()
                .map(this::toPatientProfileResponse)
                .collect(Collectors.toList());
    }

    public TherapyPlanResponse createTherapyPlan(TherapyPlanRequest request, Long practitionerId) {
        User patient = userRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with ID: " + request.getPatientId()));

        User practitioner = userRepository.findById(practitionerId)
                .orElseThrow(() -> new ResourceNotFoundException("Practitioner not found"));

        TherapyPlan plan = TherapyPlan.builder()
                .patient(patient)
                .practitioner(practitioner)
                .phase(request.getPhase())
                .description(request.getDescription())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .build();

        plan = therapyPlanRepository.save(plan);
        return toTherapyPlanResponse(plan);
    }

    public TherapySessionResponse scheduleSession(TherapySessionRequest request, Long practitionerId) {
        TherapyPlan plan = therapyPlanRepository.findById(request.getTherapyPlanId())
                .orElseThrow(() -> new ResourceNotFoundException("Therapy plan not found"));

        if (!plan.getPractitioner().getId().equals(practitionerId)) {
            throw new BadRequestException("You can only schedule sessions for your own therapy plans");
        }

        // Conflict Detection: Check for sessions within 60 minutes of the proposed time
        LocalDateTime proposedTime = request.getScheduledDate();
        LocalDateTime bufferStart = proposedTime.minusMinutes(59);
        LocalDateTime bufferEnd = proposedTime.plusMinutes(59);

        List<TherapySession> conflicts = therapySessionRepository.findConflictingSessions(practitionerId, bufferStart, bufferEnd);
        if (!conflicts.isEmpty()) {
            TherapySession conflict = conflicts.get(0);
            throw new BadRequestException("Schedule Conflict: You already have a '" + 
                conflict.getProcedureName() + "' session scheduled at " + 
                conflict.getScheduledDate().toString().replace("T", " "));
        }

        TherapySession session = TherapySession.builder()
                .therapyPlan(plan)
                .procedureName(request.getProcedureName())
                .scheduledDate(request.getScheduledDate())
                .notes(request.getNotes())
                .status(SessionStatus.SCHEDULED)
                .build();

        session = therapySessionRepository.save(session);

        // Send session reminder & automated pre-procedure instructions
        notificationService.sendSessionReminder(
                plan.getPatient(),
                session.getProcedureName(),
                session.getScheduledDate().toString()
        );
        notificationService.sendPreProcedureInstructions(plan.getPatient(), session.getProcedureName());

        return toSessionResponse(session);
    }

    public TherapySessionResponse updateSessionStatus(Long sessionId, SessionStatus status, Long practitionerId) {
        TherapySession session = therapySessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));

        if (!session.getTherapyPlan().getPractitioner().getId().equals(practitionerId)) {
            throw new BadRequestException("You can only update sessions for your own therapy plans");
        }

        session.setStatus(status);
        session = therapySessionRepository.save(session);

        if (status == SessionStatus.COMPLETED) {
            // Trigger automated post-procedure recovery tips
            notificationService.sendPostProcedureTips(session.getTherapyPlan().getPatient(), session.getProcedureName());
            notificationService.sendFeedbackReminder(session.getTherapyPlan().getPatient(), session.getProcedureName());
        }

        return toSessionResponse(session);
    }

    public DashboardResponse getDashboard(Long practitionerId) {
        List<TherapySession> allSessions = therapySessionRepository.findByPractitionerId(practitionerId);
        List<TherapySession> upcoming = therapySessionRepository
                .findByPractitionerIdAndStatus(practitionerId, SessionStatus.SCHEDULED);

        long completed = allSessions.stream().filter(s -> s.getStatus() == SessionStatus.COMPLETED).count();

        List<PatientProfileResponse> patients = patientProfileRepository.findAll().stream()
                .map(this::toPatientProfileResponse)
                .collect(Collectors.toList());

        List<Long> sessionsWithFeedback = feedbackRepository.findByPractitionerId(practitionerId).stream()
                .map(f -> f.getSession().getId())
                .collect(Collectors.toList());

        long pendingFeedback = allSessions.stream()
                .filter(s -> s.getStatus() == SessionStatus.COMPLETED && !sessionsWithFeedback.contains(s.getId()))
                .count();

        return DashboardResponse.builder()
                .totalPatients(patients.size())
                .totalSessions(allSessions.size())
                .completedSessions(completed)
                .upcomingSessions(upcoming.size())
                .pendingFeedback(pendingFeedback)
                .upcomingSessionList(upcoming.stream().map(this::toSessionResponse).collect(Collectors.toList()))
                .recentPatients(patients.stream()
                        .sorted((a, b) -> Long.compare(b.getId(), a.getId()))
                        .limit(5)
                        .collect(Collectors.toList()))
                .build();
    }

    public List<FeedbackResponse> getAllFeedback(Long practitionerId) {
        return feedbackRepository.findByPractitionerId(practitionerId).stream()
                .map(this::toFeedbackResponse)
                .collect(Collectors.toList());
    }

    public List<TherapyPlanResponse> getTherapyPlans(Long practitionerId) {
        return therapyPlanRepository.findByPractitionerId(practitionerId).stream()
                .sorted((a, b) -> Long.compare(b.getId(), a.getId()))
                .map(this::toTherapyPlanResponse)
                .collect(Collectors.toList());
    }

    // =========== Mappers ===========

    private PatientProfileResponse toPatientProfileResponse(PatientProfile profile) {
        return PatientProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUser().getId())
                .name(profile.getUser().getName())
                .email(profile.getUser().getEmail())
                .prakriti(profile.getPrakriti())
                .age(profile.getAge())
                .gender(profile.getGender())
                .bloodGroup(profile.getBloodGroup())
                .emergencyContact(profile.getEmergencyContact())
                .medicalHistory(profile.getMedicalHistory())
                .notes(profile.getNotes())
                .practitionerId(profile.getPractitioner() != null ? profile.getPractitioner().getId() : null)
                .practitionerName(profile.getPractitioner() != null ? profile.getPractitioner().getName() : "Unassigned")
                .build();
    }

    private TherapyPlanResponse toTherapyPlanResponse(TherapyPlan plan) {
        return TherapyPlanResponse.builder()
                .id(plan.getId())
                .patientId(plan.getPatient().getId())
                .patientName(plan.getPatient().getName())
                .practitionerId(plan.getPractitioner().getId())
                .practitionerName(plan.getPractitioner().getName())
                .phase(plan.getPhase())
                .description(plan.getDescription())
                .startDate(plan.getStartDate())
                .endDate(plan.getEndDate())
                .build();
    }

    private TherapySessionResponse toSessionResponse(TherapySession session) {
        FeedbackResponse fb = feedbackRepository.findBySessionId(session.getId())
                .map(this::toFeedbackResponse)
                .orElse(null);

        return TherapySessionResponse.builder()
                .id(session.getId())
                .therapyPlanId(session.getTherapyPlan().getId())
                .phase(session.getTherapyPlan().getPhase())
                .procedureName(session.getProcedureName())
                .scheduledDate(session.getScheduledDate())
                .notes(session.getNotes())
                .status(session.getStatus())
                .practitionerName(session.getTherapyPlan().getPractitioner().getName())
                .patientName(session.getTherapyPlan().getPatient().getName())
                .feedback(fb)
                .build();
    }

    private FeedbackResponse toFeedbackResponse(Feedback feedback) {
        return FeedbackResponse.builder()
                .id(feedback.getId())
                .sessionId(feedback.getSession().getId())
                .procedureName(feedback.getSession().getProcedureName())
                .patientName(feedback.getPatient().getName())
                .message(feedback.getMessage())
                .rating(feedback.getRating())
                .createdAt(feedback.getCreatedAt())
                .build();
    }
}
