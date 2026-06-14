/**
 * @file Cuestionario de onboarding (6 pasos). Recolecta datos personales,
 *       hábitos, salud, motivación y registra al cliente en la plataforma.
 * @route /onboarding?plan={planId}
 * @auth Público — el formulario es previo al registro.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n';
import { SEED_PLANS } from '../data/seed';
import { StepIcon } from '../components/onboarding/StepIcons';
import StepsTrack from '../components/onboarding/StepsTrack';
import Step1Personal from '../components/onboarding/Step1Personal';
import Step2Habits from '../components/onboarding/Step2Habits';
import Step3Health from '../components/onboarding/Step3Health';
import Step4Profile from '../components/onboarding/Step4Profile';
import Step5Summary from '../components/onboarding/Step5Summary';
import Step5Account from '../components/onboarding/Step5Account';

// ── Constantes ─────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'av_onboarding_draft';

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

const TOTAL_STEPS = 6;
const DEMO_CODE = '123456';

// ── Persistencia local del borrador ────────────────────────────────────────────
function loadDraft() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch { return null; }
}
function saveDraft(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
function clearDraft() {
  localStorage.removeItem(STORAGE_KEY);
}

// ── Componente principal ───────────────────────────────────────────────────────
/**
 * Cuestionario de onboarding de 6 pasos. Cada paso recolecta información
 * específica del cliente (datos personales, hábitos, salud, perfil).
 * Incluye validación por paso, persistencia en localStorage y pantalla
 * de éxito final con redirección al dashboard del cliente.
 *
 * @returns {JSX.Element} Flujo completo de onboarding.
 */
export default function Onboarding() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { registerUser } = useAuth();
  const { createOnboardingSubmission, showToast } = useApp();
  const { t } = useI18n();

  const planId = searchParams.get('plan') || 'plan1';
  const plan = SEED_PLANS.find(p => p.id === planId) || SEED_PLANS[0];

  const [step, setStep] = useState(1);
  const [form, setForm] = useState(() => loadDraft() || { ...INITIAL_FORM });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Persistir borrador en cada cambio del formulario
  useEffect(() => { saveDraft(form); }, [form]);

  const setField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  // ── Lógica de validación por step ──────────────────────────────────────────
  const validateStep = useCallback((s) => {
    const e = {};
    const required = (field, msg) => {
      if (!form[field]?.toString().trim()) e[field] = msg || t('onboarding.validation.required');
    };

    if (s === 1) {
      required('step1_name', t('onboarding.validation.name'));
      if (!form.step1_email?.trim()) e.step1_email = t('onboarding.validation.email');
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.step1_email)) e.step1_email = t('onboarding.validation.emailInvalid');
      required('step1_whatsapp', t('onboarding.validation.whatsapp'));
      if (!/^[\d\s\-+()]+$/.test(form.step1_whatsapp || '')) e.step1_whatsapp = t('onboarding.validation.whatsappInvalid');
      required('step1_age', t('onboarding.validation.age'));
      const age = Number(form.step1_age);
      if (isNaN(age) || age < 14 || age > 99) e.step1_age = t('onboarding.validation.ageRange');
      required('step1_height', t('onboarding.validation.height'));
      const h = Number(form.step1_height);
      if (isNaN(h) || h < 100 || h > 250) e.step1_height = t('onboarding.validation.heightRange');
      required('step1_weight', t('onboarding.validation.weight'));
      const w = Number(form.step1_weight);
      if (isNaN(w) || w < 30 || w > 300) e.step1_weight = t('onboarding.validation.weightRange');
      required('step1_sex', t('onboarding.validation.sex'));
    }
    if (s === 2) {
      required('step2_activity', t('onboarding.validation.activity'));
      required('step2_steps', t('onboarding.validation.steps'));
      required('step2_sleep', t('onboarding.validation.sleep'));
    }
    if (s === 3) {
      required('step3_pathology', t('onboarding.validation.pathology'));
      if (form.step3_pathology === 'si') required('step3_pathology_desc', t('onboarding.validation.pathologyDesc'));
      required('step3_medical', t('onboarding.validation.medical'));
      required('step3_level', t('onboarding.validation.level'));
      if (planId === 'plan2') required('step3_commitment', t('onboarding.validation.commitment'));
      required('step3_frequency', t('onboarding.validation.frequency'));
    }
    if (s === 4) {
      required('step4_body', t('onboarding.validation.body'));
      required('step4_purpose', t('onboarding.validation.purpose'));
      required('step4_city', t('onboarding.validation.city'));
    }
    if (s === 6) {
      required('step5_password', t('onboarding.validation.password'));
      if (form.step5_password?.length < 6) e.step5_password = t('onboarding.validation.passwordMin');
      if (form.step5_password !== form.step5_confirm) e.step5_confirm = t('onboarding.validation.passwordMatch');
      required('step5_code', t('onboarding.validation.code'));
      if (form.step5_code !== DEMO_CODE) e.step5_code = t('onboarding.validation.codeInvalid').replace('{code}', DEMO_CODE);
      if (!form.step5_terms) e.step5_terms = t('onboarding.validation.terms');
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form, planId, t]);

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
  const handleSubmit = () => {
    if (!validateStep(6)) return;
    setSubmitting(true);

    const result = registerUser(form.step1_name, form.step1_email, form.step5_password);
    if (!result.ok) {
      setErrors({ step1_email: result.error });
      setStep(1);
      setSubmitting(false);
      return;
    }

    createOnboardingSubmission({
      planId,
      clientId: result.clientId,
      name: form.step1_name,
      email: form.step1_email,
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

    clearDraft();
    showToast(t('onboarding.success.title'));
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
  const meta = { title: t(`onboarding.steps.${step}.title`), sub: t(`onboarding.steps.${step}.sub`) };

  return (
    <div className="onboarding-page">
      <div className="onboarding-header">
        <h1>{t('onboarding.headerPrefix')} {plan.name}</h1>
        <p>{t('onboarding.headerSub')}</p>
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
            {step > 1 && <button className="btn btn-ghost" onClick={prevStep}>{t('onboarding.buttons.prev')}</button>}
          </div>
          <div className="step-footer-right">
            <span className="step-counter">{t('onboarding.stepCounter').replace('{step}', step).replace('{total}', TOTAL_STEPS)}</span>
            {step < TOTAL_STEPS ? (
              <button className="btn btn-primary" onClick={nextStep}>{step === 5 ? t('onboarding.buttons.summaryContinue') : t('onboarding.buttons.next')}</button>
            ) : (
              <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? t('onboarding.buttons.creating') : t('onboarding.buttons.createAccount')}
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
  const { t } = useI18n();
  return (
    <div className="onboarding-page">
      <div className="success-screen">
        <div className="success-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h2>{t('onboarding.success.title')}</h2>
        <p>{t('onboarding.success.message')}</p>
        <button className="btn btn-primary" onClick={onGoToDashboard}>
          {t('onboarding.success.cta')}
        </button>
      </div>
    </div>
  );
}
