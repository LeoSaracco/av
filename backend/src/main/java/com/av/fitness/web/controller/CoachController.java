package com.av.fitness.web.controller;

import com.av.fitness.application.usecase.AssignRoutineUseCase;
import com.av.fitness.application.usecase.RegisterClientUseCase;
import com.av.fitness.domain.model.*;
import com.av.fitness.domain.port.*;
import com.av.fitness.domain.service.RoutineService;
import com.av.fitness.domain.service.DietService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/coach")
public class CoachController {

    private final RoutineService routineService;
    private final DietService dietService;
    private final AssignmentRepository assignmentRepository;
    private final NoteRepository noteRepository;
    private final ClientRepository clientRepository;
    private final AssignRoutineUseCase assignRoutineUseCase;
    private final RegisterClientUseCase registerClientUseCase;

    public CoachController(RoutineService routineService,
                           DietService dietService,
                           AssignmentRepository assignmentRepository,
                           NoteRepository noteRepository,
                           ClientRepository clientRepository,
                           AssignRoutineUseCase assignRoutineUseCase,
                           RegisterClientUseCase registerClientUseCase) {
        this.routineService = routineService;
        this.dietService = dietService;
        this.assignmentRepository = assignmentRepository;
        this.noteRepository = noteRepository;
        this.clientRepository = clientRepository;
        this.assignRoutineUseCase = assignRoutineUseCase;
        this.registerClientUseCase = registerClientUseCase;
    }

    // ── Clientes (desde el coach) ─────────────────────────────────────────────
    @GetMapping("/clients")
    public ResponseEntity<List<Client>> listClients() {
        return ResponseEntity.ok(clientRepository.findAll());
    }

    @PostMapping("/clients")
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

    @PutMapping("/clients/{id}")
    public ResponseEntity<Client> updateClient(@PathVariable String id, @RequestBody Map<String, Object> body) {
        Client existing = clientRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado: " + id));

        if (body.containsKey("name")) existing.setName((String) body.get("name"));
        if (body.containsKey("email")) existing.setEmail((String) body.get("email"));
        if (body.containsKey("phone")) existing.setPhone((String) body.get("phone"));
        if (body.containsKey("goal")) existing.setGoal((String) body.get("goal"));
        if (body.containsKey("status")) existing.setStatus((String) body.get("status"));

        Client updated = clientRepository.save(existing);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/clients/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable String id) {
        clientRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/clients/{id}")
    public ResponseEntity<Client> getClient(@PathVariable String id) {
        return clientRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ── Templates de rutina ───────────────────────────────────────────────────
    @GetMapping("/templates")
    public ResponseEntity<List<RoutineTemplate>> listTemplates() {
        return ResponseEntity.ok(routineService.findAllTemplates());
    }

    @PostMapping("/templates")
    public ResponseEntity<RoutineTemplate> createTemplate(@RequestBody Map<String, Object> body) {
        RoutineTemplate template = new RoutineTemplate();
        template.setId(UUID.randomUUID().toString());
        template.setName((String) body.get("name"));
        template.setGoal((String) body.get("goal"));
        template.setDescription((String) body.get("description"));
        template.setCreatedAt(LocalDateTime.now().toString());

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> exList = (List<Map<String, Object>>) body.get("exercises");
        if (exList != null) {
            List<Exercise> exercises = exList.stream().map(m -> {
                Exercise ex = new Exercise();
                ex.setId((String) m.getOrDefault("id", UUID.randomUUID().toString()));
                ex.setName((String) m.get("name"));
                ex.setSets(m.get("sets") != null ? ((Number) m.get("sets")).intValue() : 3);
                ex.setReps(m.get("reps") != null ? ((Number) m.get("reps")).intValue() : 10);
                ex.setRest((String) m.get("rest"));
                ex.setNotes((String) m.get("notes"));
                ex.setVideoUrl((String) m.get("videoUrl"));
                return ex;
            }).toList();
            template.setExercises(exercises);
        }

        RoutineTemplate saved = routineService.saveTemplate(template);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/templates/{id}")
    public ResponseEntity<Void> deleteTemplate(@PathVariable String id) {
        routineService.deleteTemplate(id);
        return ResponseEntity.noContent().build();
    }

    // ── Rutinas ───────────────────────────────────────────────────────────────
    @GetMapping("/routines")
    public ResponseEntity<List<Routine>> listRoutines() {
        return ResponseEntity.ok(routineService.findAll());
    }

    @PostMapping("/routines")
    public ResponseEntity<Routine> createRoutine(@RequestBody Routine routine) {
        Routine saved = routineService.save(routine);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PostMapping("/routines/from-template")
    public ResponseEntity<Routine> createFromTemplate(@RequestBody Map<String, String> body) {
        String templateId = body.get("templateId");
        String name = body.get("name");
        String goal = body.get("goal");

        Routine routine = routineService.createFromTemplate(templateId, name, goal);
        return ResponseEntity.status(HttpStatus.CREATED).body(routine);
    }

    @DeleteMapping("/routines/{id}")
    public ResponseEntity<Void> deleteRoutine(@PathVariable String id) {
        routineService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ── Templates de dieta ────────────────────────────────────────────────────
    @GetMapping("/diet-templates")
    public ResponseEntity<List<DietTemplate>> listDietTemplates() {
        return ResponseEntity.ok(dietService.findAllTemplates());
    }

    @PostMapping("/diet-templates")
    public ResponseEntity<DietTemplate> createDietTemplate(@RequestBody Map<String, Object> body) {
        DietTemplate template = new DietTemplate();
        template.setId(UUID.randomUUID().toString());
        template.setName((String) body.get("name"));
        template.setGoal((String) body.get("goal"));
        template.setDescription((String) body.get("description"));
        template.setIndications((String) body.get("indications"));
        template.setCreatedAt(LocalDateTime.now().toString());

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> mealList = (List<Map<String, Object>>) body.get("meals");
        if (mealList != null) {
            List<Meal> meals = mealList.stream().map(m -> {
                Meal meal = new Meal();
                meal.setId((String) m.getOrDefault("id", UUID.randomUUID().toString()));
                meal.setName((String) m.get("name"));
                meal.setContent((String) m.get("content"));
                return meal;
            }).toList();
            template.setMeals(meals);
        }

        DietTemplate saved = dietService.saveTemplate(template);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/diet-templates/{id}")
    public ResponseEntity<Void> deleteDietTemplate(@PathVariable String id) {
        dietService.deleteTemplate(id);
        return ResponseEntity.noContent().build();
    }

    // ── Dietas ────────────────────────────────────────────────────────────────
    @GetMapping("/diets")
    public ResponseEntity<List<Diet>> listDiets() {
        return ResponseEntity.ok(dietService.findAll());
    }

    @PostMapping("/diets/from-template")
    public ResponseEntity<Diet> createDietFromTemplate(@RequestBody Map<String, String> body) {
        String templateId = body.get("templateId");
        String name = body.get("name");
        String goal = body.get("goal");

        Diet diet = dietService.createFromTemplate(templateId, name, goal);
        return ResponseEntity.status(HttpStatus.CREATED).body(diet);
    }

    @DeleteMapping("/diets/{id}")
    public ResponseEntity<Void> deleteDiet(@PathVariable String id) {
        dietService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ── Asignaciones ──────────────────────────────────────────────────────────
    @PostMapping("/assign")
    public ResponseEntity<Assignment> assignRoutine(@RequestBody Map<String, Object> body) {
        String clientId = (String) body.get("clientId");
        String routineId = (String) body.get("routineId");
        String dietId = (String) body.get("dietId");

        Assignment assignment = assignRoutineUseCase.execute(clientId, routineId, dietId);
        return ResponseEntity.status(HttpStatus.CREATED).body(assignment);
    }

    @GetMapping("/assignments")
    public ResponseEntity<List<Assignment>> listAssignments() {
        return ResponseEntity.ok(assignmentRepository.findAll());
    }

    // ── Notas ─────────────────────────────────────────────────────────────────
    @GetMapping("/notes/{clientId}")
    public ResponseEntity<List<Note>> listNotesByClient(@PathVariable String clientId) {
        return ResponseEntity.ok(noteRepository.findByClientId(clientId));
    }

    @GetMapping("/notes")
    public ResponseEntity<List<Note>> listAllNotes() {
        return ResponseEntity.ok(noteRepository.findAll());
    }

    @PostMapping("/notes")
    public ResponseEntity<Note> createNote(@RequestBody Map<String, Object> body) {
        Note note = new Note();
        note.setId(UUID.randomUUID().toString());
        note.setClientId((String) body.get("clientId"));
        note.setText((String) body.get("text"));
        note.setCreatedAt(LocalDateTime.now());
        note.setUpdatedAt(LocalDateTime.now());

        Note saved = noteRepository.save(note);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/notes/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable String id) {
        noteRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
    }
}
