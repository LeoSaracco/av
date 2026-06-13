package com.av.fitness.application.usecase;

import com.av.fitness.domain.model.Progress;
import com.av.fitness.domain.port.ProgressRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.util.UUID;

public class LogProgressUseCase {

    private static final Logger log = LoggerFactory.getLogger(LogProgressUseCase.class);

    private final ProgressRepository progressRepository;

    public LogProgressUseCase(ProgressRepository progressRepository) {
        this.progressRepository = progressRepository;
    }

    public Progress execute(String clientId, double weight, String comment) {
        // TODO: Validate client exists, log weight entry
        log.info("[STUB] Logging progress for client {}: {}kg", clientId, weight);
        return progressRepository.save(
                new Progress(UUID.randomUUID().toString(), clientId, LocalDate.now(), weight, comment));
    }
}
