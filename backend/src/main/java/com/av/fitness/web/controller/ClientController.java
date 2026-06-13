package com.av.fitness.web.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> listClients() {
        // TODO: Return all clients (coach scope)
        return ResponseEntity.ok(List.of());
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> createClient(@RequestBody Map<String, Object> body) {
        // TODO: Create new client
        return ResponseEntity.ok(Map.of("message", "Client created - STUB"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getClient(@PathVariable String id) {
        // TODO: Return client by ID
        return ResponseEntity.ok(Map.of());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, String>> updateClient(@PathVariable String id, @RequestBody Map<String, Object> body) {
        // TODO: Update client
        return ResponseEntity.ok(Map.of("message", "Client updated - STUB"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable String id) {
        // TODO: Delete client
        return ResponseEntity.noContent().build();
    }
}
