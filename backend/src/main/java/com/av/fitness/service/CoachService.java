package com.av.fitness.service;

import com.av.fitness.dto.*;
import com.av.fitness.dto.coach.*;

import java.util.List;

public interface CoachService {

    // ── Clientes ──────────────────────────────────────────────
    List<ClientResponse> getClients();
    ClientResponse createClient(ClientRequest request);
    ClientResponse getClient(String id);
    ClientResponse updateClient(String id, ClientRequest request);
    void deleteClient(String id);

    // ── Plantillas de rutinas ─────────────────────────────────
    List<TemplateResponse> getTemplates();
    TemplateResponse createTemplate(TemplateRequest request);
    TemplateResponse updateTemplate(String id, TemplateRequest request);
    void deleteTemplate(String id);

    // ── Rutinas ───────────────────────────────────────────────
    List<RoutineResponse> getRoutines();
    RoutineResponse createRoutine(RoutineRequest request);
    RoutineResponse updateRoutine(String id, RoutineRequest request);
    void deleteRoutine(String id);
    RoutineResponse createRoutineFromTemplate(FromTemplateRequest request);

    // ── Plantillas de dietas ──────────────────────────────────
    List<DietTemplateResponse> getDietTemplates();
    DietTemplateResponse createDietTemplate(DietTemplateRequest request);
    DietTemplateResponse updateDietTemplate(String id, DietTemplateRequest request);
    void deleteDietTemplate(String id);

    // ── Dietas ────────────────────────────────────────────────
    List<DietResponse> getDiets();
    DietResponse createDiet(DietRequest request);
    DietResponse updateDiet(String id, DietRequest request);
    void deleteDiet(String id);
    DietResponse createDietFromTemplate(FromTemplateRequest request);

    // ── Asignaciones ──────────────────────────────────────────
    AssignmentResponse assign(AssignmentRequest request);
    List<AssignmentResponse> getAssignments();

    // ── Notas ─────────────────────────────────────────────────
    List<NoteResponse> getNotes();
    List<NoteResponse> getNotesByClient(String clientId);
    NoteResponse createNote(NoteRequest request);
    NoteResponse updateNote(String id, NoteRequest request);
    void deleteNote(String id);

    // ── Progreso de cliente ───────────────────────────────────
    List<ProgressResponse> getProgressByClient(String clientId);

    // ── Hilo de conversación ──────────────────────────────────
    ThreadResponse getThreadByClient(String clientId);
    MessageResponse sendMessageToClient(String clientId, String text);
}
