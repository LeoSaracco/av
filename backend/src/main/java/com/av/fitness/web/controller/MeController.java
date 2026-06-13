package com.av.fitness.web.controller;

import com.av.fitness.application.usecase.LogProgressUseCase;
import com.av.fitness.domain.model.*;
import com.av.fitness.domain.port.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/me")
public class MeController {

    private final AssignmentRepository assignmentRepository;
    private final RoutineRepository routineRepository;
    private final DietRepository dietRepository;
    private final ProgressRepository progressRepository;
    private final NoteRepository noteRepository;
    private final ClientRepository clientRepository;
    private final LogProgressUseCase logProgressUseCase;

    public MeController(AssignmentRepository assignmentRepository,
                        RoutineRepository routineRepository,
                        DietRepository dietRepository,
                        ProgressRepository progressRepository,
                        NoteRepository noteRepository,
                        ClientRepository clientRepository,
                        LogProgressUseCase logProgressUseCase) {
        this.assignmentRepository = assignmentRepository;
        this.routineRepository = routineRepository;
        this.dietRepository = dietRepository;
        this.progressRepository = progressRepository;
        this.noteRepository = noteRepository;
        this.clientRepository = clientRepository;
        this.logProgressUseCase = logProgressUseCase;
    }

    @GetMapping("/routine")
    public ResponseEntity<?> getRoutine(Authentication auth) {
        String clientId = getClientId(auth);
        List<Assignment> assignments = assignmentRepository.findByClientId(clientId);
        return assignments.stream()
                .filter(Assignment::isActive)
                .findFirst()
                .filter(a -> a.getRoutineId() != null)
                .flatMap(a -> routineRepository.findById(a.getRoutineId()))
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.ok(Map.of("message", "No hay rutina asignada")));
    }

    @GetMapping("/diet")
    public ResponseEntity<?> getDiet(Authentication auth) {
        String clientId = getClientId(auth);
        List<Assignment> assignments = assignmentRepository.findByClientId(clientId);
        return assignments.stream()
                .filter(Assignment::isActive)
                .findFirst()
                .filter(a -> a.getDietId() != null)
                .flatMap(a -> dietRepository.findById(a.getDietId()))
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.ok(Map.of("message", "No hay dieta asignada")));
    }

    @GetMapping("/progress")
    public ResponseEntity<List<Progress>> getProgress(Authentication auth) {
        String clientId = getClientId(auth);
        List<Progress> progressList = progressRepository.findByClientId(clientId);
        return ResponseEntity.ok(progressList);
    }

    @PostMapping("/progress")
    public ResponseEntity<Progress> logProgress(@RequestBody Map<String, Object> body, Authentication auth) {
        String clientId = getClientId(auth);
        double weight = ((Number) body.get("weight")).doubleValue();
        String comment = (String) body.getOrDefault("comment", null);

        Progress progress = logProgressUseCase.execute(clientId, weight, comment);
        return ResponseEntity.ok(progress);
    }

    @DeleteMapping("/progress/{id}")
    public ResponseEntity<Void> deleteProgress(@PathVariable String id, Authentication auth) {
        progressRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/notes")
    public ResponseEntity<List<Note>> getNotes(Authentication auth) {
        String clientId = getClientId(auth);
        List<Note> notes = noteRepository.findByClientId(clientId);
        return ResponseEntity.ok(notes);
    }

    @GetMapping("/thread")
    public ResponseEntity<?> getThread(Authentication auth) {
        // Retorna mock: la funcionalidad de IA queda en frontend
        String clientId = getClientId(auth);
        return ResponseEntity.ok(Map.of(
                "threadId", "thread-" + clientId,
                "messages", List.of(),
                "message", "Hilo de nutrición (mock)"
        ));
    }

    @PostMapping("/thread")
    public ResponseEntity<Map<String, String>> postMessage(@RequestBody Map<String, String> body, Authentication auth) {
        // Mock: la IA se maneja en frontend
        return ResponseEntity.ok(Map.of("message", "Mensaje enviado (mock)"));
    }

    private String getClientId(Authentication auth) {
        String email = auth.getName();
        return clientRepository.findByEmail(email)
                .map(Client::getId)
                .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado para: " + email));
    }
}
