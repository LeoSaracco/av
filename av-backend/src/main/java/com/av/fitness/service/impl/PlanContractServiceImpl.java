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
import java.util.UUID;

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
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

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

    private PlanContractEntity findContract(UUID contractId) {
        return planContractJpaRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contratacion no encontrada"));
    }

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

    private UUID parseUuid(String value, String message) {
        try {
            return UUID.fromString(value);
        } catch (IllegalArgumentException ex) {
            throw new RuntimeException(message);
        }
    }

    private String normalizeMockStatus(String status) {
        String normalized = status.trim().toUpperCase();
        if ("APPROVED".equals(normalized) || "REJECTED".equals(normalized)) {
            return normalized;
        }
        throw new RuntimeException("Estado de pago mock invalido");
    }

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
