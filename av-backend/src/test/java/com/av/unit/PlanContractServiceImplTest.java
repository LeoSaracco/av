package com.av.unit;

import com.av.fitness.dto.contract.CompletePlanContractRequest;
import com.av.fitness.dto.contract.StartPlanContractRequest;
import com.av.fitness.dto.contract.StartPlanContractResponse;
import com.av.fitness.model.PaymentEntity;
import com.av.fitness.model.PlanContractEntity;
import com.av.fitness.model.PlanEntity;
import com.av.fitness.model.NutritionThreadEntity;
import com.av.fitness.model.RoutineTemplateEntity;
import com.av.fitness.repository.*;
import com.av.fitness.service.impl.PlanContractServiceImpl;
import com.av.fitness.utils.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PlanContractServiceImplTest {

    @Mock private PlanJpaRepository planJpaRepository;
    @Mock private PlanContractJpaRepository planContractJpaRepository;
    @Mock private PaymentJpaRepository paymentJpaRepository;
    @Mock private AuditEventJpaRepository auditEventJpaRepository;
    @Mock private ClientJpaRepository clientJpaRepository;
    @Mock private UserJpaRepository userJpaRepository;
    @Mock private OnboardingJpaRepository onboardingJpaRepository;
    @Mock private RefreshTokenJpaRepository refreshTokenJpaRepository;
    @Mock private RoutineTemplateJpaRepository routineTemplateJpaRepository;
    @Mock private DietTemplateJpaRepository dietTemplateJpaRepository;
    @Mock private RoutineJpaRepository routineJpaRepository;
    @Mock private DietJpaRepository dietJpaRepository;
    @Mock private AssignmentJpaRepository assignmentJpaRepository;
    @Mock private DietAssignmentJpaRepository dietAssignmentJpaRepository;
    @Mock private NutritionThreadJpaRepository nutritionThreadJpaRepository;
    @Mock private NoteJpaRepository noteJpaRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwtService;

    @InjectMocks
    private PlanContractServiceImpl service;

    @Test
    void startCreatesContractAndPendingMockPayment() {
        UUID planId = UUID.randomUUID();
        PlanEntity plan = new PlanEntity();
        plan.setId(planId);
        plan.setName("Plan");
        plan.setPrice(new BigDecimal("9900.00"));
        plan.setCurrency("ARS");
        plan.setFeatures("[]");
        plan.setFeatured(false);
        plan.setCreatedAt(LocalDateTime.now());
        when(planJpaRepository.findById(planId)).thenReturn(Optional.of(plan));

        StartPlanContractRequest request = new StartPlanContractRequest();
        request.setPlanId(planId.toString());

        StartPlanContractResponse response = service.start(request);

        ArgumentCaptor<PaymentEntity> paymentCaptor = ArgumentCaptor.forClass(PaymentEntity.class);
        verify(paymentJpaRepository).save(paymentCaptor.capture());
        PaymentEntity payment = paymentCaptor.getValue();

        assertThat(response.getContractId()).isNotNull();
        assertThat(response.getPreferenceId()).isEqualTo(payment.getPreferenceId());
        assertThat(response.getStatus()).isEqualTo("PAYMENT_PENDING");
        assertThat(payment.getClientId()).isNull();
        assertThat(payment.getAmount()).isEqualByComparingTo("9900.00");
        assertThat(payment.getProviderMode()).isEqualTo("MOCK");
        verify(auditEventJpaRepository, times(2)).save(any());
    }

    @Test
    void completeOnboardingRequiresApprovedPayment() {
        UUID contractId = UUID.randomUUID();
        PlanContractEntity contract = new PlanContractEntity();
        contract.setId(contractId);
        contract.setPlanId(UUID.randomUUID().toString());
        contract.setStatus("PAYMENT_PENDING");
        contract.setCreatedAt(LocalDateTime.now());
        contract.setUpdatedAt(LocalDateTime.now());
        when(planContractJpaRepository.findById(contractId)).thenReturn(Optional.of(contract));

        CompletePlanContractRequest request = new CompletePlanContractRequest();
        request.setName("Juan Perez");
        request.setEmail("juan@test.com");
        request.setPassword("abc123");
        request.setFormData("{}");

        assertThatThrownBy(() -> service.completeOnboarding(contractId, request))
                .hasMessageContaining("pago debe estar aprobado");

        verify(userJpaRepository, never()).save(any());
        verify(clientJpaRepository, never()).save(any());
        verify(onboardingJpaRepository, never()).save(any());
        verify(auditEventJpaRepository).save(any());
    }

    @Test
    void completeOnboardingCreatesDefaultCoachChatMessage() {
        UUID contractId = UUID.randomUUID();
        UUID paymentId = UUID.randomUUID();
        String planId = "f1111111-1111-1111-1111-111111111111";

        PlanContractEntity contract = new PlanContractEntity();
        contract.setId(contractId);
        contract.setPlanId(planId);
        contract.setPaymentId(paymentId);
        contract.setStatus("PAYMENT_APPROVED");
        contract.setCreatedAt(LocalDateTime.now());
        contract.setUpdatedAt(LocalDateTime.now());
        when(planContractJpaRepository.findById(contractId)).thenReturn(Optional.of(contract));
        when(userJpaRepository.findByEmail("ana@test.com")).thenReturn(Optional.empty());
        when(clientJpaRepository.findByEmail("ana@test.com")).thenReturn(Optional.empty());

        RoutineTemplateEntity routineTemplate = new RoutineTemplateEntity();
        routineTemplate.setId(UUID.randomUUID());
        routineTemplate.setName("Rutina base");
        routineTemplate.setGoal("Entrenamiento general");
        routineTemplate.setExercises("[]");
        routineTemplate.setCreatedAt(LocalDate.now());
        routineTemplate.setUpdatedAt(LocalDateTime.now());
        when(routineTemplateJpaRepository.findAll()).thenReturn(List.of(routineTemplate));

        PaymentEntity payment = new PaymentEntity();
        payment.setId(paymentId);
        payment.setContractId(contractId);
        payment.setPlanId(planId);
        payment.setPreferenceId("pref-1");
        payment.setStatus("APPROVED");
        payment.setAmount(new BigDecimal("9900.00"));
        payment.setCurrency("ARS");
        payment.setProvider("MERCADOPAGO");
        payment.setProviderMode("MOCK");
        payment.setRawProviderPayload("{}");
        payment.setCreatedAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());
        when(paymentJpaRepository.findById(paymentId)).thenReturn(Optional.of(payment));

        when(passwordEncoder.encode("abc123")).thenReturn("hash");
        when(jwtService.generateAccessToken(any(), eq("CLIENT"), any())).thenReturn("access");
        when(jwtService.generateRefreshToken()).thenReturn("refresh");
        when(jwtService.getRefreshTokenExpiration()).thenReturn(86_400_000L);

        CompletePlanContractRequest request = new CompletePlanContractRequest();
        request.setName("Ana Perez");
        request.setEmail("ana@test.com");
        request.setPhone("123");
        request.setPassword("abc123");
        request.setGoal("Entrenamiento general");
        request.setFormData("{}");

        service.completeOnboarding(contractId, request);

        ArgumentCaptor<NutritionThreadEntity> threadCaptor = ArgumentCaptor.forClass(NutritionThreadEntity.class);
        verify(nutritionThreadJpaRepository).save(threadCaptor.capture());

        String messages = threadCaptor.getValue().getMessages();
        assertThat(messages).contains("\"sender\":\"COACH\"");
        assertThat(messages).contains("Hola Ana Perez, en breve nos estaremos comunicando con vos "
                + "para presentarnos y hablar acerca del plan. Saludos");
    }
}
