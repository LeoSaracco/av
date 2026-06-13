package com.av.fitness.application.usecase;

import com.av.fitness.domain.model.Client;
import com.av.fitness.domain.port.ClientRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.UUID;

@Component
public class RegisterClientUseCase {

    private static final Logger log = LoggerFactory.getLogger(RegisterClientUseCase.class);

    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;

    public RegisterClientUseCase(ClientRepository clientRepository, PasswordEncoder passwordEncoder) {
        this.clientRepository = clientRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Client execute(Client client, String rawPassword) {
        // Validar unicidad de email
        if (clientRepository.findByEmail(client.getEmail()).isPresent()) {
            log.warn("Intento de registro con email duplicado: {}", client.getEmail());
            throw new IllegalArgumentException("El email ya está registrado");
        }

        // Hash de contraseña
        client.setPasswordHash(passwordEncoder.encode(rawPassword));

        // Valores por defecto
        if (client.getId() == null || client.getId().isBlank()) {
            client.setId(UUID.randomUUID().toString());
        }
        if (client.getStatus() == null || client.getStatus().isBlank()) {
            client.setStatus("active");
        }
        if (client.getJoinDate() == null) {
            client.setJoinDate(LocalDate.now());
        }

        log.info("Cliente registrado: {}", client.getEmail());
        return clientRepository.save(client);
    }
}
