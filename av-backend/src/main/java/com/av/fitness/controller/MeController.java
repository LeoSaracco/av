package com.av.fitness.controller;

import com.av.fitness.dto.coach.DietResponse;
import com.av.fitness.dto.coach.NoteResponse;
import com.av.fitness.dto.coach.RoutineResponse;
import com.av.fitness.dto.ProgressResponse;
import com.av.fitness.dto.ThreadResponse;
import com.av.fitness.model.UserEntity;
import com.av.fitness.repository.UserJpaRepository;
import com.av.fitness.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/me")
@RequiredArgsConstructor
public class MeController {

    private final ClientService clientService;
    private final UserJpaRepository userJpaRepository;

    @GetMapping("/routine")
    public ResponseEntity<RoutineResponse> getMyRoutine(Authentication auth) {
        UUID clientId = resolveClientId(auth);
        return ResponseEntity.ok(clientService.getMyRoutine(clientId));
    }

    @GetMapping("/diet")
    public ResponseEntity<DietResponse> getMyDiet(Authentication auth) {
        UUID clientId = resolveClientId(auth);
        return ResponseEntity.ok(clientService.getMyDiet(clientId));
    }

    @GetMapping("/progress")
    public ResponseEntity<List<ProgressResponse>> getMyProgress(Authentication auth) {
        UUID clientId = resolveClientId(auth);
        return ResponseEntity.ok(clientService.getMyProgress(clientId));
    }

    @PostMapping("/progress")
    public ResponseEntity<ProgressResponse> logProgress(
            Authentication auth,
            @RequestBody ProgressResponse request) {
        UUID clientId = resolveClientId(auth);
        return ResponseEntity.ok(clientService.logProgress(clientId, request));
    }

    @DeleteMapping("/progress/{id}")
    public ResponseEntity<Void> deleteProgress(@PathVariable UUID id) {
        clientService.deleteProgress(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/progress/{id}")
    public ResponseEntity<ProgressResponse> updateProgress(
            @PathVariable UUID id,
            @RequestBody ProgressResponse request) {
        return ResponseEntity.ok(clientService.updateProgress(id, request));
    }

    @GetMapping("/notes")
    public ResponseEntity<List<NoteResponse>> getMyNotes(Authentication auth) {
        UUID clientId = resolveClientId(auth);
        return ResponseEntity.ok(clientService.getMyNotes(clientId));
    }

    @GetMapping("/thread")
    public ResponseEntity<ThreadResponse> getMyThread(Authentication auth) {
        UUID clientId = resolveClientId(auth);
        return ResponseEntity.ok(clientService.getMyThread(clientId));
    }

    @PostMapping("/thread/message")
    public ResponseEntity<ThreadResponse> sendMessage(
            Authentication auth,
            @RequestBody Map<String, String> body) {
        UUID clientId = resolveClientId(auth);
        return ResponseEntity.ok(clientService.sendMessage(clientId, body.get("message")));
    }

    private UUID resolveClientId(Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        UserEntity user = userJpaRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        if (user.getClientId() == null) {
            throw new RuntimeException("El usuario no tiene un cliente asociado");
        }
        return user.getClientId();
    }
}
