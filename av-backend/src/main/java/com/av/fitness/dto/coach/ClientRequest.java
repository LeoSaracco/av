package com.av.fitness.dto.coach;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for creating or updating a client.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientRequest {

    /** The full name of the client. */
    @NotBlank
    private String name;

    /** The email address of the client. */
    @NotBlank
    @Email
    private String email;

    /** The phone number of the client. */
    private String phone;
    /** The fitness goal of the client. */
    private String goal;
    /** The current status of the client (e.g. active, inactive). */
    private String status;
    /** URL to the client's avatar image. */
    private String avatarUrl;
}
