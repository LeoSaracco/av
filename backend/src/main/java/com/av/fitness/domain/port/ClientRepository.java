package com.av.fitness.domain.port;

import com.av.fitness.domain.model.Client;

import java.util.List;
import java.util.Optional;

public interface ClientRepository {

    Optional<Client> findById(String id);

    Optional<Client> findByEmail(String email);

    List<Client> findAll();

    Client save(Client client);

    void deleteById(String id);
}
