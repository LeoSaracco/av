package com.av.fitness.application.usecase;

import com.av.fitness.domain.model.Progress;
import com.av.fitness.domain.port.ClientRepository;
import com.av.fitness.domain.port.ProgressRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.UUID;

@Component
public class LogProgressUseCase {

    private static final Logger log = LoggerFactory.getLogger(LogProgressUseCase.class);

    private final ProgressRepository progressRepository;
    private final ClientRepository clientRepository;

    public LogProgressUseCase(ProgressRepository progressRepository, ClientRepository clientRepository) {
        this.progressRepository = progressRepository;
        this.clientRepository = clientRepository;
    }

    public Progress execute(String clientId, double weight, String comment) {
        // Validar que el cliente existe
        clientRepository.findById(clientId)
                .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado: " + clientId));

        Progress progress = new Progress(
                UUID.randomUUID().toString(),
                clientId,
                LocalDate.now(),
                weight,
                comment
        );

        log.info("Progreso registrado: cliente={}, peso={}kg", clientId, weight);
        return progressRepository.save(progress);
    }
}
