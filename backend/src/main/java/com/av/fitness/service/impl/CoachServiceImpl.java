package com.av.fitness.service.impl;

import com.av.fitness.dto.coach.*;
import com.av.fitness.model.*;
import com.av.fitness.repository.*;
import com.av.fitness.service.CoachService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CoachServiceImpl implements CoachService {

    private final ClientJpaRepository clientRepository;
    private final RoutineTemplateJpaRepository routineTemplateRepository;
    private final RoutineJpaRepository routineRepository;
    private final DietTemplateJpaRepository dietTemplateRepository;
    private final DietJpaRepository dietRepository;
    private final AssignmentJpaRepository assignmentRepository;
    private final NoteJpaRepository noteRepository;
    private final ProgressJpaRepository progressRepository;
    private final NutritionThreadJpaRepository nutritionThreadRepository;
    private final ModelMapper modelMapper;

    // ──────────────────────────────── Clientes ────────────────────────────────

    @Override
    public List<ClientResponse> getClients() {
        return clientRepository.findAll().stream()
                .map(c -> modelMapper.map(c, ClientResponse.class))
                .collect(Collectors.toList());
    }

    @Override
    public ClientResponse getClient(String id) {
        ClientEntity client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        return modelMapper.map(client, ClientResponse.class);
    }

    @Override
    public ClientResponse createClient(ClientRequest request) {
        ClientEntity client = modelMapper.map(request, ClientEntity.class);
        client.setId(UUID.randomUUID().toString());
        client.setRoles("ROLE_CLIENT");
        client = clientRepository.save(client);
        return modelMapper.map(client, ClientResponse.class);
    }

    @Override
    public ClientResponse updateClient(String id, ClientRequest request) {
        ClientEntity client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        modelMapper.map(request, client);
        client = clientRepository.save(client);
        return modelMapper.map(client, ClientResponse.class);
    }

    @Override
    public void deleteClient(String id) {
        clientRepository.deleteById(id);
    }

    // ────────────────────── Templates de rutina ──────────────────────

    @Override
    public List<TemplateResponse> getTemplates() {
        return routineTemplateRepository.findAll().stream()
                .map(t -> modelMapper.map(t, TemplateResponse.class))
                .collect(Collectors.toList());
    }

    @Override
    public TemplateResponse createTemplate(TemplateRequest request) {
        RoutineTemplateEntity template = modelMapper.map(request, RoutineTemplateEntity.class);
        template.setId(UUID.randomUUID().toString());
        template.setCreatedAt(LocalDateTime.now().toString());
        template = routineTemplateRepository.save(template);
        return modelMapper.map(template, TemplateResponse.class);
    }

    @Override
    public TemplateResponse updateTemplate(String id, TemplateRequest request) {
        RoutineTemplateEntity template = routineTemplateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Template no encontrado"));
        modelMapper.map(request, template);
        template = routineTemplateRepository.save(template);
        return modelMapper.map(template, TemplateResponse.class);
    }

    @Override
    public void deleteTemplate(String id) {
        routineTemplateRepository.deleteById(id);
    }

    // ──────────────────────────── Rutinas ────────────────────────────

    @Override
    public List<RoutineResponse> getRoutines() {
        return routineRepository.findAll().stream()
                .map(r -> modelMapper.map(r, RoutineResponse.class))
                .collect(Collectors.toList());
    }

    @Override
    public RoutineResponse createRoutine(RoutineRequest request) {
        RoutineEntity routine = modelMapper.map(request, RoutineEntity.class);
        routine.setId(UUID.randomUUID().toString());
        routine.setCreatedAt(LocalDateTime.now().toString());
        routine = routineRepository.save(routine);
        return modelMapper.map(routine, RoutineResponse.class);
    }

    @Override
    public RoutineResponse updateRoutine(String id, RoutineRequest request) {
        RoutineEntity routine = routineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rutina no encontrada"));
        modelMapper.map(request, routine);
        routine = routineRepository.save(routine);
        return modelMapper.map(routine, RoutineResponse.class);
    }

    @Override
    public void deleteRoutine(String id) {
        routineRepository.deleteById(id);
    }

    @Override
    public RoutineResponse createRoutineFromTemplate(String templateId) {
        RoutineTemplateEntity template = routineTemplateRepository.findById(templateId)
                .orElseThrow(() -> new RuntimeException("Template no encontrado"));
        RoutineEntity routine = modelMapper.map(template, RoutineEntity.class);
        routine.setId(UUID.randomUUID().toString());
        routine.setTemplateId(templateId);
        routine.setCreatedAt(LocalDateTime.now().toString());
        routine = routineRepository.save(routine);
        return modelMapper.map(routine, RoutineResponse.class);
    }

    // ────────────────────── Diet templates ──────────────────────

    @Override
    public List<DietTemplateResponse> getDietTemplates() {
        return dietTemplateRepository.findAll().stream()
                .map(dt -> modelMapper.map(dt, DietTemplateResponse.class))
                .collect(Collectors.toList());
    }

    @Override
    public DietTemplateResponse createDietTemplate(DietTemplateRequest request) {
        DietTemplateEntity dt = modelMapper.map(request, DietTemplateEntity.class);
        dt.setId(UUID.randomUUID().toString());
        dt.setCreatedAt(LocalDateTime.now().toString());
        dt = dietTemplateRepository.save(dt);
        return modelMapper.map(dt, DietTemplateResponse.class);
    }

    @Override
    public DietTemplateResponse updateDietTemplate(String id, DietTemplateRequest request) {
        DietTemplateEntity dt = dietTemplateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Diet template no encontrado"));
        modelMapper.map(request, dt);
        dt = dietTemplateRepository.save(dt);
        return modelMapper.map(dt, DietTemplateResponse.class);
    }

    @Override
    public void deleteDietTemplate(String id) {
        dietTemplateRepository.deleteById(id);
    }

    // ──────────────────────────── Dietas ────────────────────────────

    @Override
    public List<DietResponse> getDiets() {
        return dietRepository.findAll().stream()
                .map(d -> modelMapper.map(d, DietResponse.class))
                .collect(Collectors.toList());
    }

    @Override
    public DietResponse createDiet(DietRequest request) {
        DietEntity diet = modelMapper.map(request, DietEntity.class);
        diet.setId(UUID.randomUUID().toString());
        diet.setCreatedAt(LocalDateTime.now().toString());
        diet = dietRepository.save(diet);
        return modelMapper.map(diet, DietResponse.class);
    }

    @Override
    public DietResponse updateDiet(String id, DietRequest request) {
        DietEntity diet = dietRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dieta no encontrada"));
        modelMapper.map(request, diet);
        diet = dietRepository.save(diet);
        return modelMapper.map(diet, DietResponse.class);
    }

    @Override
    public void deleteDiet(String id) {
        dietRepository.deleteById(id);
    }

    @Override
    public DietResponse createDietFromTemplate(String templateId) {
        DietTemplateEntity template = dietTemplateRepository.findById(templateId)
                .orElseThrow(() -> new RuntimeException("Diet template no encontrado"));
        DietEntity diet = modelMapper.map(template, DietEntity.class);
        diet.setId(UUID.randomUUID().toString());
        diet.setTemplateId(templateId);
        diet.setCreatedAt(LocalDateTime.now().toString());
        diet = dietRepository.save(diet);
        return modelMapper.map(diet, DietResponse.class);
    }

    // ────────────────────────── Asignaciones ──────────────────────────

    @Override
    public AssignmentResponse assignRoutine(AssignmentRequest request) {
        AssignmentEntity assignment = modelMapper.map(request, AssignmentEntity.class);
        assignment.setId(UUID.randomUUID().toString());
        assignment.setAssignedAt(LocalDateTime.now());
        assignment = assignmentRepository.save(assignment);
        return modelMapper.map(assignment, AssignmentResponse.class);
    }

    @Override
    public List<AssignmentResponse> getAssignments() {
        return assignmentRepository.findAll().stream()
                .map(a -> modelMapper.map(a, AssignmentResponse.class))
                .collect(Collectors.toList());
    }

    // ──────────────────────────── Notas ─────────────────────────────

    @Override
    public List<NoteResponse> getNotes() {
        return noteRepository.findAll().stream()
                .map(n -> modelMapper.map(n, NoteResponse.class))
                .collect(Collectors.toList());
    }

    @Override
    public NoteResponse createNote(NoteRequest request) {
        NoteEntity note = modelMapper.map(request, NoteEntity.class);
        note.setId(UUID.randomUUID().toString());
        note.setCreatedAt(LocalDateTime.now());
        note.setUpdatedAt(LocalDateTime.now());
        note = noteRepository.save(note);
        return modelMapper.map(note, NoteResponse.class);
    }

    @Override
    public NoteResponse updateNote(String id, NoteRequest request) {
        NoteEntity note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nota no encontrada"));
        modelMapper.map(request, note);
        note.setUpdatedAt(LocalDateTime.now());
        note = noteRepository.save(note);
        return modelMapper.map(note, NoteResponse.class);
    }

    @Override
    public void deleteNote(String id) {
        noteRepository.deleteById(id);
    }

    @Override
    public List<NoteResponse> getNotesForClient(String clientId) {
        return noteRepository.findByClientId(clientId).stream()
                .map(n -> modelMapper.map(n, NoteResponse.class))
                .collect(Collectors.toList());
    }

    // ──────────────────── Progreso del cliente ──────────────────────

    @Override
    public List<?> getClientProgress(String clientId) {
        return progressRepository.findByClientId(clientId);
    }

    // ───────────────────── Hilo de nutricion ────────────────────────

    @Override
    public void sendThreadMessage(String clientId, String text) {
        NutritionThreadEntity thread = nutritionThreadRepository.findByClientId(clientId)
                .orElseGet(() -> {
                    NutritionThreadEntity t = new NutritionThreadEntity();
                    t.setId(UUID.randomUUID().toString());
                    t.setClientId(clientId);
                    t.setMessages("[]");
                    return t;
                });

        // Agregar mensaje al JSON array existente
        String currentMessages = thread.getMessages();
        if (currentMessages == null || currentMessages.equals("[]")) {
            currentMessages = "[{\"text\":\"" + text + "\",\"timestamp\":\"" + LocalDateTime.now() + "\"}]";
        } else {
            currentMessages = currentMessages.substring(0, currentMessages.length() - 1)
                    + ",{\"text\":\"" + text + "\",\"timestamp\":\"" + LocalDateTime.now() + "\"}]";
        }
        thread.setMessages(currentMessages);
        nutritionThreadRepository.save(thread);
    }

    @Override
    public List<?> getThreadForClient(String clientId) {
        return nutritionThreadRepository.findByClientId(clientId)
                .stream().toList();
    }
}
