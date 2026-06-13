package com.av.fitness.web.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/me")
public class MeController {

    @GetMapping("/routine")
    public ResponseEntity<Map<String, Object>> getRoutine() {
        // TODO: Return assigned routine for authenticated client
        return ResponseEntity.ok(Map.of());
    }

    @GetMapping("/diet")
    public ResponseEntity<Map<String, Object>> getDiet() {
        // TODO: Return assigned diet for authenticated client
        return ResponseEntity.ok(Map.of());
    }

    @GetMapping("/progress")
    public ResponseEntity<List<Map<String, Object>>> getProgress() {
        // TODO: Return weight history for authenticated client
        return ResponseEntity.ok(List.of());
    }

    @PostMapping("/progress")
    public ResponseEntity<Map<String, String>> logProgress(@RequestBody Map<String, Object> body) {
        // TODO: Log weight entry for authenticated client
        return ResponseEntity.ok(Map.of("message", "Progress logged - STUB"));
    }

    @DeleteMapping("/progress/{id}")
    public ResponseEntity<Void> deleteProgress(@PathVariable String id) {
        // TODO: Delete weight entry
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/notes")
    public ResponseEntity<List<Map<String, Object>>> getNotes() {
        // TODO: Return coach notes for authenticated client
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/thread")
    public ResponseEntity<Map<String, Object>> getThread() {
        // TODO: Return nutrition thread for authenticated client
        return ResponseEntity.ok(Map.of());
    }

    @PostMapping("/thread")
    public ResponseEntity<Map<String, String>> postMessage(@RequestBody Map<String, String> body) {
        // TODO: Post message to nutrition thread
        return ResponseEntity.ok(Map.of("message", "Message sent - STUB"));
    }
}
