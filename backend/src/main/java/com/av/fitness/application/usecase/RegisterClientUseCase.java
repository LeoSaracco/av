package com.av.fitness.application.usecase;

import com.av.fitness.domain.model.Client;
import com.av.fitness.domain.port.ClientRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RegisterClientUseCase {

    private static final Logger log = LoggerFactory.getLogger(RegisterClientUseCase.class);

    private final ClientRepository clientRepository;

    public RegisterClientUseCase(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    public Client execute(Client client) {
        // TODO: Hash password, validate uniqueness, send verification email
        log.info("[STUB] Registering client: {}", client.getEmail());
        return clientRepository.save(client);
    }
}
