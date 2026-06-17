package com.av.fitness.service.impl;

import com.av.fitness.dto.coach.DietResponse;
import com.av.fitness.dto.coach.NoteResponse;
import com.av.fitness.dto.coach.RoutineResponse;
import com.av.fitness.dto.ProgressResponse;
import com.av.fitness.dto.ThreadResponse;
import com.av.fitness.model.*;
import com.av.fitness.repository.*;
import com.av.fitness.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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

    @Override
    public RoutineResponse getMyRoutine(UUID clientId) {
        AssignmentEntity assignment = assignmentJpaRepository.findAll().stream()
                .filter(a -> a.getClientId().equals(clientId) && a.getActive())
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No hay rutina activa asignada"));

        RoutineEntity routine = routineJpaRepository.findById(assignment.getRoutineId())
                .orElseThrow(() -> new RuntimeException("Rutina no encontrada"));
        return modelMapper.map(routine, RoutineResponse.class);
    }

    @Override
    public DietResponse getMyDiet(UUID clientId) {
        DietAssignmentEntity assignment = dietAssignmentJpaRepository.findAll().stream()
                .filter(a -> a.getClientId().equals(clientId) && a.getActive())
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No hay dieta activa asignada"));

        DietEntity diet = dietJpaRepository.findById(assignment.getDietId())
                .orElseThrow(() -> new RuntimeException("Dieta no encontrada"));
        return modelMapper.map(diet, DietResponse.class);
    }

    @Override
    public List<ProgressResponse> getMyProgress(UUID clientId) {
        return progressJpaRepository.findByClientIdOrderByDateAsc(clientId).stream()
                .map(e -> modelMapper.map(e, ProgressResponse.class))
                .collect(Collectors.toList());
    }

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

    @Override
    public void deleteProgress(UUID id) {
        progressJpaRepository.deleteById(id);
    }

    @Override
    public List<NoteResponse> getMyNotes(UUID clientId) {
        return noteJpaRepository.findByClientIdOrderByCreatedAtDesc(clientId).stream()
                .map(e -> modelMapper.map(e, NoteResponse.class))
                .collect(Collectors.toList());
    }

    @Override
    public ThreadResponse getMyThread(UUID clientId) {
        NutritionThreadEntity entity = nutritionThreadJpaRepository.findByClientId(clientId)
                .orElseThrow(() -> new RuntimeException("Hilo no encontrado"));
        return modelMapper.map(entity, ThreadResponse.class);
    }

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
        return modelMapper.map(entity, ThreadResponse.class);
    }
}
