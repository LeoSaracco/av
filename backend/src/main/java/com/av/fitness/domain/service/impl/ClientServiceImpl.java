package com.av.fitness.domain.service.impl;

import com.av.fitness.domain.model.Client;
import com.av.fitness.domain.port.ClientRepository;
import com.av.fitness.domain.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public Client register(Client client, String rawPassword) {
        // Verificar unicidad de email
        if (clientRepository.findByEmail(client.getEmail()).isPresent()) {
            throw new IllegalArgumentException("El email ya está registrado: " + client.getEmail());
        }

        if (client.getId() == null || client.getId().isBlank()) {
            client.setId(UUID.randomUUID().toString());
        }
        client.setPasswordHash(passwordEncoder.encode(rawPassword));
        client.setStatus(client.getStatus() != null ? client.getStatus() : "active");
        client.setJoinDate(client.getJoinDate() != null ? client.getJoinDate() : LocalDate.now());

        return clientRepository.save(client);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Client> findByEmail(String email) {
        return clientRepository.findByEmail(email);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Client> findById(String id) {
        return clientRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Client> findAll() {
        return clientRepository.findAll();
    }

    @Override
    @Transactional
    public Client update(String id, Client updated) {
        Client existing = clientRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado: " + id));

        if (updated.getName() != null) existing.setName(updated.getName());
        if (updated.getEmail() != null) existing.setEmail(updated.getEmail());
        if (updated.getPhone() != null) existing.setPhone(updated.getPhone());
        if (updated.getGoal() != null) existing.setGoal(updated.getGoal());
        if (updated.getStatus() != null) existing.setStatus(updated.getStatus());
        if (updated.getAvatar() != null) existing.setAvatar(updated.getAvatar());

        return clientRepository.save(existing);
    }

    @Override
    @Transactional
    public void delete(String id) {
        clientRepository.deleteById(id);
    }
}
