package com.av.fitness.service;

import com.av.fitness.dto.coach.*;
import com.av.fitness.dto.ProgressResponse;
import com.av.fitness.dto.ThreadResponse;
import java.util.List;
import java.util.UUID;

public interface CoachService {

    ClientResponse createClient(ClientRequest request);
    ClientResponse updateClient(UUID id, ClientRequest request);
    void deleteClient(UUID id);
    ClientResponse getClient(UUID id);
    List<ClientResponse> getClients();

    TemplateResponse createTemplate(TemplateRequest request);
    TemplateResponse updateTemplate(UUID id, TemplateRequest request);
    void deleteTemplate(UUID id);
    TemplateResponse getTemplate(UUID id);
    List<TemplateResponse> getTemplates();

    RoutineResponse createRoutine(RoutineRequest request);
    RoutineResponse updateRoutine(UUID id, RoutineRequest request);
    void deleteRoutine(UUID id);
    RoutineResponse getRoutine(UUID id);
    List<RoutineResponse> getRoutines();

    DietResponse createDiet(DietRequest request);
    DietResponse updateDiet(UUID id, DietRequest request);
    void deleteDiet(UUID id);
    DietResponse getDiet(UUID id);
    List<DietResponse> getDiets();

    DietTemplateResponse createDietTemplate(DietTemplateRequest request);
    DietTemplateResponse updateDietTemplate(UUID id, DietTemplateRequest request);
    void deleteDietTemplate(UUID id);
    DietTemplateResponse getDietTemplate(UUID id);
    List<DietTemplateResponse> getDietTemplates();

    NoteResponse addNote(UUID clientId, NoteRequest request);
    NoteResponse updateNote(UUID id, NoteRequest request);
    void deleteNote(UUID id);
    NoteResponse getNote(UUID id);
    List<NoteResponse> getNotesForClient(UUID clientId);

    AssignmentResponse createAssignment(AssignmentRequest request);
    void deactivateAssignment(UUID id);
    List<AssignmentResponse> getAssignmentsForClient(UUID clientId);

    List<ProgressResponse> getClientProgress(UUID clientId);

    ThreadResponse getThreadForClient(UUID clientId);
    ThreadResponse sendThreadMessage(UUID clientId, String message);
}
