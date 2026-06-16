package com.av.fitness.controller;

import com.av.fitness.dto.coach.DietResponse;
import com.av.fitness.dto.coach.NoteResponse;
import com.av.fitness.dto.coach.RoutineResponse;
import com.av.fitness.dto.MessageResponse;
import com.av.fitness.dto.ProgressResponse;
import com.av.fitness.dto.ThreadResponse;
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

    @GetMapping("/routine")
    public ResponseEntity<RoutineResponse> getMyRoutine(Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(clientService.getMyRoutine(userId));
    }

    @GetMapping("/diet")
    public ResponseEntity<DietResponse> getMyDiet(Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(clientService.getMyDiet(userId));
    }

    @GetMapping("/progress")
    public ResponseEntity<List<ProgressResponse>> getMyProgress(Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(clientService.getMyProgress(userId));
    }

    @PostMapping("/progress")
    public ResponseEntity<ProgressResponse> logProgress(
            Authentication auth,
            @RequestBody ProgressResponse request) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(clientService.logProgress(userId, request));
    }

    @DeleteMapping("/progress/{id}")
    public ResponseEntity<Void> deleteProgress(@PathVariable UUID id) {
        clientService.deleteProgress(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/notes")
    public ResponseEntity<List<NoteResponse>> getMyNotes(Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(clientService.getMyNotes(userId));
    }

    @GetMapping("/thread")
    public ResponseEntity<ThreadResponse> getMyThread(Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(clientService.getMyThread(userId));
    }

    @PostMapping("/thread/message")
    public ResponseEntity<ThreadResponse> sendMessage(
            Authentication auth,
            @RequestBody Map<String, String> body) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(clientService.sendMessage(userId, body.get("message")));
    }
}
