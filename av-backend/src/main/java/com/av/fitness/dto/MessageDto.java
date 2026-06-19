package com.av.fitness.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

/**
 * Single chat message inside a nutrition thread.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageDto {

    /** Message unique identifier. */
    private UUID id;
    /** Who sent the message: {@code CLIENT} or {@code COACH}. */
    private String sender;
    /** Message text content. */
    private String text;
    /** ISO-8601 datetime string of when the message was sent. */
    private String date;
}
