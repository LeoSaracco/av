package com.av.fitness.domain.service;

import com.av.fitness.domain.model.Client;

import java.util.List;
import java.util.Optional;

public interface ClientService {

    Client register(Client client, String rawPassword);

    Optional<Client> findByEmail(String email);

    Optional<Client> findById(String id);

    List<Client> findAll();

    Client update(String id, Client updated);

    void delete(String id);
}
