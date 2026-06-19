package com.av.fitness.controller;

import com.av.fitness.dto.coach.DietResponse;
import com.av.fitness.dto.coach.NoteResponse;
import com.av.fitness.dto.coach.RoutineResponse;
import com.av.fitness.dto.coach.ThreadNotificationResponse;
import com.av.fitness.dto.ProgressResponse;
import com.av.fitness.dto.ThreadResponse;
import com.av.fitness.model.UserEntity;
import com.av.fitness.repository.UserJpaRepository;
import com.av.fitness.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Authenticated client self-service REST controller.
 * <p>
 * Base path: {@code /api/me}. Requires authenticated user with CLIENT role.
 * <p>
 * All endpoints resolve the authenticated user's {@code clientId} via
 * {@link #resolveClientId(Authentication)}, which looks up the {@link UserEntity}
 * to get the linked client UUID. This handles the case where the JWT's
 * {@code userId} differs from the actual {@code clientId} for users created
 * through the plan-contracts flow.
 * <p>
 * Provides access to: routine, diet, progress tracking, coach notes,
 * and the nutrition messaging thread.
 *
 * @see ClientService
 * @see AuthController
 */
@RestController
@RequestMapping("/api/me")
@RequiredArgsConstructor
public class MeController {

    private final ClientService clientService;
    private final UserJpaRepository userJpaRepository;

    /**
     * Returns the active routine assigned to the authenticated client.
     *
     * @param auth injected Spring Security authentication
     * @return the client's current routine
     */
    @GetMapping("/routine")
    public ResponseEntity<RoutineResponse> getMyRoutine(Authentication auth) {
        UUID clientId = resolveClientId(auth);
        return ResponseEntity.ok(clientService.getMyRoutine(clientId));
    }

    /**
     * Returns the active diet assigned to the authenticated client.
     *
     * @param auth injected Spring Security authentication
     * @return the client's current diet plan
     */
    @GetMapping("/diet")
    public ResponseEntity<DietResponse> getMyDiet(Authentication auth) {
        UUID clientId = resolveClientId(auth);
        return ResponseEntity.ok(clientService.getMyDiet(clientId));
    }

    /**
     * Lists all weight progress entries for the authenticated client,
     * ordered by date ascending.
     *
     * @param auth injected Spring Security authentication
     * @return list of progress entries
     */
    @GetMapping("/progress")
    public ResponseEntity<List<ProgressResponse>> getMyProgress(Authentication auth) {
        UUID clientId = resolveClientId(auth);
        return ResponseEntity.ok(clientService.getMyProgress(clientId));
    }

    /**
     * Logs a new weight progress entry.
     *
     * @param auth    injected Spring Security authentication
     * @param request weight, date, and optional comment
     * @return the created progress entry
     */
    @PostMapping("/progress")
    public ResponseEntity<ProgressResponse> logProgress(
            Authentication auth,
            @RequestBody ProgressResponse request) {
        UUID clientId = resolveClientId(auth);
        return ResponseEntity.ok(clientService.logProgress(clientId, request));
    }

    /**
     * Deletes a progress entry by its UUID.
     *
     * @param id the progress entry ID
     * @return {@code 204 No Content}
     */
    @DeleteMapping("/progress/{id}")
    public ResponseEntity<Void> deleteProgress(@PathVariable UUID id) {
        clientService.deleteProgress(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Updates an existing progress entry (weight, date, comment).
     *
     * @param id      the progress entry ID
     * @param request updated fields
     * @return the updated progress entry
     */
    @PutMapping("/progress/{id}")
    public ResponseEntity<ProgressResponse> updateProgress(
            @PathVariable UUID id,
            @RequestBody ProgressResponse request) {
        return ResponseEntity.ok(clientService.updateProgress(id, request));
    }

    /**
     * Lists the coach's notes for the authenticated client,
     * ordered by creation date descending.
     *
     * @param auth injected Spring Security authentication
     * @return list of notes
     */
    @GetMapping("/notes")
    public ResponseEntity<List<NoteResponse>> getMyNotes(Authentication auth) {
        UUID clientId = resolveClientId(auth);
        return ResponseEntity.ok(clientService.getMyNotes(clientId));
    }

    /**
     * Returns the nutrition messaging thread for the authenticated client.
     *
     * @param auth injected Spring Security authentication
     * @return the thread with message history
     */
    @GetMapping("/thread")
    public ResponseEntity<ThreadResponse> getMyThread(Authentication auth) {
        UUID clientId = resolveClientId(auth);
        return ResponseEntity.ok(clientService.getMyThread(clientId));
    }

    /**
     * Sends a message from the client to the nutrition thread.
     * <p>
     * The message is appended to the thread's JSON message array
     * with sender {@code CLIENT} and the current timestamp.
     *
     * @param auth injected Spring Security authentication
     * @param body request body containing the {@code "message"} key
     * @return the updated thread with full message history
     */
    @PostMapping("/thread/message")
    public ResponseEntity<ThreadResponse> sendMessage(
            Authentication auth,
            @RequestBody Map<String, String> body) {
        UUID clientId = resolveClientId(auth);
        return ResponseEntity.ok(clientService.sendMessage(clientId, body.get("message")));
    }

    /**
     * Marks the client's nutrition thread as read.
     *
     * @param auth injected Spring Security authentication
     * @return {@code 200 OK}
     */
    @PutMapping("/thread/read")
    public ResponseEntity<Void> markMyThreadRead(Authentication auth) {
        UUID clientId = resolveClientId(auth);
        clientService.markMyThreadRead(clientId);
        return ResponseEntity.ok().build();
    }

    /**
     * Returns a lightweight notification for the authenticated client
     * indicating whether there are unread coach messages.
     *
     * @param auth injected Spring Security authentication
     * @return notification with unread flag
     */
    @GetMapping("/notifications")
    public ResponseEntity<ThreadNotificationResponse> getMyNotifications(Authentication auth) {
        UUID clientId = resolveClientId(auth);
        return ResponseEntity.ok(clientService.getMyNotification(clientId));
    }

    /**
     * Resolves the authenticated user's {@code clientId} from the database.
     * <p>
     * The JWT principal carries the {@code userId} — not the {@code clientId}.
     * This method looks up the {@link UserEntity} to obtain the linked client UUID,
     * which is needed for all client-specific operations.
     *
     * @param auth the Spring Security authentication object
     * @return the client UUID linked to the authenticated user
     * @throws RuntimeException if the user is not found or has no associated client
     */
    private UUID resolveClientId(Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        UserEntity user = userJpaRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        if (user.getClientId() == null) {
            throw new RuntimeException("El usuario no tiene un cliente asociado");
        }
        return user.getClientId();
    }
}
