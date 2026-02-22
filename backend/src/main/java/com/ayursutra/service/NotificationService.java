package com.ayursutra.service;

import com.ayursutra.model.Notification;
import com.ayursutra.model.User;
import com.ayursutra.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);
    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public void sendSessionReminder(User patient, String procedureName, String scheduledDate) {
        String subject = "📋 Session Reminder: " + procedureName;
        String body = String.format(
                "Dear %s,\n\nThis is a reminder for your upcoming Panchakarma session:\n" +
                "Procedure: %s\nScheduled: %s\n\nPlease arrive 15 minutes early.\n\nBest regards,\nAyurSutra Team",
                patient.getName(), procedureName, scheduledDate
        );
        saveAndLog(patient, subject, body);
    }

    public void sendFeedbackReminder(User patient, String procedureName) {
        String subject = "✍️ Feedback Request: " + procedureName;
        String body = String.format(
                "Dear %s,\n\nYour session '%s' has been completed.\n" +
                "Please take a moment to provide your feedback.\n\nThank you,\nAyurSutra Team",
                patient.getName(), procedureName
        );
        saveAndLog(patient, subject, body);
    }

    public void sendWelcomeNotification(User user) {
        String subject = "🌿 Welcome to AyurSutra!";
        String body = String.format(
                "Dear %s,\n\nWelcome to AyurSutra - Your Panchakarma Management System.\n" +
                "Your account has been created as: %s\n\nNamaste! 🙏\nAyurSutra Team",
                user.getName(), user.getRole().name()
        );
        saveAndLog(user, subject, body);
    }

    public void sendPreProcedureInstructions(User patient, String procedureName) {
        String subject = "🥗 Pre-Procedure Instructions: " + procedureName;
        String body = String.format(
                "Dear %s,\n\nPreparation is key for a successful '%s' session.\n" +
                "1. Please fast for at least 4 hours before the procedure.\n" +
                "2. Avoid strenuous physical activity 24 hours prior.\n" +
                "3. Keep yourself well hydrated with warm water.\n\n" +
                "We look forward to seeing you.\n\nBest regards,\nAyurSutra Team",
                patient.getName(), procedureName
        );
        saveAndLog(patient, subject, body);
    }

    public void sendPostProcedureTips(User patient, String procedureName) {
        String subject = "🧘 Post-Procedure Recovery: " + procedureName;
        String body = String.format(
                "Dear %s,\n\nYou have successfully completed your '%s' session.\n" +
                "Recovery Tips:\n" +
                "- Rest for at least 2 hours in a quiet environment.\n" +
                "- Avoid direct exposure to cold wind or sun.\n" +
                "- Consume light, warm meals (like Khichdi) for the next 48 hours.\n\n" +
                "Warm regards,\nAyurSutra Team",
                patient.getName(), procedureName
        );
        saveAndLog(patient, subject, body);
    }

    private void saveAndLog(User user, String subject, String body) {
        Notification notification = Notification.builder()
                .user(user)
                .subject(subject)
                .body(body)
                .sent(true)
                .build();
        notificationRepository.save(notification);

        log.info("\n═══════════════════════════════════════════");
        log.info("📧 MOCK EMAIL SENT");
        log.info("To: {} ({})", user.getName(), user.getEmail());
        log.info("Subject: {}", subject);
        log.info("Body:\n{}", body);
        log.info("═══════════════════════════════════════════\n");
    }
}
