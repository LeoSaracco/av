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

@RestController
@RequestMapping("/api/coach")
@RequiredArgsConstructor
public class CoachController {

    private final CoachService coachService;

    @GetMapping("/clients")
    public ResponseEntity<List<ClientResponse>> getClients() {
        return ResponseEntity.ok(coachService.getClients());
    }

    @GetMapping("/clients/{id}")
    public ResponseEntity<ClientResponse> getClient(@PathVariable UUID id) {
        return ResponseEntity.ok(coachService.getClient(id));
    }

    @PostMapping("/clients")
    public ResponseEntity<ClientResponse> createClient(@Valid @RequestBody ClientRequest request) {
        return ResponseEntity.ok(coachService.createClient(request));
    }

    @PutMapping("/clients/{id}")
    public ResponseEntity<ClientResponse> updateClient(
            @PathVariable UUID id,
            @Valid @RequestBody ClientRequest request) {
        return ResponseEntity.ok(coachService.updateClient(id, request));
    }

    @DeleteMapping("/clients/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable UUID id) {
        coachService.deleteClient(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/templates")
    public ResponseEntity<List<TemplateResponse>> getTemplates() {
        return ResponseEntity.ok(coachService.getTemplates());
    }

    @GetMapping("/templates/{id}")
    public ResponseEntity<TemplateResponse> getTemplate(@PathVariable UUID id) {
        return ResponseEntity.ok(coachService.getTemplate(id));
    }

    @PostMapping("/templates")
    public ResponseEntity<TemplateResponse> createTemplate(@Valid @RequestBody TemplateRequest request) {
        return ResponseEntity.ok(coachService.createTemplate(request));
    }

    @PutMapping("/templates/{id}")
    public ResponseEntity<TemplateResponse> updateTemplate(
            @PathVariable UUID id,
            @Valid @RequestBody TemplateRequest request) {
        return ResponseEntity.ok(coachService.updateTemplate(id, request));
    }

    @DeleteMapping("/templates/{id}")
    public ResponseEntity<Void> deleteTemplate(@PathVariable UUID id) {
        coachService.deleteTemplate(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/routines")
    public ResponseEntity<List<RoutineResponse>> getRoutines() {
        return ResponseEntity.ok(coachService.getRoutines());
    }

    @GetMapping("/routines/{id}")
    public ResponseEntity<RoutineResponse> getRoutine(@PathVariable UUID id) {
        return ResponseEntity.ok(coachService.getRoutine(id));
    }

    @PostMapping("/routines")
    public ResponseEntity<RoutineResponse> createRoutine(@Valid @RequestBody RoutineRequest request) {
        return ResponseEntity.ok(coachService.createRoutine(request));
    }

    @PutMapping("/routines/{id}")
    public ResponseEntity<RoutineResponse> updateRoutine(
            @PathVariable UUID id,
            @Valid @RequestBody RoutineRequest request) {
        return ResponseEntity.ok(coachService.updateRoutine(id, request));
    }

    @DeleteMapping("/routines/{id}")
    public ResponseEntity<Void> deleteRoutine(@PathVariable UUID id) {
        coachService.deleteRoutine(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/diets")
    public ResponseEntity<List<DietResponse>> getDiets() {
        return ResponseEntity.ok(coachService.getDiets());
    }

    @GetMapping("/diets/{id}")
    public ResponseEntity<DietResponse> getDiet(@PathVariable UUID id) {
        return ResponseEntity.ok(coachService.getDiet(id));
    }

    @PostMapping("/diets")
    public ResponseEntity<DietResponse> createDiet(@Valid @RequestBody DietRequest request) {
        return ResponseEntity.ok(coachService.createDiet(request));
    }

    @PutMapping("/diets/{id}")
    public ResponseEntity<DietResponse> updateDiet(
            @PathVariable UUID id,
            @Valid @RequestBody DietRequest request) {
        return ResponseEntity.ok(coachService.updateDiet(id, request));
    }

    @DeleteMapping("/diets/{id}")
    public ResponseEntity<Void> deleteDiet(@PathVariable UUID id) {
        coachService.deleteDiet(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/diet-templates")
    public ResponseEntity<List<DietTemplateResponse>> getDietTemplates() {
        return ResponseEntity.ok(coachService.getDietTemplates());
    }

    @GetMapping("/diet-templates/{id}")
    public ResponseEntity<DietTemplateResponse> getDietTemplate(@PathVariable UUID id) {
        return ResponseEntity.ok(coachService.getDietTemplate(id));
    }

    @PostMapping("/diet-templates")
    public ResponseEntity<DietTemplateResponse> createDietTemplate(
            @Valid @RequestBody DietTemplateRequest request) {
        return ResponseEntity.ok(coachService.createDietTemplate(request));
    }

    @PutMapping("/diet-templates/{id}")
    public ResponseEntity<DietTemplateResponse> updateDietTemplate(
            @PathVariable UUID id,
            @Valid @RequestBody DietTemplateRequest request) {
        return ResponseEntity.ok(coachService.updateDietTemplate(id, request));
    }

    @DeleteMapping("/diet-templates/{id}")
    public ResponseEntity<Void> deleteDietTemplate(@PathVariable UUID id) {
        coachService.deleteDietTemplate(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/clients/{id}/notes")
    public ResponseEntity<List<NoteResponse>> getClientNotes(@PathVariable UUID id) {
        return ResponseEntity.ok(coachService.getNotesForClient(id));
    }

    @PostMapping("/clients/{id}/notes")
    public ResponseEntity<NoteResponse> addClientNote(
            @PathVariable UUID id,
            @Valid @RequestBody NoteRequest request) {
        return ResponseEntity.ok(coachService.addNote(id, request));
    }

    @PutMapping("/notes/{id}")
    public ResponseEntity<NoteResponse> updateNote(
            @PathVariable UUID id,
            @Valid @RequestBody NoteRequest request) {
        return ResponseEntity.ok(coachService.updateNote(id, request));
    }

    @DeleteMapping("/notes/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable UUID id) {
        coachService.deleteNote(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/assignments")
    public ResponseEntity<AssignmentResponse> createAssignment(
            @Valid @RequestBody AssignmentRequest request) {
        return ResponseEntity.ok(coachService.createAssignment(request));
    }

    @GetMapping("/clients/{id}/assignments")
    public ResponseEntity<List<AssignmentResponse>> getClientAssignments(@PathVariable UUID id) {
        return ResponseEntity.ok(coachService.getAssignmentsForClient(id));
    }

    @PatchMapping("/assignments/{id}/deactivate")
    public ResponseEntity<Void> deactivateAssignment(@PathVariable UUID id) {
        coachService.deactivateAssignment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/clients/{id}/progress")
    public ResponseEntity<List<ProgressResponse>> getClientProgress(@PathVariable UUID id) {
        return ResponseEntity.ok(coachService.getClientProgress(id));
    }

    @GetMapping("/clients/{id}/thread")
    public ResponseEntity<ThreadResponse> getClientThread(@PathVariable UUID id) {
        return ResponseEntity.ok(coachService.getThreadForClient(id));
    }

    @PostMapping("/clients/{id}/thread/message")
    public ResponseEntity<ThreadResponse> sendThreadMessage(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(coachService.sendThreadMessage(id, body.get("message")));
    }
}
