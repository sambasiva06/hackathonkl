package com.ayursutra.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private Long id;
    private String subject;
    private String body;
    private boolean sent;
    private LocalDateTime createdAt;
}
