/**
 * @file Cuestionario de onboarding (6 pasos). Recolecta datos personales,
 *       hábitos, salud, motivación y registra al cliente en la plataforma.
 * @route /onboarding?plan={planId}
 * @auth Público — el formulario es previo al registro.
 */
import React, { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { StepIcon } from '../components/onboarding/StepIcons';
import StepsTrack from '../components/onboarding/StepsTrack';
import Step1Personal from '../components/onboarding/Step1Personal';
import Step2Habits from '../components/onboarding/Step2Habits';
import Step3Health from '../components/onboarding/Step3Health';
import Step4Profile from '../components/onboarding/Step4Profile';
import Step5Summary from '../components/onboarding/Step5Summary';
import Step5Account from '../components/onboarding/Step5Account';
import { apiVerifyEmail } from '../api/apiClient';

// ── Constantes ─────────────────────────────────────────────────────────────────
const INITIAL_FORM = {
  step1_name: '', step1_email: '', step1_whatsapp: '', step1_age: '',
  step1_height: '', step1_weight: '', step1_sex: '',
  step2_activity: '', step2_steps: '', step2_sleep: '',
  step3_pathology: '', step3_pathology_desc: '', step3_medical: '',
  step3_level: '', step3_commitment: '', step3_frequency: '',
  step4_body: '', step4_purpose: '', step4_complexes: '',
  step4_injuries: '', step4_city: '', step4_community: '',
  step5_password: '', step5_confirm: '', step5_code: '', step5_terms: false,
};

const STEP_META = [
  { title: 'Datos personales', sub: 'Información básica para conocerte mejor' },
  { title: 'Actividad y hábitos', sub: 'Tu estilo de vida y rutina actual' },
  { title: 'Salud y aptitud física', sub: 'Estado de salud y nivel de entrenamiento' },
  { title: 'Perfil y motivación', sub: 'Contanos qué te motiva y cómo te sentís' },
  { title: 'Revisar datos', sub: 'Verificá que todo esté correcto antes de continuar' },
  { title: 'Creá tu cuenta', sub: 'Último paso: elegí tu contraseña' },
];

const TOTAL_STEPS = 6;
const DEMO_CODE = '123456';

// ── Persistencia local del borrador ────────────────────────────────────────────
// ── Componente principal ───────────────────────────────────────────────────────
/**
 * Cuestionario de onboarding de 6 pasos. Cada paso recolecta información
 * específica del cliente (datos personales, hábitos, salud, perfil).
 * Incluye validación por paso y pantalla
 * de éxito final con redirección al dashboard del cliente.
 *
 * @returns {JSX.Element} Flujo completo de onboarding.
 */
export default function Onboarding() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { completePlanContract } = useAuth();
  const { showToast, plans } = useApp();

  const planId = searchParams.get('plan') || '';
  const contractId = searchParams.get('contract') || '';
  const plan = plans.find(p => p.id === planId) || plans[0] || null;

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ ...INITIAL_FORM });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const setField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  // ── Lógica de validación por step ──────────────────────────────────────────
  const validateStep = useCallback((s) => {
    const e = {};
    const required = (field, msg) => {
      if (!form[field]?.toString().trim()) e[field] = msg || 'Este campo es obligatorio';
    };

    if (s === 1) {
      required('step1_name', 'Ingresá tu nombre y apellido');
      if (!form.step1_email?.trim()) e.step1_email = 'Ingresá tu email';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.step1_email)) e.step1_email = 'Email no válido';
      required('step1_whatsapp', 'Ingresá tu número de WhatsApp');
      if (!/^[\d\s\-+()]+$/.test(form.step1_whatsapp || '')) e.step1_whatsapp = 'Solo números, espacios y +';
      required('step1_age', 'Ingresá tu edad');
      const age = Number(form.step1_age);
      if (isNaN(age) || age < 14 || age > 99) e.step1_age = 'Edad entre 14 y 99';
      required('step1_height', 'Ingresá tu altura');
      const h = Number(form.step1_height);
      if (isNaN(h) || h < 100 || h > 250) e.step1_height = 'Altura entre 100 y 250 cm';
      required('step1_weight', 'Ingresá tu peso');
      const w = Number(form.step1_weight);
      if (isNaN(w) || w < 30 || w > 300) e.step1_weight = 'Peso entre 30 y 300 kg';
      required('step1_sex', 'Seleccioná tu sexo');
    }
    if (s === 2) {
      required('step2_activity', 'Seleccioná tu tipo de actividad');
      required('step2_steps', 'Seleccioná tus pasos diarios');
      required('step2_sleep', 'Seleccioná tus horas de sueño');
    }
    if (s === 3) {
      required('step3_pathology', 'Indicá si tenés patologías');
      if (form.step3_pathology === 'si') required('step3_pathology_desc', 'Describí la patología');
      required('step3_medical', 'Indicá si estás apto médico');
      required('step3_level', 'Seleccioná tu nivel físico');
      if (planId === 'plan2') required('step3_commitment', 'Indicá tu compromiso');
      required('step3_frequency', 'Seleccioná la frecuencia semanal');
    }
    if (s === 4) {
      required('step4_body', 'Contanos cómo te sentís con tu cuerpo');
      required('step4_purpose', 'Contanos tu propósito');
      required('step4_city', 'Indicá desde qué ciudad entrenás');
    }
    if (s === 6) {
      required('step5_password', 'Creá una contraseña');
      if (form.step5_password?.length < 6) e.step5_password = 'Mínimo 6 caracteres';
      if (form.step5_password !== form.step5_confirm) e.step5_confirm = 'Las contraseñas no coinciden';
      required('step5_code', 'Ingresá el código de verificación');
      if (form.step5_code !== DEMO_CODE) e.step5_code = `Código incorrecto (probá con ${DEMO_CODE})`;
      if (!form.step5_terms) e.step5_terms = 'Debés aceptar los términos';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form, planId]);

  // ── Navegación entre pasos ─────────────────────────────────────────────────
  const nextStep = () => {
    // El step 5 (summary) no requiere validación, es solo revisión
    if (step === 5 || validateStep(step)) {
      setStep(s => Math.min(s + 1, TOTAL_STEPS));
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setStep(s => Math.max(s - 1, 1));
    window.scrollTo(0, 0);
  };

  // ── Envío final: registra usuario + guarda cuestionario ────────────────────
  const handleSubmit = async () => {
    if (!validateStep(6)) return;
    setSubmitting(true);

    try {
      await apiVerifyEmail(form.step1_email, form.step5_code);
    } catch (err) {
      setErrors({ step5_code: err.message || 'No se pudo validar el email' });
      setSubmitting(false);
      return;
    }

    if (!contractId) {
      setErrors({ step5_terms: 'Falta la contratacion asociada al pago. Volve a elegir un plan.' });
      setSubmitting(false);
      return;
    }

    const result = await completePlanContract(contractId, {
      planId,
      name: form.step1_name,
      email: form.step1_email,
      password: form.step5_password,
      whatsapp: form.step1_whatsapp,
      age: Number(form.step1_age),
      height: Number(form.step1_height),
      weight: Number(form.step1_weight),
      sex: form.step1_sex,
      activity: form.step2_activity,
      steps: form.step2_steps,
      sleep: form.step2_sleep,
      pathology: form.step3_pathology,
      pathologyDesc: form.step3_pathology_desc,
      medicalClearance: form.step3_medical,
      fitnessLevel: form.step3_level,
      commitment: form.step3_commitment,
      frequency: form.step3_frequency,
      bodyImage: form.step4_body,
      purpose: form.step4_purpose,
      complexes: form.step4_complexes,
      injuries: form.step4_injuries,
      city: form.step4_city,
      community: form.step4_community,
    });
    if (!result.ok) {
      setErrors({ step5_terms: result.error });
      setSubmitting(false);
      return;
    }
    showToast('Cuenta creada correctamente');
    setDone(true);
    setSubmitting(false);
  };

  // ── Render del step actual ─────────────────────────────────────────────────
  const renderCurrentStep = () => {
    switch (step) {
      case 1: return <Step1Personal form={form} set={setField} errors={errors} />;
      case 2: return <Step2Habits form={form} set={setField} errors={errors} />;
      case 3: return <Step3Health form={form} set={setField} errors={errors} planId={planId} />;
      case 4: return <Step4Profile form={form} set={setField} errors={errors} />;
      case 5: return <Step5Summary form={form} onGoToStep={setStep} />;
      case 6: return <Step5Account form={form} set={setField} errors={errors} email={form.step1_email} />;
      default: return null;
    }
  };

  // ── Pantalla final de éxito ────────────────────────────────────────────────
  if (done) return <OnboardingSuccess onGoToDashboard={() => navigate('/client')} />;

  // ── Vista principal ────────────────────────────────────────────────────────
  const meta = STEP_META[step - 1];

  if (!plan) {
    return (
      <div className="onboarding-page">
        <div className="onboarding-header">
          <h1>Cuestionario</h1>
          <p>No hay planes disponibles para iniciar el onboarding.</p>
        </div>
      </div>
    );
  }

  if (!contractId) {
    return (
      <div className="onboarding-page">
        <div className="onboarding-header">
          <h1>Contratacion requerida</h1>
          <p>Para completar el formulario primero tenes que elegir un plan y registrar el pago mock.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Volver a planes</button>
        </div>
      </div>
    );
  }

  return (
    <div className="onboarding-page">
      <div className="onboarding-header">
        <h1>Cuestionario {plan.name}</h1>
        <p>Completá tus datos para que Adrián pueda armar tu plan a medida</p>
      </div>

      <StepsTrack currentStep={step} totalSteps={TOTAL_STEPS} />

      <div className="step-container">
        <div className="step-body">
          {/* Encabezado del paso actual */}
          <div className="step-title">
            <div className="step-title-icon"><StepIcon name={['user', 'activity', 'health', 'mind', 'eye', 'lock'][step - 1]} /></div>
            <div>
              <div className="step-title-text">{meta.title}</div>
              <div className="step-title-sub">{meta.sub}</div>
            </div>
          </div>

          {/* Contenido dinámico del paso */}
          {renderCurrentStep()}
        </div>

        {/* Navegación inferior */}
        <div className="step-footer">
          <div>
            {step > 1 && <button className="btn btn-ghost" onClick={prevStep}>← Anterior</button>}
          </div>
          <div className="step-footer-right">
            <span className="step-counter">Paso {step} de {TOTAL_STEPS}</span>
            {step < TOTAL_STEPS ? (
              <button className="btn btn-primary" onClick={nextStep}>{step === 5 ? 'Todo OK, continuar →' : 'Siguiente →'}</button>
            ) : (
              <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Creando cuenta...' : 'Crear cuenta ✓'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Pantalla de éxito post-registro ────────────────────────────────────────────
/**
 * Pantalla de confirmación tras completar el registro exitosamente.
 *
 * @param {object}   props
 * @param {Function} props.onGoToDashboard - Callback para redirigir al dashboard.
 * @returns {JSX.Element} Vista de éxito con check animado y botón de acceso.
 */
function OnboardingSuccess({ onGoToDashboard }) {
  return (
    <div className="onboarding-page">
      <div className="success-screen">
        <div className="success-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h2>Todo listo</h2>
        <p>Tu cuenta fue creada y tus datos quedaron registrados. Adrián va a revisar tu cuestionario y preparar tu plan a medida.</p>
        <button className="btn btn-primary" onClick={onGoToDashboard}>
          Ir a mi dashboard →
        </button>
      </div>
    </div>
  );
}
