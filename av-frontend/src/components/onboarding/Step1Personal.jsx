/**
 * @file Step1Personal.jsx
 * @description Paso 1 del onboarding: recolección de datos personales
 *              del cliente (nombre, email, WhatsApp, edad, altura, peso, sexo).
 */
import React from 'react';
import { FormGroup, RadioGroup } from './FormPrimitives';

// ── Datos personales ───────────────────────────────────────────────────────────
const SEX_OPTIONS = [
  { value: 'Femenino', label: 'Femenino' },
  { value: 'Masculino', label: 'Masculino' },
  { value: 'Otro', label: 'Otro' },
];

/**
 * Formulario del paso 1 — Datos personales.
 * Recoge nombre, email, WhatsApp, edad, altura, peso y sexo.
 *
 * @param {Object} props
 * @param {Object} props.form - Estado del formulario con los valores actuales
 * @param {(field: string, value: string) => void} props.set - Función para actualizar un campo
 * @param {Object} props.errors - Objeto con mensajes de error por campo
 * @returns {JSX.Element} Formulario del paso 1
 */
export default function Step1Personal({ form, set, errors }) {
  return (
    <>
      <FormGroup label="Nombre y apellido *" htmlFor="step1_name" error={errors.step1_name} errorId="err-step1_name">
        <input id="step1_name" className="form-input" placeholder="Tu nombre completo"
          value={form.step1_name} onChange={e => set('step1_name', e.target.value)}
          aria-required="true" aria-invalid={!!errors.step1_name} aria-describedby={errors.step1_name ? 'err-step1_name' : undefined} />
      </FormGroup>

      <div className="grid-2">
        <FormGroup label="Correo Electrónico *" htmlFor="step1_email" error={errors.step1_email} errorId="err-step1_email">
          <input id="step1_email" className="form-input" type="email" placeholder="tu@email.com"
            value={form.step1_email} onChange={e => set('step1_email', e.target.value)}
            aria-required="true" aria-invalid={!!errors.step1_email} aria-describedby={errors.step1_email ? 'err-step1_email' : undefined} />
        </FormGroup>
        <FormGroup label="WhatsApp *" htmlFor="step1_whatsapp" error={errors.step1_whatsapp} errorId="err-step1_whatsapp">
          <input id="step1_whatsapp" className="form-input" placeholder="+54 11 1234-5678"
            value={form.step1_whatsapp} onChange={e => set('step1_whatsapp', e.target.value)}
            aria-required="true" aria-invalid={!!errors.step1_whatsapp} aria-describedby={errors.step1_whatsapp ? 'err-step1_whatsapp' : undefined} />
        </FormGroup>
      </div>

      <div className="grid-3">
        <FormGroup label="Edad *" htmlFor="step1_age" error={errors.step1_age} errorId="err-step1_age">
          <input id="step1_age" className="form-input" type="number" min="14" max="99" placeholder="Ej: 28"
            value={form.step1_age} onChange={e => set('step1_age', e.target.value)}
            aria-required="true" aria-invalid={!!errors.step1_age} aria-describedby={errors.step1_age ? 'err-step1_age' : undefined} />
        </FormGroup>
        <FormGroup label="Altura (cm) *" htmlFor="step1_height" error={errors.step1_height} errorId="err-step1_height">
          <input id="step1_height" className="form-input" type="number" min="100" max="250" placeholder="Ej: 170"
            value={form.step1_height} onChange={e => set('step1_height', e.target.value)}
            aria-required="true" aria-invalid={!!errors.step1_height} aria-describedby={errors.step1_height ? 'err-step1_height' : undefined} />
        </FormGroup>
        <FormGroup label="Peso (kg) *" htmlFor="step1_weight" error={errors.step1_weight} errorId="err-step1_weight">
          <input id="step1_weight" className="form-input" type="number" min="30" max="300" step="0.1" placeholder="Ej: 68.5"
            value={form.step1_weight} onChange={e => set('step1_weight', e.target.value)}
            aria-required="true" aria-invalid={!!errors.step1_weight} aria-describedby={errors.step1_weight ? 'err-step1_weight' : undefined} />
        </FormGroup>
      </div>

      <FormGroup label="Sexo *" error={errors.step1_sex} errorId="err-step1_sex">
        <RadioGroup layout="cols-3" name="Sexo" value={form.step1_sex} onChange={v => set('step1_sex', v)} options={SEX_OPTIONS} />
      </FormGroup>
    </>
  );
}
