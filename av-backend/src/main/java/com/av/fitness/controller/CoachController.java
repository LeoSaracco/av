package com.av.fitness.controller;

import com.av.fitness.dto.coach.*;
import com.av.fitness.dto.ProgressResponse;
import com.av.fitness.dto.ThreadResponse;
import com.av.fitness.service.CoachService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * REST controller for coach operations.
 *
 * <p>Base path: {@code /api/coach} &mdash; requires {@code COACH} role.</p>
 *
 * <p>Manages clients, routine templates, routines, diets, diet templates,
 * notes, assignments, progress tracking, and messaging threads.</p>
 *
 * @see CoachService
 */
@RestController
@RequestMapping("/api/coach")
@RequiredArgsConstructor
public class CoachController {

    private final CoachService coachService;

    // ── Clients ──────────────────────────────────────────────────────

    /** Retrieves all clients. */
    @GetMapping("/clients")
    public ResponseEntity<List<ClientResponse>> getClients() {
        return ResponseEntity.ok(coachService.getClients());
    }

    /** Retrieves a single client by UUID. */
    @GetMapping("/clients/{id}")
    public ResponseEntity<ClientResponse> getClient(@PathVariable UUID id) {
        return ResponseEntity.ok(coachService.getClient(id));
    }

    /** Creates a new client. */
    @PostMapping("/clients")
    public ResponseEntity<ClientResponse> createClient(@Valid @RequestBody ClientRequest request) {
        return ResponseEntity.ok(coachService.createClient(request));
    }

    /** Updates an existing client. */
    @PutMapping("/clients/{id}")
    public ResponseEntity<ClientResponse> updateClient(
            @PathVariable UUID id,
            @Valid @RequestBody ClientRequest request) {
        return ResponseEntity.ok(coachService.updateClient(id, request));
    }

    /** Deletes a client. */
    @DeleteMapping("/clients/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable UUID id) {
        coachService.deleteClient(id);
        return ResponseEntity.noContent().build();
    }

    // ── Routine Templates ────────────────────────────────────────────

    /** Retrieves all routine templates. */
    @GetMapping("/templates")
    public ResponseEntity<List<TemplateResponse>> getTemplates() {
        return ResponseEntity.ok(coachService.getTemplates());
    }

    /** Retrieves a single routine template by UUID. */
    @GetMapping("/templates/{id}")
    public ResponseEntity<TemplateResponse> getTemplate(@PathVariable UUID id) {
        return ResponseEntity.ok(coachService.getTemplate(id));
    }

    /** Creates a new routine template. */
    @PostMapping("/templates")
    public ResponseEntity<TemplateResponse> createTemplate(@Valid @RequestBody TemplateRequest request) {
        return ResponseEntity.ok(coachService.createTemplate(request));
    }

    /** Updates an existing routine template. */
    @PutMapping("/templates/{id}")
    public ResponseEntity<TemplateResponse> updateTemplate(
            @PathVariable UUID id,
            @Valid @RequestBody TemplateRequest request) {
        return ResponseEntity.ok(coachService.updateTemplate(id, request));
    }

    /** Deletes a routine template. */
    @DeleteMapping("/templates/{id}")
    public ResponseEntity<Void> deleteTemplate(@PathVariable UUID id) {
        coachService.deleteTemplate(id);
        return ResponseEntity.noContent().build();
    }

    // ── Routines ─────────────────────────────────────────────────────

    /** Retrieves all routines. */
    @GetMapping("/routines")
    public ResponseEntity<List<RoutineResponse>> getRoutines() {
        return ResponseEntity.ok(coachService.getRoutines());
    }

    /** Retrieves a single routine by UUID. */
    @GetMapping("/routines/{id}")
    public ResponseEntity<RoutineResponse> getRoutine(@PathVariable UUID id) {
        return ResponseEntity.ok(coachService.getRoutine(id));
    }

    /** Creates a new routine. */
    @PostMapping("/routines")
    public ResponseEntity<RoutineResponse> createRoutine(@Valid @RequestBody RoutineRequest request) {
        return ResponseEntity.ok(coachService.createRoutine(request));
    }

    /** Updates an existing routine. */
    @PutMapping("/routines/{id}")
    public ResponseEntity<RoutineResponse> updateRoutine(
            @PathVariable UUID id,
            @Valid @RequestBody RoutineRequest request) {
        return ResponseEntity.ok(coachService.updateRoutine(id, request));
    }

    /** Deletes a routine. */
    @DeleteMapping("/routines/{id}")
    public ResponseEntity<Void> deleteRoutine(@PathVariable UUID id) {
        coachService.deleteRoutine(id);
        return ResponseEntity.noContent().build();
    }

    // ── Diets ────────────────────────────────────────────────────────

    /** Retrieves all diets. */
    @GetMapping("/diets")
    public ResponseEntity<List<DietResponse>> getDiets() {
        return ResponseEntity.ok(coachService.getDiets());
    }

    /** Retrieves a single diet by UUID. */
    @GetMapping("/diets/{id}")
    public ResponseEntity<DietResponse> getDiet(@PathVariable UUID id) {
        return ResponseEntity.ok(coachService.getDiet(id));
    }

    /** Creates a new diet. */
    @PostMapping("/diets")
    public ResponseEntity<DietResponse> createDiet(@Valid @RequestBody DietRequest request) {
        return ResponseEntity.ok(coachService.createDiet(request));
    }

    /** Updates an existing diet. */
    @PutMapping("/diets/{id}")
    public ResponseEntity<DietResponse> updateDiet(
            @PathVariable UUID id,
            @Valid @RequestBody DietRequest request) {
        return ResponseEntity.ok(coachService.updateDiet(id, request));
    }

    /** Deletes a diet. */
    @DeleteMapping("/diets/{id}")
    public ResponseEntity<Void> deleteDiet(@PathVariable UUID id) {
        coachService.deleteDiet(id);
        return ResponseEntity.noContent().build();
    }

    // ── Diet Templates ───────────────────────────────────────────────

    /** Retrieves all diet templates. */
    @GetMapping("/diet-templates")
    public ResponseEntity<List<DietTemplateResponse>> getDietTemplates() {
        return ResponseEntity.ok(coachService.getDietTemplates());
    }

    /** Retrieves a single diet template by UUID. */
    @GetMapping("/diet-templates/{id}")
    public ResponseEntity<DietTemplateResponse> getDietTemplate(@PathVariable UUID id) {
        return ResponseEntity.ok(coachService.getDietTemplate(id));
    }

    /** Creates a new diet template. */
    @PostMapping("/diet-templates")
    public ResponseEntity<DietTemplateResponse> createDietTemplate(
            @Valid @RequestBody DietTemplateRequest request) {
        return ResponseEntity.ok(coachService.createDietTemplate(request));
    }

    /** Updates an existing diet template. */
    @PutMapping("/diet-templates/{id}")
    public ResponseEntity<DietTemplateResponse> updateDietTemplate(
            @PathVariable UUID id,
            @Valid @RequestBody DietTemplateRequest request) {
        return ResponseEntity.ok(coachService.updateDietTemplate(id, request));
    }

    /** Deletes a diet template. */
    @DeleteMapping("/diet-templates/{id}")
    public ResponseEntity<Void> deleteDietTemplate(@PathVariable UUID id) {
        coachService.deleteDietTemplate(id);
        return ResponseEntity.noContent().build();
    }

    // ── Notes ────────────────────────────────────────────────────────

    /** Retrieves all notes for a given client. */
    @GetMapping("/clients/{id}/notes")
    public ResponseEntity<List<NoteResponse>> getClientNotes(@PathVariable UUID id) {
        return ResponseEntity.ok(coachService.getNotesForClient(id));
    }

    /** Adds a note for a client. */
    @PostMapping("/clients/{id}/notes")
    public ResponseEntity<NoteResponse> addClientNote(
            @PathVariable UUID id,
            @Valid @RequestBody NoteRequest request) {
        return ResponseEntity.ok(coachService.addNote(id, request));
    }

    /** Updates an existing note. */
    @PutMapping("/notes/{id}")
    public ResponseEntity<NoteResponse> updateNote(
            @PathVariable UUID id,
            @Valid @RequestBody NoteRequest request) {
        return ResponseEntity.ok(coachService.updateNote(id, request));
    }

    /** Deletes a note. */
    @DeleteMapping("/notes/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable UUID id) {
        coachService.deleteNote(id);
        return ResponseEntity.noContent().build();
    }

    // ── Assignments ──────────────────────────────────────────────────

    /**
     * Creates an assignment linking a routine/diet to a client.
     *
     * @param request the assignment payload
     * @return the created assignment
     */
    @PostMapping("/assignments")
    public ResponseEntity<AssignmentResponse> createAssignment(
            @Valid @RequestBody AssignmentRequest request) {
        return ResponseEntity.ok(coachService.createAssignment(request));
    }

    /** Retrieves all assignments for a given client. */
    @GetMapping("/clients/{id}/assignments")
    public ResponseEntity<List<AssignmentResponse>> getClientAssignments(@PathVariable UUID id) {
        return ResponseEntity.ok(coachService.getAssignmentsForClient(id));
    }

    /**
     * Deactivates an assignment by its UUID.
     *
     * @param id the assignment UUID
     * @return HTTP 204 No Content
     */
    @PatchMapping("/assignments/{id}/deactivate")
    public ResponseEntity<Void> deactivateAssignment(@PathVariable UUID id) {
        coachService.deactivateAssignment(id);
        return ResponseEntity.noContent().build();
    }

    // ── Progress ─────────────────────────────────────────────────────

    /** Retrieves progress records for a given client. */
    @GetMapping("/clients/{id}/progress")
    public ResponseEntity<List<ProgressResponse>> getClientProgress(@PathVariable UUID id) {
        return ResponseEntity.ok(coachService.getClientProgress(id));
    }

    // ── Thread ───────────────────────────────────────────────────────

    /** Retrieves the messaging thread for a client. */
    @GetMapping("/clients/{id}/thread")
    public ResponseEntity<ThreadResponse> getClientThread(@PathVariable UUID id) {
        return ResponseEntity.ok(coachService.getThreadForClient(id));
    }

    /**
     * Sends a message in the client's thread.
     *
     * @param id   the client UUID
     * @param body request body containing the {@code message} key
     * @return the updated thread
     */
    @PostMapping("/clients/{id}/thread/message")
    public ResponseEntity<ThreadResponse> sendThreadMessage(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(coachService.sendThreadMessage(id, body.get("message")));
    }
}
