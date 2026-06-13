/**
 * @file Step2Habits.jsx
 * @description Paso 2 del onboarding: evaluación de actividad física,
 *              hábitos diarios y horas de sueño del cliente.
 */
import React from 'react';
import { FormGroup, RadioGroup } from './FormPrimitives';

// ── Actividad y hábitos ────────────────────────────────────────────────────────
const ACTIVITY_OPTIONS = [
  { value: 'sedentaria', title: 'Sedentaria', desc: 'No realizás actividad física estructurada. Mayormente sentado.' },
  { value: 'poco_activa', title: 'Poco activa', desc: 'Actividad física de baja intensidad 1-2 veces por semana.' },
  { value: 'activa', title: 'Activa', desc: 'Trabajo de pie o actividad planificada 3-5 veces por semana.' },
  { value: 'muy_activa', title: 'Muy activa', desc: 'Trabajo físico intenso o entrenamiento 6-7 días por semana.' },
];

const STEPS_OPTIONS = [
  { value: 'menos_5000', label: 'Menos de 5.000' },
  { value: '5000_8000', label: 'Entre 5.000 y 8.000' },
  { value: 'mas_10000', label: 'Más de 10.000' },
];

const SLEEP_HOURS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

/**
 * Formulario del paso 2 — Actividad y hábitos.
 * Evalúa tipo de actividad, pasos diarios y horas de sueño.
 *
 * @param {Object} props
 * @param {Object} props.form - Estado del formulario con los valores actuales
 * @param {(field: string, value: string) => void} props.set - Función para actualizar un campo
 * @param {Object} props.errors - Objeto con mensajes de error por campo
 * @returns {JSX.Element} Formulario del paso 2
 */
export default function Step2Habits({ form, set, errors }) {
  return (
    <>
      <FormGroup label="Tipo de actividad / ocupación *" error={errors.step2_activity} errorId="err-step2_activity">
        <RadioGroup name="Tipo de actividad" value={form.step2_activity} onChange={v => set('step2_activity', v)} options={ACTIVITY_OPTIONS} />
      </FormGroup>

      <FormGroup label="¿Cuántos pasos diarios das? *" error={errors.step2_steps} errorId="err-step2_steps">
        <RadioGroup layout="cols-3" name="Pasos diarios" value={form.step2_steps} onChange={v => set('step2_steps', v)} options={STEPS_OPTIONS} />
      </FormGroup>

      <FormGroup label="Horas de sueño *" error={errors.step2_sleep} errorId="err-step2_sleep">
        <div className="toggle-group toggle-group--wrap" role="radiogroup" aria-label="Horas de sueño">
          {SLEEP_HOURS.map(h => (
            <button key={h} type="button" role="radio" aria-checked={form.step2_sleep === String(h)}
              className={`toggle-btn toggle-btn--compact${form.step2_sleep === String(h) ? ' active' : ''}`}
              onClick={() => set('step2_sleep', String(h))}>
              {h}h
            </button>
          ))}
        </div>
      </FormGroup>
    </>
  );
}
