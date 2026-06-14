package com.av.fitness.controller;

import com.av.fitness.dto.*;
import com.av.fitness.dto.coach.*;
import com.av.fitness.service.CoachService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/coach")
@PreAuthorize("hasRole('COACH')")
public class CoachController {

    private final CoachService coachService;

    public CoachController(CoachService coachService) {
        this.coachService = coachService;
    }

    // ── Clientes ──────────────────────────────────────────────

    @GetMapping("/clients")
    public ResponseEntity<List<ClientResponse>> getClients() {
        return ResponseEntity.ok(coachService.getClients());
    }

    @PostMapping("/clients")
    public ResponseEntity<ClientResponse> createClient(@Valid @RequestBody ClientRequest request) {
        return ResponseEntity.ok(coachService.createClient(request));
    }

    @GetMapping("/clients/{id}")
    public ResponseEntity<ClientResponse> getClient(@PathVariable String id) {
        return ResponseEntity.ok(coachService.getClient(id));
    }

    @PutMapping("/clients/{id}")
    public ResponseEntity<ClientResponse> updateClient(
            @PathVariable String id,
            @Valid @RequestBody ClientRequest request) {
        return ResponseEntity.ok(coachService.updateClient(id, request));
    }

    @DeleteMapping("/clients/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable String id) {
        coachService.deleteClient(id);
        return ResponseEntity.noContent().build();
    }

    // ── Plantillas de rutinas ─────────────────────────────────

    @GetMapping("/templates")
    public ResponseEntity<List<TemplateResponse>> getTemplates() {
        return ResponseEntity.ok(coachService.getTemplates());
    }

    @PostMapping("/templates")
    public ResponseEntity<TemplateResponse> createTemplate(
            @Valid @RequestBody TemplateRequest request) {
        return ResponseEntity.ok(coachService.createTemplate(request));
    }

    @PutMapping("/templates/{id}")
    public ResponseEntity<TemplateResponse> updateTemplate(
            @PathVariable String id,
            @Valid @RequestBody TemplateRequest request) {
        return ResponseEntity.ok(coachService.updateTemplate(id, request));
    }

    @DeleteMapping("/templates/{id}")
    public ResponseEntity<Void> deleteTemplate(@PathVariable String id) {
        coachService.deleteTemplate(id);
        return ResponseEntity.noContent().build();
    }

    // ── Rutinas ───────────────────────────────────────────────

    @GetMapping("/routines")
    public ResponseEntity<List<RoutineResponse>> getRoutines() {
        return ResponseEntity.ok(coachService.getRoutines());
    }

    @PostMapping("/routines")
    public ResponseEntity<RoutineResponse> createRoutine(@Valid @RequestBody RoutineRequest request) {
        return ResponseEntity.ok(coachService.createRoutine(request));
    }

    @PutMapping("/routines/{id}")
    public ResponseEntity<RoutineResponse> updateRoutine(
            @PathVariable String id,
            @Valid @RequestBody RoutineRequest request) {
        return ResponseEntity.ok(coachService.updateRoutine(id, request));
    }

    @DeleteMapping("/routines/{id}")
    public ResponseEntity<Void> deleteRoutine(@PathVariable String id) {
        coachService.deleteRoutine(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/routines/from-template")
    public ResponseEntity<RoutineResponse> createRoutineFromTemplate(
            @Valid @RequestBody FromTemplateRequest request) {
        return ResponseEntity.ok(coachService.createRoutineFromTemplate(request));
    }

    // ── Plantillas de dietas ──────────────────────────────────

    @GetMapping("/diet-templates")
    public ResponseEntity<List<DietTemplateResponse>> getDietTemplates() {
        return ResponseEntity.ok(coachService.getDietTemplates());
    }

    @PostMapping("/diet-templates")
    public ResponseEntity<DietTemplateResponse> createDietTemplate(
            @Valid @RequestBody DietTemplateRequest request) {
        return ResponseEntity.ok(coachService.createDietTemplate(request));
    }

    @PutMapping("/diet-templates/{id}")
    public ResponseEntity<DietTemplateResponse> updateDietTemplate(
            @PathVariable String id,
            @Valid @RequestBody DietTemplateRequest request) {
        return ResponseEntity.ok(coachService.updateDietTemplate(id, request));
    }

    @DeleteMapping("/diet-templates/{id}")
    public ResponseEntity<Void> deleteDietTemplate(@PathVariable String id) {
        coachService.deleteDietTemplate(id);
        return ResponseEntity.noContent().build();
    }

    // ── Dietas ────────────────────────────────────────────────

    @GetMapping("/diets")
    public ResponseEntity<List<DietResponse>> getDiets() {
        return ResponseEntity.ok(coachService.getDiets());
    }

    @PostMapping("/diets")
    public ResponseEntity<DietResponse> createDiet(@Valid @RequestBody DietRequest request) {
        return ResponseEntity.ok(coachService.createDiet(request));
    }

    @PutMapping("/diets/{id}")
    public ResponseEntity<DietResponse> updateDiet(
            @PathVariable String id,
            @Valid @RequestBody DietRequest request) {
        return ResponseEntity.ok(coachService.updateDiet(id, request));
    }

    @DeleteMapping("/diets/{id}")
    public ResponseEntity<Void> deleteDiet(@PathVariable String id) {
        coachService.deleteDiet(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/diets/from-template")
    public ResponseEntity<DietResponse> createDietFromTemplate(
            @Valid @RequestBody FromTemplateRequest request) {
        return ResponseEntity.ok(coachService.createDietFromTemplate(request));
    }

    // ── Asignaciones ──────────────────────────────────────────

    @PostMapping("/assign")
    public ResponseEntity<AssignmentResponse> assign(@Valid @RequestBody AssignmentRequest request) {
        return ResponseEntity.ok(coachService.assign(request));
    }

    @GetMapping("/assignments")
    public ResponseEntity<List<AssignmentResponse>> getAssignments() {
        return ResponseEntity.ok(coachService.getAssignments());
    }

    // ── Notas ─────────────────────────────────────────────────

    @GetMapping("/notes")
    public ResponseEntity<List<NoteResponse>> getNotes() {
        return ResponseEntity.ok(coachService.getNotes());
    }

    @GetMapping("/notes/{clientId}")
    public ResponseEntity<List<NoteResponse>> getNotesByClient(@PathVariable String clientId) {
        return ResponseEntity.ok(coachService.getNotesByClient(clientId));
    }

    @PostMapping("/notes")
    public ResponseEntity<NoteResponse> createNote(@Valid @RequestBody NoteRequest request) {
        return ResponseEntity.ok(coachService.createNote(request));
    }

    @PutMapping("/notes/{id}")
    public ResponseEntity<NoteResponse> updateNote(
            @PathVariable String id,
            @Valid @RequestBody NoteRequest request) {
        return ResponseEntity.ok(coachService.updateNote(id, request));
    }

    @DeleteMapping("/notes/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable String id) {
        coachService.deleteNote(id);
        return ResponseEntity.noContent().build();
    }

    // ── Progreso de cliente ───────────────────────────────────

    @GetMapping("/clients/{id}/progress")
    public ResponseEntity<List<ProgressResponse>> getProgressByClient(@PathVariable String id) {
        return ResponseEntity.ok(coachService.getProgressByClient(id));
    }

    // ── Hilo de conversación ──────────────────────────────────

    @GetMapping("/clients/{id}/thread")
    public ResponseEntity<ThreadResponse> getThreadByClient(@PathVariable String id) {
        return ResponseEntity.ok(coachService.getThreadByClient(id));
    }

    @PostMapping("/clients/{id}/thread")
    public ResponseEntity<MessageResponse> sendMessageToClient(
            @PathVariable String id,
            @Valid @RequestBody SendMessageRequest request) {
        return ResponseEntity.ok(coachService.sendMessageToClient(id, request.getText()));
    }
}
