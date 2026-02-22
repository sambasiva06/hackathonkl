package com.ayursutra.dto;

import com.ayursutra.model.enums.Phase;
import com.ayursutra.model.enums.SessionStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class TherapySessionResponse {
    private Long id;
    private Long therapyPlanId;
    private Phase phase;
    private String procedureName;
    private LocalDateTime scheduledDate;
    private String notes;
    private SessionStatus status;
    private String practitionerName;
    private String patientName;
    private FeedbackResponse feedback;

    // Manual accessors as fallback for Lombok issues
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getTherapyPlanId() { return therapyPlanId; }
    public void setTherapyPlanId(Long therapyPlanId) { this.therapyPlanId = therapyPlanId; }
    public Phase getPhase() { return phase; }
    public void setPhase(Phase phase) { this.phase = phase; }
    public String getProcedureName() { return procedureName; }
    public void setProcedureName(String procedureName) { this.procedureName = procedureName; }
    public LocalDateTime getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDateTime scheduledDate) { this.scheduledDate = scheduledDate; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public SessionStatus getStatus() { return status; }
    public void setStatus(SessionStatus status) { this.status = status; }
    public String getPractitionerName() { return practitionerName; }
    public void setPractitionerName(String practitionerName) { this.practitionerName = practitionerName; }
    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    public FeedbackResponse getFeedback() { return feedback; }
    public void setFeedback(FeedbackResponse feedback) { this.feedback = feedback; }

    public static TherapySessionResponseBuilder builder() {
        return new TherapySessionResponseBuilder();
    }

    public static class TherapySessionResponseBuilder {
        private TherapySessionResponse response = new TherapySessionResponse();
        public TherapySessionResponseBuilder id(Long id) { response.id = id; return this; }
        public TherapySessionResponseBuilder therapyPlanId(Long therapyPlanId) { response.therapyPlanId = therapyPlanId; return this; }
        public TherapySessionResponseBuilder phase(Phase phase) { response.phase = phase; return this; }
        public TherapySessionResponseBuilder procedureName(String procedureName) { response.procedureName = procedureName; return this; }
        public TherapySessionResponseBuilder scheduledDate(LocalDateTime scheduledDate) { response.scheduledDate = scheduledDate; return this; }
        public TherapySessionResponseBuilder notes(String notes) { response.notes = notes; return this; }
        public TherapySessionResponseBuilder status(SessionStatus status) { response.status = status; return this; }
        public TherapySessionResponseBuilder practitionerName(String practitionerName) { response.practitionerName = practitionerName; return this; }
        public TherapySessionResponseBuilder patientName(String patientName) { response.patientName = patientName; return this; }
        public TherapySessionResponseBuilder feedback(FeedbackResponse feedback) { response.feedback = feedback; return this; }
        public TherapySessionResponse build() { return response; }
    }
}
