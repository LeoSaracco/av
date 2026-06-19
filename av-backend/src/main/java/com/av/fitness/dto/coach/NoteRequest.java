package com.av.fitness.dto.coach;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for creating or updating a note.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NoteRequest {

    /** The text content of the note. */
    @NotBlank
    private String text;
}
