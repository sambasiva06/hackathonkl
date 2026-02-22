package com.ayursutra.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "feedbacks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "session_id", nullable = false)
    private TherapySession session;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(nullable = false)
    private Integer rating;

    @Column(columnDefinition = "TEXT")
    private String symptoms;

    @Column(columnDefinition = "TEXT")
    private String sideEffects;

    private Integer improvementLevel; // 1-10 scale

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Manual accessors as fallback for Lombok issues
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public TherapySession getSession() { return session; }
    public void setSession(TherapySession session) { this.session = session; }
    public User getPatient() { return patient; }
    public void setPatient(User patient) { this.patient = patient; }
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

    public static FeedbackBuilder builder() {
        return new FeedbackBuilder();
    }

    public static class FeedbackBuilder {
        private Feedback feedback = new Feedback();
        public FeedbackBuilder id(Long id) { feedback.id = id; return this; }
        public FeedbackBuilder session(TherapySession session) { feedback.session = session; return this; }
        public FeedbackBuilder patient(User patient) { feedback.patient = patient; return this; }
        public FeedbackBuilder message(String message) { feedback.message = message; return this; }
        public FeedbackBuilder rating(Integer rating) { feedback.rating = rating; return this; }
        public FeedbackBuilder symptoms(String symptoms) { feedback.symptoms = symptoms; return this; }
        public FeedbackBuilder sideEffects(String sideEffects) { feedback.sideEffects = sideEffects; return this; }
        public FeedbackBuilder improvementLevel(Integer improvementLevel) { feedback.improvementLevel = improvementLevel; return this; }
        public Feedback build() { return feedback; }
    }
}
