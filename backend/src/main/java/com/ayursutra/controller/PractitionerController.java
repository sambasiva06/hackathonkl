package com.ayursutra.controller;

import com.ayursutra.dto.*;
import com.ayursutra.security.JwtUtil;
import com.ayursutra.security.SecurityUtil;
import com.ayursutra.service.PractitionerService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@PreAuthorize("hasRole('PRACTITIONER')")
public class PractitionerController {

    private final PractitionerService practitionerService;
    private final JwtUtil jwtUtil;

    public PractitionerController(PractitionerService practitionerService, JwtUtil jwtUtil) {
        this.practitionerService = practitionerService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/patients")
    public ResponseEntity<PatientProfileResponse> createPatient(
            @Valid @RequestBody PatientProfileRequest request,
            HttpServletRequest httpRequest) {
        Long practitionerId = extractUserId(httpRequest);
        return ResponseEntity.ok(practitionerService.createPatient(request, practitionerId));
    }

    @GetMapping("/patients")
    public ResponseEntity<List<PatientProfileResponse>> getAllPatients() {
        return ResponseEntity.ok(practitionerService.getAllPatients(SecurityUtil.getCurrentUserId()));
    }

    @PostMapping("/therapy-plan")
    public ResponseEntity<TherapyPlanResponse> createTherapyPlan(
            @Valid @RequestBody TherapyPlanRequest request,
            HttpServletRequest httpRequest) {
        Long practitionerId = extractUserId(httpRequest);
        return ResponseEntity.ok(practitionerService.createTherapyPlan(request, practitionerId));
    }

    @GetMapping("/therapy-plans")
    public ResponseEntity<List<TherapyPlanResponse>> getTherapyPlans(HttpServletRequest httpRequest) {
        Long practitionerId = extractUserId(httpRequest);
        return ResponseEntity.ok(practitionerService.getTherapyPlans(practitionerId));
    }

    @PostMapping("/session")
    public ResponseEntity<TherapySessionResponse> scheduleSession(
            @Valid @RequestBody TherapySessionRequest request,
            HttpServletRequest httpRequest) {
        Long practitionerId = extractUserId(httpRequest);
        return ResponseEntity.ok(practitionerService.scheduleSession(request, practitionerId));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> getDashboard(HttpServletRequest httpRequest) {
        Long practitionerId = extractUserId(httpRequest);
        return ResponseEntity.ok(practitionerService.getDashboard(practitionerId));
    }

    @GetMapping("/feedback")
    public ResponseEntity<List<FeedbackResponse>> getAllFeedback(HttpServletRequest httpRequest) {
        Long practitionerId = extractUserId(httpRequest);
        return ResponseEntity.ok(practitionerService.getAllFeedback(practitionerId));
    }

    @PutMapping("/session/{sessionId}/status")
    public ResponseEntity<TherapySessionResponse> updateSessionStatus(
            @PathVariable Long sessionId,
            @RequestParam com.ayursutra.model.enums.SessionStatus status,
            HttpServletRequest httpRequest) {
        Long practitionerId = extractUserId(httpRequest);
        return ResponseEntity.ok(practitionerService.updateSessionStatus(sessionId, status, practitionerId));
    }

    private Long extractUserId(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        return jwtUtil.extractUserId(token);
    }
}
