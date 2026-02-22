package com.ayursutra.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String subject;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String body;

    @Column(nullable = false)
    private Boolean sent;

    private LocalDateTime createdAt;

    // Manual accessors as fallback for Lombok issues
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }
    public Boolean isSent() { return sent; }
    public void setSent(Boolean sent) { this.sent = sent; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static NotificationBuilder builder() {
        return new NotificationBuilder();
    }

    public static class NotificationBuilder {
        private Notification notification = new Notification();
        public NotificationBuilder id(Long id) { notification.id = id; return this; }
        public NotificationBuilder user(User user) { notification.user = user; return this; }
        public NotificationBuilder subject(String subject) { notification.subject = subject; return this; }
        public NotificationBuilder body(String body) { notification.body = body; return this; }
        public NotificationBuilder sent(Boolean sent) { notification.sent = sent; return this; }
        public NotificationBuilder createdAt(LocalDateTime createdAt) { notification.createdAt = createdAt; return this; }
        public Notification build() { return notification; }
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
