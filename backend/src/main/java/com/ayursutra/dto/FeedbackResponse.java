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
    private String symptoms;
    private String sideEffects;
    private Integer improvementLevel;
    private LocalDateTime createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }
    public String getProcedureName() { return procedureName; }
    public void setProcedureName(String procedureName) { this.procedureName = procedureName; }
    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    public String getSymptoms() { return symptoms; }
    public void setSymptoms(String symptoms) { this.symptoms = symptoms; }
    public String getSideEffects() { return sideEffects; }
    public void setSideEffects(String sideEffects) { this.sideEffects = sideEffects; }
    public Integer getImprovementLevel() { return improvementLevel; }
    public void setImprovementLevel(Integer improvementLevel) { this.improvementLevel = improvementLevel; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static FeedbackResponseBuilder builder() {
        return new FeedbackResponseBuilder();
    }

    public static class FeedbackResponseBuilder {
        private FeedbackResponse response = new FeedbackResponse();
        public FeedbackResponseBuilder id(Long id) { response.id = id; return this; }
        public FeedbackResponseBuilder sessionId(Long sessionId) { response.sessionId = sessionId; return this; }
        public FeedbackResponseBuilder procedureName(String procedureName) { response.procedureName = procedureName; return this; }
        public FeedbackResponseBuilder patientName(String patientName) { response.patientName = patientName; return this; }
        public FeedbackResponseBuilder message(String message) { response.message = message; return this; }
        public FeedbackResponseBuilder rating(Integer rating) { response.rating = rating; return this; }
        public FeedbackResponseBuilder symptoms(String symptoms) { response.symptoms = symptoms; return this; }
        public FeedbackResponseBuilder sideEffects(String sideEffects) { response.sideEffects = sideEffects; return this; }
        public FeedbackResponseBuilder improvementLevel(Integer improvementLevel) { response.improvementLevel = improvementLevel; return this; }
        public FeedbackResponseBuilder createdAt(LocalDateTime createdAt) { response.createdAt = createdAt; return this; }
        public FeedbackResponse build() { return response; }
    }
}
