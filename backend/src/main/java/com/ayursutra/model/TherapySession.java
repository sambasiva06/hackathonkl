package com.ayursutra.model;

import com.ayursutra.model.enums.SessionStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "therapy_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TherapySession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "therapy_plan_id", nullable = false)
    private TherapyPlan therapyPlan;

    @Column(nullable = false)
    private String procedureName;

    @Column(nullable = false)
    private LocalDateTime scheduledDate;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SessionStatus status;
}
