package com.av.fitness.service.impl;

import com.av.fitness.dto.coach.DietResponse;
import com.av.fitness.dto.coach.NoteResponse;
import com.av.fitness.dto.coach.RoutineResponse;
import com.av.fitness.dto.coach.ThreadNotificationResponse;
import com.av.fitness.dto.MessageDto;
import com.av.fitness.dto.ProgressResponse;
import com.av.fitness.dto.ThreadResponse;
import com.av.fitness.model.*;
import com.av.fitness.repository.*;
import com.av.fitness.service.ClientService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Implements client self-service operations. Provides access to the authenticated
 * client's routine, diet, progress tracking, coach notes, and nutrition thread.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class ClientServiceImpl implements ClientService {

    private final AssignmentJpaRepository assignmentJpaRepository;
    private final DietAssignmentJpaRepository dietAssignmentJpaRepository;
    private final RoutineJpaRepository routineJpaRepository;
    private final DietJpaRepository dietJpaRepository;
    private final ProgressJpaRepository progressJpaRepository;
    private final NoteJpaRepository noteJpaRepository;
    private final NutritionThreadJpaRepository nutritionThreadJpaRepository;
    private final ModelMapper modelMapper;
    private final ObjectMapper objectMapper;

    /**
     * Finds the active routine assignment for the given client and maps it to a response.
     *
     * @param clientId the authenticated client's ID
     * @return the active routine mapped to {@link RoutineResponse}
     * @throws RuntimeException if no active routine is assigned
     */
    @Override
    public RoutineResponse getMyRoutine(UUID clientId) {
        AssignmentEntity assignment = assignmentJpaRepository.findByClientIdAndActive(clientId, true)
                .orElseThrow(() -> new RuntimeException("No hay rutina activa asignada"));

        RoutineEntity routine = routineJpaRepository.findById(assignment.getRoutineId())
                .orElseThrow(() -> new RuntimeException("Rutina no encontrada"));
        return modelMapper.map(routine, RoutineResponse.class);
    }

    /**
     * Finds the active diet assignment for the given client and maps it to a response.
     *
     * @param clientId the authenticated client's ID
     * @return the active diet mapped to {@link DietResponse}
     * @throws RuntimeException if no active diet is assigned
     */
    @Override
    public DietResponse getMyDiet(UUID clientId) {
        DietAssignmentEntity assignment = dietAssignmentJpaRepository.findByClientIdAndActive(clientId, true)
                .orElseThrow(() -> new RuntimeException("No hay dieta activa asignada"));

        DietEntity diet = dietJpaRepository.findById(assignment.getDietId())
                .orElseThrow(() -> new RuntimeException("Dieta no encontrada"));
        return modelMapper.map(diet, DietResponse.class);
    }

    /**
     * Returns all progress entries for the client, ordered by date ascending.
     *
     * @param clientId the authenticated client's ID
     * @return list of progress entries mapped to {@link ProgressResponse}
     */
    @Override
    public List<ProgressResponse> getMyProgress(UUID clientId) {
        return progressJpaRepository.findByClientIdOrderByDateAsc(clientId).stream()
                .map(e -> modelMapper.map(e, ProgressResponse.class))
                .collect(Collectors.toList());
    }

    /**
     * Creates a new progress entry with the given weight, date, and comment.
     * Defaults the date to today if not provided.
     *
     * @param clientId the authenticated client's ID
     * @param request  the progress data (weight, date, comment)
     * @return the saved progress entry mapped to {@link ProgressResponse}
     */
    @Override
    public ProgressResponse logProgress(UUID clientId, ProgressResponse request) {
        ProgressEntity entity = new ProgressEntity();
        entity.setId(UUID.randomUUID());
        entity.setClientId(clientId);
        entity.setDate(request.getDate() != null ? request.getDate() : LocalDate.now());
        entity.setWeight(request.getWeight());
        entity.setComment(request.getComment());
        entity.setCreatedAt(LocalDateTime.now());

        progressJpaRepository.save(entity);
        return modelMapper.map(entity, ProgressResponse.class);
    }

    /**
     * Updates the fields (date, weight, comment) of an existing progress entry.
     * Only non-null fields in the request are applied.
     *
     * @param id      the ID of the progress entry to update
     * @param request the fields to update (date, weight, comment)
     * @return the updated progress entry mapped to {@link ProgressResponse}
     * @throws RuntimeException if the progress entry is not found
     */
    @Override
    public ProgressResponse updateProgress(UUID id, ProgressResponse request) {
        ProgressEntity entity = progressJpaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registro no encontrado"));

        if (request.getDate() != null) entity.setDate(request.getDate());
        if (request.getWeight() != null) entity.setWeight(request.getWeight());
        entity.setComment(request.getComment());

        progressJpaRepository.save(entity);
        return modelMapper.map(entity, ProgressResponse.class);
    }

    /**
     * Deletes a progress entry by its ID.
     *
     * @param id the ID of the progress entry to delete
     */
    @Override
    public void deleteProgress(UUID id) {
        progressJpaRepository.deleteById(id);
    }

    /**
     * Returns all coach notes for the client, ordered by creation date descending
     * (most recent first).
     *
     * @param clientId the authenticated client's ID
     * @return list of coach notes mapped to {@link NoteResponse}
     */
    @Override
    public List<NoteResponse> getMyNotes(UUID clientId) {
        return noteJpaRepository.findByClientIdOrderByCreatedAtDesc(clientId).stream()
                .map(e -> modelMapper.map(e, NoteResponse.class))
                .collect(Collectors.toList());
    }

    /**
     * Returns the nutrition thread for the given client.
     *
     * @param clientId the authenticated client's ID
     * @return the nutrition thread with parsed messages
     * @throws RuntimeException if no thread is found
     */
    @Override
    public ThreadResponse getMyThread(UUID clientId) {
        NutritionThreadEntity entity = nutritionThreadJpaRepository.findByClientId(clientId)
                .orElseThrow(() -> new RuntimeException("Hilo no encontrado"));
        return mapThreadToResponse(entity);
    }

    /**
     * Appends a JSON message to the client's nutrition thread messages array.
     *
     * @param clientId the authenticated client's ID
     * @param message  the text content of the message
     * @return the updated nutrition thread with parsed messages
     * @throws RuntimeException if the thread is not found
     */
    @Override
    public ThreadResponse sendMessage(UUID clientId, String message) {
        NutritionThreadEntity entity = nutritionThreadJpaRepository.findByClientId(clientId)
                .orElseThrow(() -> new RuntimeException("Hilo no encontrado"));

        String jsonMessage = "{\"id\":\"" + UUID.randomUUID()
                + "\",\"sender\":\"CLIENT\",\"text\":\"" + message
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

    /**
     * Parses the messages JSONB string into a List of MessageDto.
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

    /**
     * Marks the client's thread as read.
     *
     * @param clientId the client UUID
     */
    @Override
    public void markMyThreadRead(UUID clientId) {
        nutritionThreadJpaRepository.findByClientId(clientId).ifPresent(entity -> {
            entity.setClientLastReadAt(LocalDateTime.now());
            nutritionThreadJpaRepository.save(entity);
        });
    }

    /**
     * Returns a lightweight notification for the client indicating
     * whether the coach has sent unread messages.
     *
     * @param clientId the client UUID
     * @return notification with unread flag
     */
    @Override
    public ThreadNotificationResponse getMyNotification(UUID clientId) {
        NutritionThreadEntity entity = nutritionThreadJpaRepository.findByClientId(clientId)
                .orElse(null);
        if (entity == null) {
            return ThreadNotificationResponse.builder()
                    .clientId(clientId).unread(false).build();
        }

        List<MessageDto> parsed = parseMessages(entity.getMessages());
        MessageDto lastMsg = parsed.isEmpty() ? null : parsed.get(parsed.size() - 1);

        boolean unread = false;
        String lastSender = null;
        String lastMessage = null;
        if (lastMsg != null) {
            lastSender = lastMsg.getSender();
            lastMessage = lastMsg.getText();
            if ("COACH".equals(lastSender)) {
                unread = entity.getClientLastReadAt() == null
                        || entity.getUpdatedAt().isAfter(entity.getClientLastReadAt());
            }
        }

        return ThreadNotificationResponse.builder()
                .threadId(entity.getId())
                .clientId(clientId)
                .lastMessage(lastMessage)
                .lastSender(lastSender)
                .updatedAt(entity.getUpdatedAt())
                .unread(unread)
                .build();
    }
}
