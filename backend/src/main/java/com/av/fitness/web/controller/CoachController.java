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
@RequestMapping("/api")
public class CoachController {

    @GetMapping("/templates")
    public ResponseEntity<List<Map<String, Object>>> listTemplates() {
        // TODO: Return all routine templates
        return ResponseEntity.ok(List.of());
    }

    @PostMapping("/templates")
    public ResponseEntity<Map<String, String>> createTemplate(@RequestBody Map<String, Object> body) {
        // TODO: Create routine template
        return ResponseEntity.ok(Map.of("message", "Template created - STUB"));
    }

    @DeleteMapping("/templates/{id}")
    public ResponseEntity<Void> deleteTemplate(@PathVariable String id) {
        // TODO: Delete routine template
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/routines")
    public ResponseEntity<List<Map<String, Object>>> listRoutines() {
        // TODO: Return all routines
        return ResponseEntity.ok(List.of());
    }

    @PostMapping("/routines")
    public ResponseEntity<Map<String, String>> createRoutine(@RequestBody Map<String, Object> body) {
        // TODO: Create routine
        return ResponseEntity.ok(Map.of("message", "Routine created - STUB"));
    }

    @PostMapping("/routines/from-template")
    public ResponseEntity<Map<String, String>> createFromTemplate(@RequestBody Map<String, String> body) {
        // TODO: Create routine from template ID
        return ResponseEntity.ok(Map.of("message", "Routine from template created - STUB"));
    }

    @GetMapping("/diet-templates")
    public ResponseEntity<List<Map<String, Object>>> listDietTemplates() {
        // TODO: Return all diet templates
        return ResponseEntity.ok(List.of());
    }

    @PostMapping("/diet-templates")
    public ResponseEntity<Map<String, String>> createDietTemplate(@RequestBody Map<String, Object> body) {
        // TODO: Create diet template
        return ResponseEntity.ok(Map.of("message", "Diet template created - STUB"));
    }

    @PostMapping("/diets/from-template")
    public ResponseEntity<Map<String, String>> createDietFromTemplate(@RequestBody Map<String, String> body) {
        // TODO: Create diet from template ID
        return ResponseEntity.ok(Map.of("message", "Diet from template created - STUB"));
    }

    @PostMapping("/assignments")
    public ResponseEntity<Map<String, String>> createAssignment(@RequestBody Map<String, Object> body) {
        // TODO: Assign routine/diet to client
        return ResponseEntity.ok(Map.of("message", "Assignment created - STUB"));
    }

    @GetMapping("/notes")
    public ResponseEntity<List<Map<String, Object>>> listNotes() {
        // TODO: Return all notes
        return ResponseEntity.ok(List.of());
    }

    @PostMapping("/notes")
    public ResponseEntity<Map<String, String>> createNote(@RequestBody Map<String, Object> body) {
        // TODO: Create note for client
        return ResponseEntity.ok(Map.of("message", "Note created - STUB"));
    }
}
