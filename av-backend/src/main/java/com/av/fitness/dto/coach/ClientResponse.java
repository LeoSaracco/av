package com.av.fitness.dto.coach;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Response DTO representing a client.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientResponse {

    /** The unique identifier of the client. */
    private UUID id;
    /** The full name of the client. */
    private String name;
    /** The email address of the client. */
    private String email;
    /** The phone number of the client. */
    private String phone;
    /** The fitness goal of the client. */
    private String goal;
    /** The current status of the client. */
    private String status;
    /** The date when the client joined. */
    private LocalDate joinDate;
    /** URL to the client's avatar image. */
    private String avatarUrl;
}
