package com.av.fitness.application.usecase;

import com.av.fitness.domain.model.Assignment;
import com.av.fitness.domain.port.AssignmentRepository;
import com.av.fitness.domain.port.ClientRepository;
import com.av.fitness.domain.port.DietRepository;
import com.av.fitness.domain.port.RoutineRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.UUID;

@Component
public class AssignRoutineUseCase {

    private static final Logger log = LoggerFactory.getLogger(AssignRoutineUseCase.class);

    private final AssignmentRepository assignmentRepository;
    private final ClientRepository clientRepository;
    private final RoutineRepository routineRepository;
    private final DietRepository dietRepository;

    public AssignRoutineUseCase(AssignmentRepository assignmentRepository,
                                ClientRepository clientRepository,
                                RoutineRepository routineRepository,
                                DietRepository dietRepository) {
        this.assignmentRepository = assignmentRepository;
        this.clientRepository = clientRepository;
        this.routineRepository = routineRepository;
        this.dietRepository = dietRepository;
    }

    public Assignment execute(String clientId, String routineId, String dietId) {
        // Validar que el cliente existe
        clientRepository.findById(clientId)
                .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado: " + clientId));

        // Validar que la rutina existe (si se especificó)
        if (routineId != null) {
            routineRepository.findById(routineId)
                    .orElseThrow(() -> new IllegalArgumentException("Rutina no encontrada: " + routineId));
        }

        // Validar que la dieta existe (si se especificó)
        if (dietId != null) {
            dietRepository.findById(dietId)
                    .orElseThrow(() -> new IllegalArgumentException("Dieta no encontrada: " + dietId));
        }

        Assignment assignment = new Assignment(
                UUID.randomUUID().toString(),
                clientId,
                routineId,
                dietId,
                LocalDateTime.now(),
                true
        );

        log.info("Asignación creada: cliente={}, rutina={}, dieta={}", clientId, routineId, dietId);
        return assignmentRepository.save(assignment);
    }
}
