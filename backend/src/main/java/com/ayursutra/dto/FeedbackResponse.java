package com.ayursutra.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class FeedbackResponse {
    private Long id;
    private Long sessionId;
    private String procedureName;
    private String patientName;
    private String message;
    private Integer rating;
    private LocalDateTime createdAt;
}
