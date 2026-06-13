package com.av.fitness.web.controller;

import com.av.fitness.application.usecase.RegisterClientUseCase;
import com.av.fitness.domain.model.Client;
import com.av.fitness.domain.port.ClientRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/clients")
public class ClientController {

    private final ClientRepository clientRepository;
    private final RegisterClientUseCase registerClientUseCase;

    public ClientController(ClientRepository clientRepository, RegisterClientUseCase registerClientUseCase) {
        this.clientRepository = clientRepository;
        this.registerClientUseCase = registerClientUseCase;
    }

    @GetMapping
    public ResponseEntity<List<Client>> listClients() {
        return ResponseEntity.ok(clientRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Client> createClient(@RequestBody Map<String, Object> body) {
        Client client = new Client();
        client.setName((String) body.get("name"));
        client.setEmail((String) body.get("email"));
        client.setPhone((String) body.get("phone"));
        client.setGoal((String) body.get("goal"));

        String password = (String) body.getOrDefault("password", "1234");
        Client created = registerClientUseCase.execute(client, password);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Client> getClient(@PathVariable String id) {
        return clientRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Client> updateClient(@PathVariable String id, @RequestBody Map<String, Object> body) {
        Client existing = clientRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado: " + id));

        if (body.containsKey("name")) existing.setName((String) body.get("name"));
        if (body.containsKey("email")) existing.setEmail((String) body.get("email"));
        if (body.containsKey("phone")) existing.setPhone((String) body.get("phone"));
        if (body.containsKey("goal")) existing.setGoal((String) body.get("goal"));
        if (body.containsKey("status")) existing.setStatus((String) body.get("status"));
        if (body.containsKey("avatar")) existing.setAvatar((String) body.get("avatar"));

        Client updated = clientRepository.save(existing);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable String id) {
        clientRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
    }
}
