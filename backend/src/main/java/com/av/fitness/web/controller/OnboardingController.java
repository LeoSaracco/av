package com.av.fitness.web.controller;

import com.av.fitness.application.usecase.RegisterClientUseCase;
import com.av.fitness.domain.model.Client;
import com.av.fitness.domain.port.ClientRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/onboarding")
public class OnboardingController {

    private final RegisterClientUseCase registerClientUseCase;
    private final ClientRepository clientRepository;

    public OnboardingController(RegisterClientUseCase registerClientUseCase,
                                ClientRepository clientRepository) {
        this.registerClientUseCase = registerClientUseCase;
        this.clientRepository = clientRepository;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> submit(@RequestBody Map<String, Object> formData) {
        // Extraer datos del formulario de onboarding
        String name = (String) formData.get("name");
        String email = (String) formData.get("email");
        String password = (String) formData.getOrDefault("password", "1234");
        String phone = (String) formData.get("phone");
        String goal = (String) formData.get("goal");
        String planId = (String) formData.get("planId");

        if (name == null || email == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Nombre y email son requeridos"));
        }

        Client client = new Client();
        client.setId(UUID.randomUUID().toString());
        client.setName(name);
        client.setEmail(email);
        client.setPhone(phone);
        client.setGoal(goal);
        client.setStatus("active");

        Client created = registerClientUseCase.execute(client, password);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Onboarding completado exitosamente",
                "clientId", created.getId(),
                "planId", planId != null ? planId : ""
        ));
    }
}
