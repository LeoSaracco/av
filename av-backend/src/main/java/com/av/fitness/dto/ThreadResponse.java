package com.av.fitness.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Response DTO representing a chat thread between a client and their coach.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ThreadResponse {

    /** Unique thread identifier. */
    private UUID id;
    /** The client who owns this thread. */
    private UUID clientId;
    /** Parsed array of messages in the thread. */
    private List<MessageDto> messages;
    /** Last time the coach read this thread (null = never). */
    private LocalDateTime lastReadAt;
    /** Last time a message was added. */
    private LocalDateTime updatedAt;
}
