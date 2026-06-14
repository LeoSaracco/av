package com.av.fitness.controller;

import com.av.fitness.dto.*;
import com.av.fitness.dto.client.ProgressRequest;
import com.av.fitness.dto.coach.*;
import com.av.fitness.service.ClientService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/me")
@PreAuthorize("hasRole('CLIENT')")
public class MeController {

    private final ClientService clientService;

    public MeController(ClientService clientService) {
        this.clientService = clientService;
    }

    /** Rutina asignada al cliente autenticado */
    @GetMapping("/routine")
    public ResponseEntity<RoutineResponse> getMyRoutine(Authentication auth) {
        return ResponseEntity.ok(clientService.getMyRoutine(auth.getName()));
    }

    /** Dieta asignada al cliente autenticado */
    @GetMapping("/diet")
    public ResponseEntity<DietResponse> getMyDiet(Authentication auth) {
        return ResponseEntity.ok(clientService.getMyDiet(auth.getName()));
    }

    /** Historial de progreso */
    @GetMapping("/progress")
    public ResponseEntity<List<ProgressResponse>> getMyProgress(Authentication auth) {
        return ResponseEntity.ok(clientService.getMyProgress(auth.getName()));
    }

    /** Registrar nueva entrada de progreso */
    @PostMapping("/progress")
    public ResponseEntity<ProgressResponse> logProgress(
            Authentication auth,
            @Valid @RequestBody ProgressRequest request) {
        return ResponseEntity.ok(clientService.logProgress(auth.getName(), request));
    }

    /** Eliminar entrada de progreso */
    @DeleteMapping("/progress/{id}")
    public ResponseEntity<Void> deleteProgress(@PathVariable String id) {
        clientService.deleteProgress(id);
        return ResponseEntity.noContent().build();
    }

    /** Notas del cliente */
    @GetMapping("/notes")
    public ResponseEntity<List<NoteResponse>> getMyNotes(Authentication auth) {
        return ResponseEntity.ok(clientService.getMyNotes(auth.getName()));
    }

    /** Hilo de nutrición / IA */
    @GetMapping("/thread")
    public ResponseEntity<ThreadResponse> getMyThread(Authentication auth) {
        return ResponseEntity.ok(clientService.getMyThread(auth.getName()));
    }

    /** Enviar mensaje al hilo */
    @PostMapping("/thread")
    public ResponseEntity<MessageResponse> sendMessage(
            Authentication auth,
            @Valid @RequestBody SendMessageRequest request) {
        return ResponseEntity.ok(clientService.sendMessage(auth.getName(), request.getText()));
    }
}
