package com.av.fitness.domain.service.impl;

import com.av.fitness.domain.model.Coach;
import com.av.fitness.domain.port.CoachRepository;
import com.av.fitness.domain.service.CoachService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CoachServiceImpl implements CoachService {

    private final CoachRepository coachRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public Coach register(Coach coach, String rawPassword) {
        if (coachRepository.findByEmail(coach.getEmail()).isPresent()) {
            throw new IllegalArgumentException("El email ya está registrado: " + coach.getEmail());
        }

        if (coach.getId() == null || coach.getId().isBlank()) {
            coach.setId(UUID.randomUUID().toString());
        }
        coach.setPasswordHash(passwordEncoder.encode(rawPassword));
        return coachRepository.save(coach);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Coach> findByEmail(String email) {
        return coachRepository.findByEmail(email);
    }
}
