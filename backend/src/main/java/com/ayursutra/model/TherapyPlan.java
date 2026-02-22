package com.ayursutra.model;

import com.ayursutra.model.enums.Phase;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "therapy_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TherapyPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;

    @ManyToOne
    @JoinColumn(name = "practitioner_id", nullable = false)
    private User practitioner;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Phase phase;

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDate startDate;

    private LocalDate endDate;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getPatient() { return patient; }
    public void setPatient(User patient) { this.patient = patient; }
    public User getPractitioner() { return practitioner; }
    public void setPractitioner(User practitioner) { this.practitioner = practitioner; }
    public Phase getPhase() { return phase; }
    public void setPhase(Phase phase) { this.phase = phase; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public static TherapyPlanBuilder builder() {
        return new TherapyPlanBuilder();
    }

    public static class TherapyPlanBuilder {
        private TherapyPlan plan = new TherapyPlan();
        public TherapyPlanBuilder id(Long id) { plan.id = id; return this; }
        public TherapyPlanBuilder patient(User patient) { plan.patient = patient; return this; }
        public TherapyPlanBuilder practitioner(User practitioner) { plan.practitioner = practitioner; return this; }
        public TherapyPlanBuilder phase(Phase phase) { plan.phase = phase; return this; }
        public TherapyPlanBuilder description(String description) { plan.description = description; return this; }
        public TherapyPlanBuilder startDate(LocalDate startDate) { plan.startDate = startDate; return this; }
        public TherapyPlanBuilder endDate(LocalDate endDate) { plan.endDate = endDate; return this; }
        public TherapyPlan build() { return plan; }
    }
}
