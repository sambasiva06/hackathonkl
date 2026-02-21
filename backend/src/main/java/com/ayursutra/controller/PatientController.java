package com.ayursutra.controller;

import com.ayursutra.dto.*;
import com.ayursutra.security.JwtUtil;
import com.ayursutra.service.PatientService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@PreAuthorize("hasRole('PATIENT')")
public class PatientController {

    private final PatientService patientService;
    private final JwtUtil jwtUtil;

    public PatientController(PatientService patientService, JwtUtil jwtUtil) {
        this.patientService = patientService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/my-sessions")
    public ResponseEntity<List<TherapySessionResponse>> getMySessions(HttpServletRequest httpRequest) {
        Long patientId = extractUserId(httpRequest);
        return ResponseEntity.ok(patientService.getMySessions(patientId));
    }

    @PostMapping("/feedback")
    public ResponseEntity<FeedbackResponse> submitFeedback(
            @Valid @RequestBody FeedbackRequest request,
            HttpServletRequest httpRequest) {
        Long patientId = extractUserId(httpRequest);
        return ResponseEntity.ok(patientService.submitFeedback(request, patientId));
    }

    @GetMapping("/therapy-progress")
    public ResponseEntity<TherapyProgressResponse> getTherapyProgress(HttpServletRequest httpRequest) {
        Long patientId = extractUserId(httpRequest);
        return ResponseEntity.ok(patientService.getTherapyProgress(patientId));
    }

    @GetMapping("/my-profile")
    public ResponseEntity<PatientProfileResponse> getMyProfile(HttpServletRequest httpRequest) {
        Long patientId = extractUserId(httpRequest);
        return ResponseEntity.ok(patientService.getMyProfile(patientId));
    }

    private Long extractUserId(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        return jwtUtil.extractUserId(token);
    }
}
