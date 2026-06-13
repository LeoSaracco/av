package com.av.fitness.application.usecase;

import com.av.fitness.domain.model.Assignment;
import com.av.fitness.domain.port.AssignmentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.UUID;

public class AssignRoutineUseCase {

    private static final Logger log = LoggerFactory.getLogger(AssignRoutineUseCase.class);

    private final AssignmentRepository assignmentRepository;

    public AssignRoutineUseCase(AssignmentRepository assignmentRepository) {
        this.assignmentRepository = assignmentRepository;
    }

    public Assignment execute(String clientId, String routineId, String dietId) {
        // TODO: Validate client exists, validate routine/diet exist, create assignment
        log.info("[STUB] Assigning routine {} to client {}", routineId, clientId);
        return assignmentRepository.save(
                new Assignment(UUID.randomUUID().toString(), clientId, routineId, dietId,
                        LocalDateTime.now(), true));
    }
}
