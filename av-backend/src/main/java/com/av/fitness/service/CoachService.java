package com.av.fitness.service;

import com.av.fitness.dto.coach.*;
import com.av.fitness.dto.ProgressResponse;
import com.av.fitness.dto.ThreadResponse;
import java.util.List;
import java.util.UUID;

/**
 * Handles coach-side operations including client management, CRUD for templates,
 * routines, diets, notes, and assignments, plus progress review and messaging.
 */
public interface CoachService {

    /**
     * Creates a new client.
     *
     * @param request the client creation data
     * @return ClientResponse containing the created client
     */
    ClientResponse createClient(ClientRequest request);

    /**
     * Updates an existing client.
     *
     * @param id      the client UUID
     * @param request the updated client data
     * @return ClientResponse containing the updated client
     */
    ClientResponse updateClient(UUID id, ClientRequest request);

    /**
     * Deletes a client.
     *
     * @param id the client UUID to delete
     */
    void deleteClient(UUID id);

    /**
     * Retrieves a client by ID.
     *
     * @param id the client UUID
     * @return ClientResponse for the specified client
     */
    ClientResponse getClient(UUID id);

    /**
     * Retrieves all clients.
     *
     * @return list of all clients
     */
    List<ClientResponse> getClients();

    /**
     * Creates a new workout template.
     *
     * @param request the template creation data
     * @return TemplateResponse containing the created template
     */
    TemplateResponse createTemplate(TemplateRequest request);

    /**
     * Updates an existing workout template.
     *
     * @param id      the template UUID
     * @param request the updated template data
     * @return TemplateResponse containing the updated template
     */
    TemplateResponse updateTemplate(UUID id, TemplateRequest request);

    /**
     * Deletes a workout template.
     *
     * @param id the template UUID to delete
     */
    void deleteTemplate(UUID id);

    /**
     * Retrieves a workout template by ID.
     *
     * @param id the template UUID
     * @return TemplateResponse for the specified template
     */
    TemplateResponse getTemplate(UUID id);

    /**
     * Retrieves all workout templates.
     *
     * @return list of all templates
     */
    List<TemplateResponse> getTemplates();

    /**
     * Creates a new workout routine.
     *
     * @param request the routine creation data
     * @return RoutineResponse containing the created routine
     */
    RoutineResponse createRoutine(RoutineRequest request);

    /**
     * Updates an existing workout routine.
     *
     * @param id      the routine UUID
     * @param request the updated routine data
     * @return RoutineResponse containing the updated routine
     */
    RoutineResponse updateRoutine(UUID id, RoutineRequest request);

    /**
     * Deletes a workout routine.
     *
     * @param id the routine UUID to delete
     */
    void deleteRoutine(UUID id);

    /**
     * Retrieves a workout routine by ID.
     *
     * @param id the routine UUID
     * @return RoutineResponse for the specified routine
     */
    RoutineResponse getRoutine(UUID id);

    /**
     * Retrieves all workout routines.
     *
     * @return list of all routines
     */
    List<RoutineResponse> getRoutines();

    /**
     * Creates a new diet plan.
     *
     * @param request the diet creation data
     * @return DietResponse containing the created diet
     */
    DietResponse createDiet(DietRequest request);

    /**
     * Updates an existing diet plan.
     *
     * @param id      the diet UUID
     * @param request the updated diet data
     * @return DietResponse containing the updated diet
     */
    DietResponse updateDiet(UUID id, DietRequest request);

    /**
     * Deletes a diet plan.
     *
     * @param id the diet UUID to delete
     */
    void deleteDiet(UUID id);

    /**
     * Retrieves a diet plan by ID.
     *
     * @param id the diet UUID
     * @return DietResponse for the specified diet
     */
    DietResponse getDiet(UUID id);

    /**
     * Retrieves all diet plans.
     *
     * @return list of all diets
     */
    List<DietResponse> getDiets();

    /**
     * Creates a new diet template.
     *
     * @param request the diet template creation data
     * @return DietTemplateResponse containing the created diet template
     */
    DietTemplateResponse createDietTemplate(DietTemplateRequest request);

    /**
     * Updates an existing diet template.
     *
     * @param id      the diet template UUID
     * @param request the updated diet template data
     * @return DietTemplateResponse containing the updated diet template
     */
    DietTemplateResponse updateDietTemplate(UUID id, DietTemplateRequest request);

    /**
     * Deletes a diet template.
     *
     * @param id the diet template UUID to delete
     */
    void deleteDietTemplate(UUID id);

    /**
     * Retrieves a diet template by ID.
     *
     * @param id the diet template UUID
     * @return DietTemplateResponse for the specified diet template
     */
    DietTemplateResponse getDietTemplate(UUID id);

    /**
     * Retrieves all diet templates.
     *
     * @return list of all diet templates
     */
    List<DietTemplateResponse> getDietTemplates();

    /**
     * Adds a new note for the specified client.
     *
     * @param clientId the client UUID
     * @param request  the note data
     * @return NoteResponse containing the created note
     */
    NoteResponse addNote(UUID clientId, NoteRequest request);

    /**
     * Updates an existing note.
     *
     * @param id      the note UUID
     * @param request the updated note data
     * @return NoteResponse containing the updated note
     */
    NoteResponse updateNote(UUID id, NoteRequest request);

    /**
     * Deletes a note.
     *
     * @param id the note UUID to delete
     */
    void deleteNote(UUID id);

    /**
     * Retrieves a note by ID.
     *
     * @param id the note UUID
     * @return NoteResponse for the specified note
     */
    NoteResponse getNote(UUID id);

    /**
     * Retrieves all notes for a specific client.
     *
     * @param clientId the client UUID
     * @return list of NoteResponse entries for the client
     */
    List<NoteResponse> getNotesForClient(UUID clientId);

    /**
     * Creates a new routine/diet assignment for a client.
     *
     * @param request the assignment creation data
     * @return AssignmentResponse containing the created assignment
     */
    AssignmentResponse createAssignment(AssignmentRequest request);

    /**
     * Deactivates an existing assignment.
     *
     * @param id the assignment UUID to deactivate
     */
    void deactivateAssignment(UUID id);

    /**
     * Retrieves all assignments for a specific client.
     *
     * @param clientId the client UUID
     * @return list of AssignmentResponse entries for the client
     */
    List<AssignmentResponse> getAssignmentsForClient(UUID clientId);

    /**
     * Retrieves progress entries for a specific client.
     *
     * @param clientId the client UUID
     * @return list of ProgressResponse entries
     */
    List<ProgressResponse> getClientProgress(UUID clientId);

    /**
     * Retrieves the messaging thread for a specific client.
     *
     * @param clientId the client UUID
     * @return ThreadResponse containing the messaging thread
     */
    ThreadResponse getThreadForClient(UUID clientId);

    /**
     * Sends a message in the specified client's thread.
     *
     * @param clientId the client UUID
     * @param message  the message text
     * @return ThreadResponse containing the updated thread
     */
    ThreadResponse sendThreadMessage(UUID clientId, String message);

    /**
     * Creates a personalised diet from a template.
     *
     * @param request the template ID and optional name/goal overrides
     * @return DietResponse containing the created diet
     */
    DietResponse createDietFromTemplate(DietFromTemplateRequest request);

    /**
     * Assigns a diet to a client, deactivating any previous active assignment.
     *
     * @param clientId the client UUID
     * @param request  the diet assignment payload
     * @return DietAssignmentResponse containing the created assignment
     */
    DietAssignmentResponse assignDiet(UUID clientId, DietAssignmentRequest request);

    /**
     * Retrieves lightweight notification previews for all client threads
     * owned by the authenticated coach.
     *
     * @return list of {@link ThreadNotificationResponse} ordered by unread first,
     *         then most recent updatedAt
     */
    List<ThreadNotificationResponse> getNotifications();

    /**
     * Marks the nutrition thread for the given client as read by the coach
     * (sets {@code last_read_at} to now).
     *
     * @param clientId the client UUID
     */
    void markThreadRead(UUID clientId);
}
