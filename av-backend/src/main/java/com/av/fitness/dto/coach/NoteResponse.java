package com.av.fitness.dto.coach;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Response DTO representing a note associated with a client.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoteResponse {

    /** The unique identifier of the note. */
    private UUID id;
    /** The unique identifier of the client this note belongs to. */
    private UUID clientId;
    /** The text content of the note. */
    private String text;
    /** The date when the note was created. */
    private LocalDate createdAt;
    /** The date when the note was last updated. */
    private LocalDate updatedAt;
}
