package com.av.fitness.service.impl;

import com.av.fitness.dto.client.ProgressRequest;
import com.av.fitness.model.*;
import com.av.fitness.repository.*;
import com.av.fitness.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ClientServiceImpl implements ClientService {

    private final AssignmentJpaRepository assignmentRepository;
    private final RoutineJpaRepository routineRepository;
    private final DietJpaRepository dietRepository;
    private final ProgressJpaRepository progressRepository;
    private final NoteJpaRepository noteRepository;
    private final NutritionThreadJpaRepository nutritionThreadRepository;
    private final ModelMapper modelMapper;

    @Override
    public Object getMyRoutine(String clientId) {
        List<AssignmentEntity> assignments = assignmentRepository.findByClientId(clientId);
        return assignments.stream()
                .filter(a -> a.getRoutineId() != null && a.isActive())
                .findFirst()
                .map(a -> routineRepository.findById(a.getRoutineId()).orElse(null))
                .orElse(null);
    }

    @Override
    public Object getMyDiet(String clientId) {
        List<AssignmentEntity> assignments = assignmentRepository.findByClientId(clientId);
        return assignments.stream()
                .filter(a -> a.getDietId() != null && a.isActive())
                .findFirst()
                .map(a -> dietRepository.findById(a.getDietId()).orElse(null))
                .orElse(null);
    }

    @Override
    public List<?> getMyProgress(String clientId) {
        return progressRepository.findByClientId(clientId);
    }

    @Override
    public Object logProgress(String clientId, ProgressRequest request) {
        ProgressEntity progress = new ProgressEntity();
        progress.setId(UUID.randomUUID().toString());
        progress.setClientId(clientId);
        progress.setWeight(request.getWeight());
        progress.setDate(request.getDate());
        progress.setComment(request.getComment());
        return progressRepository.save(progress);
    }

    @Override
    public void deleteProgress(String id) {
        progressRepository.deleteById(id);
    }

    @Override
    public List<?> getMyNotes(String clientId) {
        return noteRepository.findByClientId(clientId);
    }

    @Override
    public List<?> getMyThread(String clientId) {
        return nutritionThreadRepository.findByClientId(clientId)
                .stream().toList();
    }

    @Override
    public Object sendMessage(String clientId, String text) {
        NutritionThreadEntity thread = nutritionThreadRepository.findByClientId(clientId)
                .orElseGet(() -> {
                    NutritionThreadEntity t = new NutritionThreadEntity();
                    t.setId(UUID.randomUUID().toString());
                    t.setClientId(clientId);
                    t.setMessages("[]");
                    return t;
                });

        String currentMessages = thread.getMessages();
        if (currentMessages == null || currentMessages.equals("[]")) {
            currentMessages = "[{\"text\":\"" + text + "\",\"timestamp\":\"" + LocalDateTime.now() + "\"}]";
        } else {
            currentMessages = currentMessages.substring(0, currentMessages.length() - 1)
                    + ",{\"text\":\"" + text + "\",\"timestamp\":\"" + LocalDateTime.now() + "\"}]";
        }
        thread.setMessages(currentMessages);
        return nutritionThreadRepository.save(thread);
    }
}
