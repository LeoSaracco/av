package com.av.fitness.service.impl;

import com.av.fitness.dto.auth.TokenResponse;
import com.av.fitness.dto.contract.*;
import com.av.fitness.model.*;
import com.av.fitness.repository.*;
import com.av.fitness.service.PlanContractService;
import com.av.fitness.utils.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Implements the plan contracting flow: start contract → mock payment → complete onboarding.
 * On completion, auto-assigns a default routine, diet, thread, and welcome note to the new client.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class PlanContractServiceImpl implements PlanContractService {

    private static final String CONTRACT_STARTED = "STARTED";
    private static final String PAYMENT_PENDING = "PAYMENT_PENDING";
    private static final String PAYMENT_APPROVED = "PAYMENT_APPROVED";
    private static final String PAYMENT_REJECTED = "PAYMENT_REJECTED";
    private static final String COMPLETED = "COMPLETED";

    private final PlanJpaRepository planJpaRepository;
    private final PlanContractJpaRepository planContractJpaRepository;
    private final PaymentJpaRepository paymentJpaRepository;
    private final AuditEventJpaRepository auditEventJpaRepository;
    private final ClientJpaRepository clientJpaRepository;
    private final UserJpaRepository userJpaRepository;
    private final OnboardingJpaRepository onboardingJpaRepository;
    private final RefreshTokenJpaRepository refreshTokenJpaRepository;
    private final RoutineTemplateJpaRepository routineTemplateJpaRepository;
    private final DietTemplateJpaRepository dietTemplateJpaRepository;
    private final RoutineJpaRepository routineJpaRepository;
    private final DietJpaRepository dietJpaRepository;
    private final AssignmentJpaRepository assignmentJpaRepository;
    private final DietAssignmentJpaRepository dietAssignmentJpaRepository;
    private final NutritionThreadJpaRepository nutritionThreadJpaRepository;
    private final NoteJpaRepository noteJpaRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    /**
     * Starts a new plan contract by creating a contract and associated mock payment.
     *
     * @param request the request containing the plan ID
     * @return the start response with contract and payment details
     * @throws RuntimeException if the plan ID is invalid or the plan is not found
     */
    @Override
    public StartPlanContractResponse start(StartPlanContractRequest request) {
        UUID planUuid = parseUuid(request.getPlanId(), "Plan invalido");
        PlanEntity plan = planJpaRepository.findById(planUuid)
                .orElseThrow(() -> new RuntimeException("Plan no encontrado"));

        LocalDateTime now = LocalDateTime.now();
        PlanContractEntity contract = new PlanContractEntity();
        contract.setId(UUID.randomUUID());
        contract.setPlanId(request.getPlanId());
        contract.setStatus(CONTRACT_STARTED);
        contract.setCreatedAt(now);
        contract.setUpdatedAt(now);
        planContractJpaRepository.save(contract);

        PaymentEntity payment = new PaymentEntity();
        payment.setId(UUID.randomUUID());
        payment.setContractId(contract.getId());
        payment.setPlanId(request.getPlanId());
        payment.setPreferenceId(UUID.randomUUID().toString());
        payment.setStatus("PENDING");
        payment.setAmount(plan.getPrice());
        payment.setCurrency(plan.getCurrency());
        payment.setProvider("MERCADOPAGO");
        payment.setProviderMode("MOCK");
        payment.setExternalReference(contract.getId().toString());
        payment.setInitPoint("mock://mercadopago/checkout/" + payment.getPreferenceId());
        payment.setRawProviderPayload("{}");
        payment.setCreatedAt(now);
        payment.setUpdatedAt(now);
        paymentJpaRepository.save(payment);

        contract.setPaymentId(payment.getId());
        contract.setStatus(PAYMENT_PENDING);
        contract.setUpdatedAt(now);
        planContractJpaRepository.save(contract);

        audit("CONTRACT_STARTED", "PLAN_CONTRACT", contract.getId(), null, null,
                "{\"planId\":\"" + request.getPlanId() + "\"}");
        audit("PAYMENT_MOCK_CREATED", "PAYMENT", payment.getId(), null, null,
                "{\"contractId\":\"" + contract.getId() + "\",\"preferenceId\":\""
                        + payment.getPreferenceId() + "\"}");

        return StartPlanContractResponse.builder()
                .contractId(contract.getId())
                .planId(contract.getPlanId())
                .paymentId(payment.getId())
                .preferenceId(payment.getPreferenceId())
                .initPoint(payment.getInitPoint())
                .status(contract.getStatus())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .build();
    }

    /**
     * Processes a mock payment for an existing contract, updating both payment and contract status.
     *
     * @param contractId the UUID of the contract
     * @param request    the mock payment request containing the preference ID and desired status
     * @return the mock payment response with updated payment and contract statuses
     * @throws RuntimeException if the contract or payment is not found, or the payment does not belong to the contract,
     *                          or if the mock status is invalid
     */
    @Override
    public MockPaymentResponse mockPayment(UUID contractId, MockPaymentRequest request) {
        PlanContractEntity contract = findContract(contractId);
        PaymentEntity payment = paymentJpaRepository.findByPreferenceId(request.getPreferenceId())
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));
        if (!contract.getId().equals(payment.getContractId())) {
            throw new RuntimeException("El pago no pertenece a la contratacion");
        }

        String normalized = normalizeMockStatus(request.getStatus());
        LocalDateTime now = LocalDateTime.now();
        payment.setStatus(normalized);
        payment.setRawProviderPayload("{\"mockStatus\":\"" + normalized + "\"}");
        payment.setUpdatedAt(now);
        paymentJpaRepository.save(payment);

        String contractStatus = "APPROVED".equals(normalized) ? PAYMENT_APPROVED : PAYMENT_REJECTED;
        contract.setStatus(contractStatus);
        contract.setUpdatedAt(now);
        planContractJpaRepository.save(contract);

        audit("APPROVED".equals(normalized) ? "PAYMENT_MOCK_APPROVED" : "PAYMENT_MOCK_REJECTED",
                "PAYMENT", payment.getId(), null, contract.getClientId(),
                "{\"contractId\":\"" + contract.getId() + "\",\"status\":\"" + normalized + "\"}");

        return MockPaymentResponse.builder()
                .contractId(contract.getId())
                .paymentId(payment.getId())
                .preferenceId(payment.getPreferenceId())
                .paymentStatus(payment.getStatus())
                .contractStatus(contract.getStatus())
                .build();
    }

    /**
     * Completes the onboarding process for a contract whose payment has been approved.
     * Creates a new client and user, assigns default routine, diet, nutrition thread,
     * and welcome note, and issues authentication tokens.
     *
     * @param contractId the UUID of the contract
     * @param request    the onboarding completion request containing client details
     * @return the completion response with contract status and authentication tokens
     * @throws RuntimeException if payment is not approved or the email is already registered
     */
    @Override
    public CompletePlanContractResponse completeOnboarding(UUID contractId, CompletePlanContractRequest request) {
        PlanContractEntity contract = findContract(contractId);
        if (!PAYMENT_APPROVED.equals(contract.getStatus())) {
            audit("CONTRACT_FAILED", "PLAN_CONTRACT", contract.getId(), null, null,
                    "{\"reason\":\"payment_not_approved\"}");
            throw new RuntimeException("El pago debe estar aprobado antes de completar el onboarding");
        }
        if (userJpaRepository.findByEmail(request.getEmail()).isPresent()
                || clientJpaRepository.findByEmail(request.getEmail()).isPresent()) {
            audit("CONTRACT_FAILED", "PLAN_CONTRACT", contract.getId(), null, null,
                    "{\"reason\":\"duplicate_email\"}");
            throw new RuntimeException("El email ya esta registrado");
        }

        LocalDateTime now = LocalDateTime.now();
        UUID clientId = UUID.randomUUID();
        ClientEntity client = new ClientEntity();
        client.setId(clientId);
        client.setName(request.getName());
        client.setEmail(request.getEmail());
        client.setPhone(request.getPhone());
        client.setGoal(request.getGoal());
        client.setStatus("ACTIVO");
        client.setJoinDate(LocalDate.now());
        client.setCreatedAt(now);
        client.setUpdatedAt(now);
        clientJpaRepository.save(client);

        UserEntity user = new UserEntity();
        user.setId(UUID.randomUUID());
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRoles("CLIENT");
        user.setClientId(clientId);
        user.setCreatedAt(now);
        userJpaRepository.save(user);

        assignDefaults(clientId, user.getName(), contract.getPlanId(), request.getGoal());

        OnboardingEntity onboarding = new OnboardingEntity();
        onboarding.setId(UUID.randomUUID());
        onboarding.setPlanId(contract.getPlanId());
        onboarding.setClientId(clientId);
        onboarding.setFormData(request.getFormData());
        onboarding.setSubmittedAt(now);
        onboardingJpaRepository.save(onboarding);

        PaymentEntity payment = paymentJpaRepository.findById(contract.getPaymentId())
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));
        payment.setClientId(clientId);
        payment.setUpdatedAt(now);
        paymentJpaRepository.save(payment);

        contract.setClientId(clientId);
        contract.setUserId(user.getId());
        contract.setOnboardingId(onboarding.getId());
        contract.setEmail(request.getEmail());
        contract.setStatus(COMPLETED);
        contract.setUpdatedAt(now);
        contract.setCompletedAt(now);
        planContractJpaRepository.save(contract);

        audit("ONBOARDING_SUBMITTED", "ONBOARDING", onboarding.getId(), user.getId(), clientId,
                "{\"contractId\":\"" + contract.getId() + "\"}");
        audit("USER_CREATED", "USER", user.getId(), user.getId(), clientId,
                "{\"contractId\":\"" + contract.getId() + "\"}");
        audit("CONTRACT_COMPLETED", "PLAN_CONTRACT", contract.getId(), user.getId(), clientId,
                "{\"paymentId\":\"" + payment.getId() + "\",\"onboardingId\":\"" + onboarding.getId() + "\"}");

        TokenResponse token = issueTokens(user, clientId);

        return CompletePlanContractResponse.builder()
                .contractId(contract.getId())
                .onboardingId(onboarding.getId())
                .contractStatus(contract.getStatus())
                .user(token)
                .build();
    }

    /**
     * Auto-assigns a default routine, diet (if a nutrition plan), nutrition thread,
     * and welcome note to the newly created client.
     *
     * @param clientId   the UUID of the new client
     * @param clientName the client's name
     * @param planId     the plan ID to check for nutrition inclusion
     * @param goal       the client's goal for template matching
     */
    private void assignDefaults(UUID clientId, String clientName, String planId, String goal) {
        boolean includeDiet = isNutritionPlan(planId);

        RoutineTemplateEntity routineTemplate = findRoutineTemplate(goal);
        RoutineEntity routine = createRoutineFromTemplate(clientName, routineTemplate);
        routineJpaRepository.save(routine);

        AssignmentEntity assignment = new AssignmentEntity();
        assignment.setId(UUID.randomUUID());
        assignment.setClientId(clientId);
        assignment.setRoutineId(routine.getId());
        assignment.setAssignedAt(LocalDate.now());
        assignment.setActive(true);
        assignment.setCreatedAt(LocalDateTime.now());
        assignmentJpaRepository.save(assignment);

        audit("DEFAULT_ROUTINE_ASSIGNED", "ASSIGNMENT", assignment.getId(), null, clientId,
                "{\"routineId\":\"" + routine.getId() + "\",\"template\":\"" + routineTemplate.getName() + "\"}");

        if (includeDiet) {
            DietTemplateEntity dietTemplate = findDietTemplate(goal);
            DietEntity diet = createDietFromTemplate(clientName, dietTemplate);
            dietJpaRepository.save(diet);

            DietAssignmentEntity dietAssignment = new DietAssignmentEntity();
            dietAssignment.setId(UUID.randomUUID());
            dietAssignment.setClientId(clientId);
            dietAssignment.setDietId(diet.getId());
            dietAssignment.setAssignedAt(LocalDate.now());
            dietAssignment.setActive(true);
            dietAssignment.setCreatedAt(LocalDateTime.now());
            dietAssignmentJpaRepository.save(dietAssignment);

            audit("DEFAULT_DIET_ASSIGNED", "DIET_ASSIGNMENT", dietAssignment.getId(), null, clientId,
                    "{\"dietId\":\"" + diet.getId() + "\",\"template\":\"" + dietTemplate.getName() + "\"}");
        }

        NutritionThreadEntity thread = new NutritionThreadEntity();
        thread.setId(UUID.randomUUID());
        thread.setClientId(clientId);
        thread.setMessages("[]");
        thread.setCreatedAt(LocalDateTime.now());
        thread.setUpdatedAt(LocalDateTime.now());
        nutritionThreadJpaRepository.save(thread);

        NoteEntity note = new NoteEntity();
        note.setId(UUID.randomUUID());
        note.setClientId(clientId);
        note.setText("Bienvenido! Ya te arme una rutina inicial basada en tus objetivos. Pronto la voy a personalizar.");
        note.setCreatedAt(LocalDate.now());
        note.setUpdatedAt(LocalDate.now());
        note.setUpdatedAtTz(LocalDateTime.now());
        noteJpaRepository.save(note);

        audit("WELCOME_NOTE_CREATED", "NOTE", note.getId(), null, clientId, "{}");
    }

    /**
     * Determines whether the given plan includes nutrition features.
     *
     * @param planId the plan ID
     * @return true if the plan includes a diet component
     */
    private boolean isNutritionPlan(String planId) {
        return "f2222222-2222-2222-2222-222222222222".equals(planId)
                || "f3333333-3333-3333-3333-333333333333".equals(planId);
    }

    /**
     * Checks whether the given goal string indicates a weight loss objective.
     *
     * @param goal the client's goal description
     * @return true if the goal matches weight loss keywords
     */
    private boolean isWeightLossGoal(String goal) {
        if (goal == null) return false;
        String g = goal.toLowerCase();
        return g.contains("bajar") || g.contains("perder") || g.contains("quemar")
                || g.contains("grasa") || g.contains("definir") || g.contains("adelgazar")
                || g.contains("definicion") || g.contains("peso");
    }

    /**
     * Checks whether the given goal string indicates a muscle gain objective.
     *
     * @param goal the client's goal description
     * @return true if the goal matches muscle gain keywords
     */
    private boolean isMuscleGainGoal(String goal) {
        if (goal == null) return false;
        String g = goal.toLowerCase();
        return g.contains("ganar") || g.contains("masa") || g.contains("muscular")
                || g.contains("volumen") || g.contains("hipertrofia") || g.contains("fuerza")
                || g.contains("aumentar");
    }

    /**
     * Finds the best-matching routine template based on the client's goal.
     *
     * @param goal the client's goal description
     * @return the matching routine template, or the first available template as fallback
     * @throws RuntimeException if no templates are available
     */
    private RoutineTemplateEntity findRoutineTemplate(String goal) {
        List<RoutineTemplateEntity> templates = routineTemplateJpaRepository.findAll();
        if (templates.isEmpty()) throw new RuntimeException("No hay plantillas de rutina disponibles");

        if (isWeightLossGoal(goal)) {
            return templates.stream()
                    .filter(t -> t.getName().toLowerCase().contains("cardio")
                            || t.getGoal().toLowerCase().contains("quemar"))
                    .findFirst()
                    .orElse(templates.get(0));
        }
        if (isMuscleGainGoal(goal)) {
            return templates.stream()
                    .filter(t -> t.getName().toLowerCase().contains("hipertrofia")
                            || t.getGoal().toLowerCase().contains("masa"))
                    .findFirst()
                    .orElse(templates.get(0));
        }
        return templates.get(0);
    }

    /**
     * Finds the best-matching diet template based on the client's goal.
     *
     * @param goal the client's goal description
     * @return the matching diet template, or the first available template as fallback
     * @throws RuntimeException if no templates are available
     */
    private DietTemplateEntity findDietTemplate(String goal) {
        List<DietTemplateEntity> templates = dietTemplateJpaRepository.findAll();
        if (templates.isEmpty()) throw new RuntimeException("No hay plantillas de dieta disponibles");

        if (isWeightLossGoal(goal)) {
            return templates.stream()
                    .filter(t -> t.getName().toLowerCase().contains("deficit")
                            || t.getGoal().toLowerCase().contains("perdida"))
                    .findFirst()
                    .orElse(templates.get(0));
        }
        if (isMuscleGainGoal(goal)) {
            return templates.stream()
                    .filter(t -> t.getName().toLowerCase().contains("volumen")
                            || t.getGoal().toLowerCase().contains("aumento"))
                    .findFirst()
                    .orElse(templates.get(0));
        }
        return templates.get(0);
    }

    /**
     * Creates a new routine instance from a given template, personalizing the name.
     *
     * @param clientName the client's name
     * @param template   the routine template to copy from
     * @return the newly created routine entity
     */
    private RoutineEntity createRoutineFromTemplate(String clientName, RoutineTemplateEntity template) {
        RoutineEntity routine = new RoutineEntity();
        routine.setId(UUID.randomUUID());
        routine.setName(template.getName() + " - " + clientName);
        routine.setGoal(template.getGoal());
        routine.setTemplateId(template.getId());
        routine.setExercises(template.getExercises());
        routine.setCreatedAt(LocalDate.now());
        routine.setUpdatedAt(LocalDateTime.now());
        return routine;
    }

    /**
     * Creates a new diet instance from a given template, personalizing the name.
     *
     * @param clientName the client's name
     * @param template   the diet template to copy from
     * @return the newly created diet entity
     */
    private DietEntity createDietFromTemplate(String clientName, DietTemplateEntity template) {
        DietEntity diet = new DietEntity();
        diet.setId(UUID.randomUUID());
        diet.setName(template.getName() + " - " + clientName);
        diet.setGoal(template.getGoal());
        diet.setTemplateId(template.getId());
        diet.setIndications(template.getIndications());
        diet.setMeals(template.getMeals());
        diet.setCreatedAt(LocalDate.now());
        diet.setUpdatedAt(LocalDateTime.now());
        return diet;
    }

    /**
     * Retrieves a plan contract by its ID.
     *
     * @param contractId the UUID of the contract
     * @return the contract entity
     * @throws RuntimeException if the contract is not found
     */
    private PlanContractEntity findContract(UUID contractId) {
        return planContractJpaRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contratacion no encontrada"));
    }

    /**
     * Issues access and refresh tokens for the newly created user.
     *
     * @param user     the user entity
     * @param clientId the UUID of the associated client
     * @return a token response containing both tokens and user info
     */
    private TokenResponse issueTokens(UserEntity user, UUID clientId) {
        String accessToken = jwtService.generateAccessToken(user.getId(), "CLIENT", clientId);
        String refreshToken = jwtService.generateRefreshToken();

        RefreshTokenEntity rt = new RefreshTokenEntity();
        rt.setUserId(user.getId());
        rt.setToken(refreshToken);
        rt.setExpiryDate(LocalDateTime.now().plusSeconds(jwtService.getRefreshTokenExpiration() / 1000));
        refreshTokenJpaRepository.save(rt);

        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .role("CLIENT")
                .id(user.getId())
                .clientId(clientId)
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }

    /**
     * Parses a string into a UUID, throwing a descriptive error on failure.
     *
     * @param value   the string to parse
     * @param message the error message if parsing fails
     * @return the parsed UUID
     * @throws RuntimeException if the string is not a valid UUID
     */
    private UUID parseUuid(String value, String message) {
        try {
            return UUID.fromString(value);
        } catch (IllegalArgumentException ex) {
            throw new RuntimeException(message);
        }
    }

    /**
     * Normalizes and validates the mock payment status.
     *
     * @param status the raw status string
     * @return the normalized status (APPROVED or REJECTED)
     * @throws RuntimeException if the status is not a valid mock status
     */
    private String normalizeMockStatus(String status) {
        String normalized = status.trim().toUpperCase();
        if ("APPROVED".equals(normalized) || "REJECTED".equals(normalized)) {
            return normalized;
        }
        throw new RuntimeException("Estado de pago mock invalido");
    }

    /**
     * Records an audit event for traceability.
     *
     * @param eventType     the type of event
     * @param aggregateType the domain aggregate type
     * @param aggregateId   the UUID of the aggregate
     * @param actorUserId   the UUID of the acting user (nullable)
     * @param clientId      the UUID of the client (nullable)
     * @param payload       JSON payload with event details
     */
    private void audit(String eventType, String aggregateType, UUID aggregateId,
                       UUID actorUserId, UUID clientId, String payload) {
        AuditEventEntity event = new AuditEventEntity();
        event.setId(UUID.randomUUID());
        event.setEventType(eventType);
        event.setAggregateType(aggregateType);
        event.setAggregateId(aggregateId);
        event.setActorUserId(actorUserId);
        event.setClientId(clientId);
        event.setPayload(payload);
        event.setCreatedAt(LocalDateTime.now());
        auditEventJpaRepository.save(event);
    }
}
