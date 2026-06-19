package com.av.fitness.service.impl;

import com.av.fitness.dto.coach.*;
import com.av.fitness.dto.MessageDto;
import com.av.fitness.dto.ProgressResponse;
import com.av.fitness.dto.ThreadResponse;
import com.av.fitness.model.*;
import com.av.fitness.repository.*;
import com.av.fitness.service.CoachService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Implements coach operations. Manages clients, routine templates, routines,
 * diet templates, diets, notes, assignments, progress tracking, and
 * nutrition messaging threads.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class CoachServiceImpl implements CoachService {

    private final ClientJpaRepository clientJpaRepository;
    private final RoutineTemplateJpaRepository routineTemplateJpaRepository;
    private final RoutineJpaRepository routineJpaRepository;
    private final DietTemplateJpaRepository dietTemplateJpaRepository;
    private final DietJpaRepository dietJpaRepository;
    private final NoteJpaRepository noteJpaRepository;
    private final AssignmentJpaRepository assignmentJpaRepository;
    private final ProgressJpaRepository progressJpaRepository;
    private final NutritionThreadJpaRepository nutritionThreadJpaRepository;
    private final DietAssignmentJpaRepository dietAssignmentJpaRepository;
    private final AuditEventJpaRepository auditEventJpaRepository;
    private final ModelMapper modelMapper;
    private final ObjectMapper objectMapper;

    // ── Clients ──

    /** Creates a new client. */
    @Override
    public ClientResponse createClient(ClientRequest request) {
        ClientEntity entity = new ClientEntity();
        entity.setId(UUID.randomUUID());
        entity.setName(request.getName());
        entity.setEmail(request.getEmail());
        entity.setPhone(request.getPhone());
        entity.setGoal(request.getGoal());
        entity.setStatus("ACTIVO");
        entity.setJoinDate(LocalDate.now());
        entity.setAvatarUrl(request.getAvatarUrl());
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());

        clientJpaRepository.save(entity);
        return modelMapper.map(entity, ClientResponse.class);
    }

    /** Updates an existing client by ID. */
    @Override
    public ClientResponse updateClient(UUID id, ClientRequest request) {
        ClientEntity entity = clientJpaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        entity.setName(request.getName());
        entity.setEmail(request.getEmail());
        entity.setPhone(request.getPhone());
        entity.setGoal(request.getGoal());
        entity.setStatus(request.getStatus());
        entity.setAvatarUrl(request.getAvatarUrl());
        entity.setUpdatedAt(LocalDateTime.now());

        clientJpaRepository.save(entity);
        return modelMapper.map(entity, ClientResponse.class);
    }

    /** Deletes a client by ID. */
    @Override
    public void deleteClient(UUID id) {
        clientJpaRepository.deleteById(id);
    }

    /** Retrieves a client by ID. */
    @Override
    public ClientResponse getClient(UUID id) {
        ClientEntity entity = clientJpaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        return modelMapper.map(entity, ClientResponse.class);
    }

    /** Retrieves all clients. */
    @Override
    public List<ClientResponse> getClients() {
        return clientJpaRepository.findAll().stream()
                .map(e -> modelMapper.map(e, ClientResponse.class))
                .collect(Collectors.toList());
    }

    // ── Routine Templates ──

    /** Creates a new routine template. */
    @Override
    public TemplateResponse createTemplate(TemplateRequest request) {
        RoutineTemplateEntity entity = new RoutineTemplateEntity();
        entity.setId(UUID.randomUUID());
        entity.setName(request.getName());
        entity.setGoal(request.getGoal());
        entity.setDescription(request.getDescription());
        entity.setExercises(request.getExercises() != null ? request.getExercises() : "[]");
        entity.setCreatedAt(LocalDate.now());
        entity.setUpdatedAt(LocalDateTime.now());

        routineTemplateJpaRepository.save(entity);
        return modelMapper.map(entity, TemplateResponse.class);
    }

    /** Updates a routine template by ID. */
    @Override
    public TemplateResponse updateTemplate(UUID id, TemplateRequest request) {
        RoutineTemplateEntity entity = routineTemplateJpaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plantilla no encontrada"));
        entity.setName(request.getName());
        entity.setGoal(request.getGoal());
        entity.setDescription(request.getDescription());
        entity.setExercises(request.getExercises());
        entity.setUpdatedAt(LocalDateTime.now());

        routineTemplateJpaRepository.save(entity);
        return modelMapper.map(entity, TemplateResponse.class);
    }

    /** Deletes a routine template by ID. */
    @Override
    public void deleteTemplate(UUID id) {
        routineTemplateJpaRepository.deleteById(id);
    }

    /** Retrieves a routine template by ID. */
    @Override
    public TemplateResponse getTemplate(UUID id) {
        RoutineTemplateEntity entity = routineTemplateJpaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plantilla no encontrada"));
        return modelMapper.map(entity, TemplateResponse.class);
    }

    /** Retrieves all routine templates. */
    @Override
    public List<TemplateResponse> getTemplates() {
        return routineTemplateJpaRepository.findAll().stream()
                .map(e -> modelMapper.map(e, TemplateResponse.class))
                .collect(Collectors.toList());
    }

    // ── Routines ──

    /** Creates a new routine. */
    @Override
    public RoutineResponse createRoutine(RoutineRequest request) {
        RoutineEntity entity = new RoutineEntity();
        entity.setId(UUID.randomUUID());
        entity.setName(request.getName());
        entity.setGoal(request.getGoal());
        entity.setTemplateId(request.getTemplateId());
        entity.setExercises(request.getExercises() != null ? request.getExercises() : "[]");
        entity.setCreatedAt(LocalDate.now());
        entity.setUpdatedAt(LocalDateTime.now());

        routineJpaRepository.save(entity);
        return modelMapper.map(entity, RoutineResponse.class);
    }

    /** Updates a routine by ID. */
    @Override
    public RoutineResponse updateRoutine(UUID id, RoutineRequest request) {
        RoutineEntity entity = routineJpaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rutina no encontrada"));
        entity.setName(request.getName());
        entity.setGoal(request.getGoal());
        entity.setTemplateId(request.getTemplateId());
        entity.setExercises(request.getExercises());
        entity.setUpdatedAt(LocalDateTime.now());

        routineJpaRepository.save(entity);
        return modelMapper.map(entity, RoutineResponse.class);
    }

    /** Deletes a routine by ID. */
    @Override
    public void deleteRoutine(UUID id) {
        routineJpaRepository.deleteById(id);
    }

    /** Retrieves a routine by ID. */
    @Override
    public RoutineResponse getRoutine(UUID id) {
        RoutineEntity entity = routineJpaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rutina no encontrada"));
        return modelMapper.map(entity, RoutineResponse.class);
    }

    /** Retrieves all routines. */
    @Override
    public List<RoutineResponse> getRoutines() {
        return routineJpaRepository.findAll().stream()
                .map(e -> modelMapper.map(e, RoutineResponse.class))
                .collect(Collectors.toList());
    }

    // ── Diets ──

    /** Creates a new diet. */
    @Override
    public DietResponse createDiet(DietRequest request) {
        DietEntity entity = new DietEntity();
        entity.setId(UUID.randomUUID());
        entity.setName(request.getName());
        entity.setGoal(request.getGoal());
        entity.setTemplateId(request.getTemplateId());
        entity.setIndications(request.getIndications());
        entity.setMeals(request.getMeals() != null ? request.getMeals() : "[]");
        entity.setCreatedAt(LocalDate.now());
        entity.setUpdatedAt(LocalDateTime.now());

        dietJpaRepository.save(entity);
        return modelMapper.map(entity, DietResponse.class);
    }

    /** Updates a diet by ID. */
    @Override
    public DietResponse updateDiet(UUID id, DietRequest request) {
        DietEntity entity = dietJpaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dieta no encontrada"));
        entity.setName(request.getName());
        entity.setGoal(request.getGoal());
        entity.setTemplateId(request.getTemplateId());
        entity.setIndications(request.getIndications());
        entity.setMeals(request.getMeals());
        entity.setUpdatedAt(LocalDateTime.now());

        dietJpaRepository.save(entity);
        return modelMapper.map(entity, DietResponse.class);
    }

    /** Deletes a diet by ID. */
    @Override
    public void deleteDiet(UUID id) {
        dietJpaRepository.deleteById(id);
    }

    /** Retrieves a diet by ID. */
    @Override
    public DietResponse getDiet(UUID id) {
        DietEntity entity = dietJpaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dieta no encontrada"));
        return modelMapper.map(entity, DietResponse.class);
    }

    /** Retrieves all diets. */
    @Override
    public List<DietResponse> getDiets() {
        return dietJpaRepository.findAll().stream()
                .map(e -> modelMapper.map(e, DietResponse.class))
                .collect(Collectors.toList());
    }

    // ── Diet Templates ──

    /** Creates a new diet template. */
    @Override
    public DietTemplateResponse createDietTemplate(DietTemplateRequest request) {
        DietTemplateEntity entity = new DietTemplateEntity();
        entity.setId(UUID.randomUUID());
        entity.setName(request.getName());
        entity.setGoal(request.getGoal());
        entity.setDescription(request.getDescription());
        entity.setIndications(request.getIndications());
        entity.setMeals(request.getMeals() != null ? request.getMeals() : "[]");
        entity.setCreatedAt(LocalDate.now());
        entity.setUpdatedAt(LocalDateTime.now());

        dietTemplateJpaRepository.save(entity);
        return modelMapper.map(entity, DietTemplateResponse.class);
    }

    /** Updates a diet template by ID. */
    @Override
    public DietTemplateResponse updateDietTemplate(UUID id, DietTemplateRequest request) {
        DietTemplateEntity entity = dietTemplateJpaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plantilla de dieta no encontrada"));
        entity.setName(request.getName());
        entity.setGoal(request.getGoal());
        entity.setDescription(request.getDescription());
        entity.setIndications(request.getIndications());
        entity.setMeals(request.getMeals());
        entity.setUpdatedAt(LocalDateTime.now());

        dietTemplateJpaRepository.save(entity);
        return modelMapper.map(entity, DietTemplateResponse.class);
    }

    /** Deletes a diet template by ID. */
    @Override
    public void deleteDietTemplate(UUID id) {
        dietTemplateJpaRepository.deleteById(id);
    }

    /** Retrieves a diet template by ID. */
    @Override
    public DietTemplateResponse getDietTemplate(UUID id) {
        DietTemplateEntity entity = dietTemplateJpaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plantilla de dieta no encontrada"));
        return modelMapper.map(entity, DietTemplateResponse.class);
    }

    /** Retrieves all diet templates. */
    @Override
    public List<DietTemplateResponse> getDietTemplates() {
        return dietTemplateJpaRepository.findAll().stream()
                .map(e -> modelMapper.map(e, DietTemplateResponse.class))
                .collect(Collectors.toList());
    }

    // ── Notes ──

    /** Updates a note by ID. */
    @Override
    public NoteResponse updateNote(UUID id, NoteRequest request) {
        NoteEntity entity = noteJpaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nota no encontrada"));
        entity.setText(request.getText());
        entity.setUpdatedAt(LocalDate.now());

        noteJpaRepository.save(entity);
        return modelMapper.map(entity, NoteResponse.class);
    }

    /** Deletes a note by ID. */
    @Override
    public void deleteNote(UUID id) {
        noteJpaRepository.deleteById(id);
    }

    /** Retrieves a note by ID. */
    @Override
    public NoteResponse getNote(UUID id) {
        NoteEntity entity = noteJpaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nota no encontrada"));
        return modelMapper.map(entity, NoteResponse.class);
    }

    /** Retrieves all notes for a client ordered by creation date. */
    @Override
    public List<NoteResponse> getNotesForClient(UUID clientId) {
        return noteJpaRepository.findByClientIdOrderByCreatedAtDesc(clientId).stream()
                .map(e -> modelMapper.map(e, NoteResponse.class))
                .collect(Collectors.toList());
    }

    /** Adds a new note for a client. */
    @Override
    public NoteResponse addNote(UUID clientId, NoteRequest request) {
        NoteEntity entity = new NoteEntity();
        entity.setId(UUID.randomUUID());
        entity.setClientId(clientId);
        entity.setText(request.getText());
        LocalDate now = LocalDate.now();
        entity.setCreatedAt(now);
        entity.setUpdatedAt(now);
        entity.setUpdatedAtTz(LocalDateTime.now());

        noteJpaRepository.save(entity);
        return modelMapper.map(entity, NoteResponse.class);
    }

    // ── Assignments ──

    /**
     * Creates an assignment linking a routine and optionally a diet to a client.
     * <p>
     * If the client already has an active assignment, it is deactivated and an
     * audit event is recorded with the reassignment details. A note is also
     * created for the client summarising the change.
     *
     * @param request assignment request with {@code clientId},
     *                {@code routineId}, {@code dietId}, {@code reason}, and {@code observations}
     * @return the created assignment
     */
    @Override
    public AssignmentResponse createAssignment(AssignmentRequest request) {
        LocalDate today = LocalDate.now();

        assignmentJpaRepository.findAll().stream()
                .filter(a -> a.getClientId().equals(request.getClientId()) && a.getActive())
                .findFirst()
                .ifPresent(prev -> {
                    prev.setActive(false);
                    assignmentJpaRepository.save(prev);

                    UUID oldRoutineId = prev.getRoutineId();
                    UUID newRoutineId = request.getRoutineId();
                    String reason = request.getReason();
                    String observations = request.getObservations();

                    String oldName = routineJpaRepository.findById(oldRoutineId)
                            .map(RoutineEntity::getName).orElse("Rutina anterior");
                    String newName = routineJpaRepository.findById(newRoutineId)
                            .map(RoutineEntity::getName).orElse("Nueva rutina");

                    String reasonLabel = switch (reason != null ? reason : "") {
                        case "OBJETIVO_CUMPLIDO" -> "Cumplió el objetivo 🎯";
                        case "CAMBIO_ESTRATEGIA" -> "Cambio de estrategia 🔄";
                        case "NO_CUMPLIO" -> "No cumplió el objetivo ⚠";
                        default -> reason;
                    };

                    if (reason != null && !reason.isBlank()) {
                        String auditPayload = "{\"action\":\"REASSIGN_ROUTINE\","
                                + "\"oldRoutineId\":\"" + oldRoutineId + "\","
                                + "\"newRoutineId\":\"" + newRoutineId + "\","
                                + "\"reason\":\"" + reason + "\","
                                + "\"observations\":\"" + (observations != null ? observations : "") + "\"}";

                        AuditEventEntity event = new AuditEventEntity();
                        event.setId(UUID.randomUUID());
                        event.setEventType("REASSIGN_ROUTINE");
                        event.setAggregateType("ASSIGNMENT");
                        event.setAggregateId(prev.getId());
                        event.setClientId(request.getClientId());
                        event.setPayload(auditPayload);
                        event.setCreatedAt(LocalDateTime.now());
                        auditEventJpaRepository.save(event);
                    }

                    String noteText = "📋 Rutina actualizada — " + today + "\n"
                            + oldName + " → " + newName + "\n"
                            + "Motivo: " + reasonLabel;
                    if (observations != null && !observations.isBlank()) {
                        noteText += "\nObs: " + observations;
                    }

                    NoteEntity note = new NoteEntity();
                    note.setId(UUID.randomUUID());
                    note.setClientId(request.getClientId());
                    note.setText(noteText);
                    note.setCreatedAt(today);
                    note.setUpdatedAt(today);
                    note.setUpdatedAtTz(LocalDateTime.now());
                    noteJpaRepository.save(note);
                });

        AssignmentEntity entity = new AssignmentEntity();
        entity.setId(UUID.randomUUID());
        entity.setClientId(request.getClientId());
        entity.setRoutineId(request.getRoutineId());
        entity.setDietId(request.getDietId());
        entity.setAssignedAt(today);
        entity.setActive(true);
        entity.setCreatedAt(LocalDateTime.now());

        assignmentJpaRepository.save(entity);
        return modelMapper.map(entity, AssignmentResponse.class);
    }

    /** Sets {@code active = false} on the given assignment. */
    @Override
    public void deactivateAssignment(UUID id) {
        AssignmentEntity entity = assignmentJpaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asignacion no encontrada"));
        entity.setActive(false);
        assignmentJpaRepository.save(entity);
    }

    /** Retrieves all assignments for a client. */
    @Override
    public List<AssignmentResponse> getAssignmentsForClient(UUID clientId) {
        return assignmentJpaRepository.findAll().stream()
                .filter(a -> a.getClientId().equals(clientId))
                .map(e -> modelMapper.map(e, AssignmentResponse.class))
                .collect(Collectors.toList());
    }

    // ── Progress & Thread ──

    /** Retrieves progress records for a client ordered by date. */
    @Override
    public List<ProgressResponse> getClientProgress(UUID clientId) {
        return progressJpaRepository.findByClientIdOrderByDateAsc(clientId).stream()
                .map(e -> modelMapper.map(e, ProgressResponse.class))
                .collect(Collectors.toList());
    }

    /**
     * Parses the messages JSONB string into a List of MessageDto.
     *
     * @param messagesJson the raw JSON string from the database
     * @return parsed list, or empty list on failure
     */
    private List<MessageDto> parseMessages(String messagesJson) {
        if (messagesJson == null || messagesJson.isBlank() || "[]".equals(messagesJson)) {
            return new ArrayList<>();
        }
        try {
            return objectMapper.readValue(messagesJson, new TypeReference<List<MessageDto>>() {});
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    /**
     * Maps a NutritionThreadEntity to ThreadResponse with parsed messages.
     */
    private ThreadResponse mapThreadToResponse(NutritionThreadEntity entity) {
        return ThreadResponse.builder()
                .id(entity.getId())
                .clientId(entity.getClientId())
                .messages(parseMessages(entity.getMessages()))
                .lastReadAt(entity.getLastReadAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    /** Retrieves the nutrition messaging thread for a client. */
    @Override
    public ThreadResponse getThreadForClient(UUID clientId) {
        NutritionThreadEntity entity = nutritionThreadJpaRepository.findByClientId(clientId)
                .orElseThrow(() -> new RuntimeException("Hilo no encontrado para el cliente"));
        return mapThreadToResponse(entity);
    }

    /**
     * Appends a COACH message to the nutrition thread JSON.
     *
     * @param clientId the client ID
     * @param message  the message text to send
     * @return the updated thread
     */
    @Override
    public ThreadResponse sendThreadMessage(UUID clientId, String message) {
        NutritionThreadEntity entity = nutritionThreadJpaRepository.findByClientId(clientId)
                .orElseThrow(() -> new RuntimeException("Hilo no encontrado para el cliente"));

        String jsonMessage = "{\"id\":\"" + UUID.randomUUID()
                + "\",\"sender\":\"COACH\",\"text\":\"" + message
                + "\",\"date\":\"" + LocalDateTime.now() + "\"}";

        String messages = entity.getMessages();
        if (messages == null || "[]".equals(messages)) {
            messages = "[" + jsonMessage + "]";
        } else {
            messages = messages.substring(0, messages.length() - 1)
                    + "," + jsonMessage + "]";
        }
        entity.setMessages(messages);
        entity.setUpdatedAt(LocalDateTime.now());

        nutritionThreadJpaRepository.save(entity);
        return mapThreadToResponse(entity);
    }

    // ── Diet from template ───────────────────────────────────────────

    /**
     * Creates a personalised diet by copying a diet template.
     *
     * @param request the template ID and optional overrides
     * @return the created diet
     */
    @Override
    public DietResponse createDietFromTemplate(DietFromTemplateRequest request) {
        DietTemplateEntity template = dietTemplateJpaRepository.findById(request.getTemplateId())
                .orElseThrow(() -> new RuntimeException("Template de dieta no encontrado"));

        DietEntity diet = new DietEntity();
        diet.setId(UUID.randomUUID());
        diet.setName(request.getName() != null && !request.getName().isBlank()
                ? request.getName() : template.getName());
        diet.setGoal(request.getGoal() != null && !request.getGoal().isBlank()
                ? request.getGoal() : template.getGoal());
        diet.setTemplateId(template.getId());
        diet.setIndications(template.getIndications());
        diet.setMeals(template.getMeals());
        diet.setCreatedAt(LocalDate.now());
        diet.setUpdatedAt(LocalDateTime.now());

        dietJpaRepository.save(diet);
        return modelMapper.map(diet, DietResponse.class);
    }

    // ── Diet assignment ──────────────────────────────────────────────

    /**
     * Assigns a diet to a client, deactivating any previous active assignment.
     *
     * @param clientId the client UUID
     * @param request  the diet assignment payload
     * @return the created diet assignment
     */
    @Override
    public DietAssignmentResponse assignDiet(UUID clientId, DietAssignmentRequest request) {
        clientJpaRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        dietJpaRepository.findById(request.getDietId())
                .orElseThrow(() -> new RuntimeException("Dieta no encontrada"));

        dietAssignmentJpaRepository.findAll().stream()
                .filter(a -> a.getClientId().equals(clientId) && Boolean.TRUE.equals(a.getActive()))
                .forEach(a -> { a.setActive(false); a.setCreatedAt(a.getCreatedAt()); });

        DietAssignmentEntity assignment = new DietAssignmentEntity();
        assignment.setId(UUID.randomUUID());
        assignment.setClientId(clientId);
        assignment.setDietId(request.getDietId());
        assignment.setAssignedAt(LocalDate.now());
        assignment.setActive(true);
        assignment.setCreatedAt(LocalDateTime.now());

        dietAssignmentJpaRepository.save(assignment);
        return modelMapper.map(assignment, DietAssignmentResponse.class);
    }

    // ── Notifications ────────────────────────────────────────────────

    /**
     * Builds lightweight notification previews for all client threads.
     *
     * @return notifications ordered by unread first, then most recent
     */
    @Override
    public List<ThreadNotificationResponse> getNotifications() {
        List<ClientEntity> clients = clientJpaRepository.findAll();
        if (clients.isEmpty()) return List.of();

        List<UUID> clientIds = clients.stream().map(ClientEntity::getId).toList();
        List<NutritionThreadEntity> threads = nutritionThreadJpaRepository.findAllByClientIdIn(clientIds);

        Map<UUID, NutritionThreadEntity> threadMap = threads.stream()
                .collect(Collectors.toMap(NutritionThreadEntity::getClientId, t -> t, (a, b) -> a));

        Map<UUID, String> dietNames = new HashMap<>();
        dietAssignmentJpaRepository.findAll().stream()
                .filter(a -> Boolean.TRUE.equals(a.getActive()))
                .forEach(a -> dietNames.put(a.getClientId(),
                        dietJpaRepository.findById(a.getDietId()).map(DietEntity::getName).orElse(null)));

        List<ThreadNotificationResponse> result = new ArrayList<>();

        for (ClientEntity client : clients) {
            NutritionThreadEntity thread = threadMap.get(client.getId());
            if (thread == null) continue;

            List<MessageDto> parsed = parseMessages(thread.getMessages());
            MessageDto lastMsg = parsed.isEmpty() ? null : parsed.get(parsed.size() - 1);

            boolean unread = thread.getLastReadAt() == null
                    || thread.getUpdatedAt().isAfter(thread.getLastReadAt());

            result.add(ThreadNotificationResponse.builder()
                    .threadId(thread.getId())
                    .clientId(client.getId())
                    .clientName(client.getName())
                    .dietName(dietNames.get(client.getId()))
                    .lastMessage(lastMsg != null ? lastMsg.getText() : null)
                    .lastSender(lastMsg != null ? lastMsg.getSender() : null)
                    .updatedAt(thread.getUpdatedAt())
                    .unread(unread)
                    .build());
        }

        result.sort(Comparator
                .comparing(ThreadNotificationResponse::isUnread).reversed()
                .thenComparing(ThreadNotificationResponse::getUpdatedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())));

        return result;
    }

    /**
     * Marks the nutrition thread as read by setting last_read_at to now.
     *
     * @param clientId the client UUID
     */
    @Override
    public void markThreadRead(UUID clientId) {
        nutritionThreadJpaRepository.findByClientId(clientId).ifPresent(entity -> {
            entity.setLastReadAt(LocalDateTime.now());
            nutritionThreadJpaRepository.save(entity);
        });
    }
}
