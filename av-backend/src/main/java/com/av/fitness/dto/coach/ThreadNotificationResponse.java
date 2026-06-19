package com.av.fitness.dto.coach;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Lightweight notification payload for the coach notification bell.
 * Represents one client thread with its last-message preview and read status.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ThreadNotificationResponse {

    /** Thread unique identifier. */
    private UUID threadId;
    /** The client's ID. */
    private UUID clientId;
    /** The client's display name. */
    private String clientName;
    /** The assigned diet name (null if no diet assigned). */
    private String dietName;
    /** Text of the most recent message (truncated by frontend). */
    private String lastMessage;
    /** Who sent the last message: {@code CLIENT} or {@code COACH}. */
    private String lastSender;
    /** When the thread was last updated. */
    private LocalDateTime updatedAt;
    /** Whether there are unread CLIENT messages for the coach. */
    private boolean unread;
}
