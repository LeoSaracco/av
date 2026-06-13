package com.av.fitness.infrastructure.persistence.adapter;

import com.av.fitness.domain.model.Client;
import com.av.fitness.domain.port.ClientRepository;
import com.av.fitness.infrastructure.persistence.entity.ClientJpaEntity;
import com.av.fitness.infrastructure.persistence.repository.ClientJpaRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class ClientRepositoryAdapter implements ClientRepository {

    private final ClientJpaRepository jpaRepo;

    public ClientRepositoryAdapter(ClientJpaRepository jpaRepo) {
        this.jpaRepo = jpaRepo;
    }

    @Override
    public Optional<Client> findById(String id) {
        return jpaRepo.findById(id).map(this::toDomain);
    }

    @Override
    public Optional<Client> findByEmail(String email) {
        return jpaRepo.findByEmail(email).map(this::toDomain);
    }

    @Override
    public List<Client> findAll() {
        return jpaRepo.findAll().stream().map(this::toDomain).collect(Collectors.toList());
    }

    @Override
    public Client save(Client client) {
        ClientJpaEntity entity = toEntity(client);
        ClientJpaEntity saved = jpaRepo.save(entity);
        return toDomain(saved);
    }

    @Override
    public void deleteById(String id) {
        jpaRepo.deleteById(id);
    }

    private Client toDomain(ClientJpaEntity e) {
        return new Client(e.getId(), e.getName(), e.getEmail(), e.getPhone(), e.getGoal(),
                e.getStatus(), e.getPasswordHash(), e.getJoinDate(), e.getAvatar());
    }

    private ClientJpaEntity toEntity(Client d) {
        ClientJpaEntity e = new ClientJpaEntity();
        e.setId(d.getId());
        e.setName(d.getName());
        e.setEmail(d.getEmail());
        e.setPasswordHash(d.getPasswordHash());
        e.setPhone(d.getPhone());
        e.setGoal(d.getGoal());
        e.setStatus(d.getStatus());
        e.setJoinDate(d.getJoinDate());
        e.setAvatar(d.getAvatar());
        return e;
    }
}
