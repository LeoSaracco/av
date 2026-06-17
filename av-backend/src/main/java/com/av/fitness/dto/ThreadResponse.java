package com.av.fitness.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
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
    /** JSON-serialized array of messages in the thread. */
    private String messages;
}
