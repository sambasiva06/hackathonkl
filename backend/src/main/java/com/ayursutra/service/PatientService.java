package com.ayursutra.service;

import com.ayursutra.dto.*;
import com.ayursutra.exception.BadRequestException;
import com.ayursutra.exception.ResourceNotFoundException;
import com.ayursutra.model.*;
import com.ayursutra.model.enums.Phase;
import com.ayursutra.model.enums.SessionStatus;
import com.ayursutra.repository.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PatientService {

    private final UserRepository userRepository;
    private final PatientProfileRepository patientProfileRepository;
    private final TherapyPlanRepository therapyPlanRepository;
    private final TherapySessionRepository therapySessionRepository;
    private final FeedbackRepository feedbackRepository;
    private final NotificationRepository notificationRepository;
    private final NotificationService notificationService;

    public PatientService(UserRepository userRepository,
                          PatientProfileRepository patientProfileRepository,
                          TherapyPlanRepository therapyPlanRepository,
                          TherapySessionRepository therapySessionRepository,
                          FeedbackRepository feedbackRepository,
                          NotificationRepository notificationRepository,
                          NotificationService notificationService) {
        this.userRepository = userRepository;
        this.patientProfileRepository = patientProfileRepository;
        this.therapyPlanRepository = therapyPlanRepository;
        this.therapySessionRepository = therapySessionRepository;
        this.feedbackRepository = feedbackRepository;
        this.notificationRepository = notificationRepository;
        this.notificationService = notificationService;
    }

    public List<TherapySessionResponse> getMySessions(Long patientId) {
        return therapySessionRepository.findByPatientId(patientId).stream()
                .map(this::toSessionResponse)
                .collect(Collectors.toList());
    }

    public FeedbackResponse submitFeedback(FeedbackRequest request, Long patientId) {
        TherapySession session = therapySessionRepository.findById(request.getSessionId())
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));

        if (!session.getTherapyPlan().getPatient().getId().equals(patientId)) {
            throw new BadRequestException("You can only submit feedback for your own sessions");
        }

        if (feedbackRepository.findBySessionId(session.getId()).isPresent()) {
            throw new BadRequestException("Feedback already submitted for this session");
        }

        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        // Mark session as completed
        session.setStatus(SessionStatus.COMPLETED);
        therapySessionRepository.save(session);

        Feedback feedback = Feedback.builder()
                .session(session)
                .patient(patient)
                .message(request.getMessage())
                .rating(request.getRating())
                .symptoms(request.getSymptoms())
                .sideEffects(request.getSideEffects())
                .improvementLevel(request.getImprovementLevel())
                .build();

        feedback = feedbackRepository.save(feedback);

        return toFeedbackResponse(feedback);
    }

    public TherapyProgressResponse getTherapyProgress(Long patientId) {
        List<TherapySession> allSessions = therapySessionRepository.findByPatientId(patientId);
        long completed = allSessions.stream().filter(s -> s.getStatus() == SessionStatus.COMPLETED).count();

        // Group sessions by phase
        Map<Phase, List<TherapySession>> byPhase = allSessions.stream()
                .collect(Collectors.groupingBy(s -> s.getTherapyPlan().getPhase()));

        List<TherapyProgressResponse.PhaseProgress> phases = new ArrayList<>();
        for (Phase phase : Phase.values()) {
            List<TherapySession> phaseSessions = byPhase.getOrDefault(phase, Collections.emptyList());
            long phaseCompleted = phaseSessions.stream().filter(s -> s.getStatus() == SessionStatus.COMPLETED).count();

            phases.add(TherapyProgressResponse.PhaseProgress.builder()
                    .phase(phase.name())
                    .total(phaseSessions.size())
                    .completed(phaseCompleted)
                    .percentage(phaseSessions.isEmpty() ? 0 : (double) phaseCompleted / phaseSessions.size() * 100)
                    .sessions(phaseSessions.stream().map(this::toSessionResponse).collect(Collectors.toList()))
                    .build());
        }

        return TherapyProgressResponse.builder()
                .totalSessions(allSessions.size())
                .completedSessions(completed)
                .completionPercentage(allSessions.isEmpty() ? 0 : (double) completed / allSessions.size() * 100)
                .phases(phases)
                .build();
    }

    public PatientProfileResponse getMyProfile(Long patientId) {
        PatientProfile profile = patientProfileRepository.findByUserId(patientId)
                .orElse(null);

        User user = userRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return PatientProfileResponse.builder()
                .id(profile != null ? profile.getId() : null)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .prakriti(profile != null ? profile.getPrakriti() : null)
                .notes(profile != null ? profile.getNotes() : null)
                .build();
    }

    public List<NotificationResponse> getMyNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(n -> NotificationResponse.builder()
                        .id(n.getId())
                        .subject(n.getSubject())
                        .body(n.getBody())
                        .sent(n.isSent())
                        .createdAt(n.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    // =========== Mappers ===========

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
                .symptoms(feedback.getSymptoms())
                .sideEffects(feedback.getSideEffects())
                .improvementLevel(feedback.getImprovementLevel())
                .createdAt(feedback.getCreatedAt())
                .build();
    }
}
