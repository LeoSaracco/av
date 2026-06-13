/**
 * @file Step3Health.jsx
 * @description Paso 3 del onboarding: evaluación de salud y aptitud física,
 *              incluyendo patologías, apto médico, nivel físico,
 *              compromiso 90/90 y frecuencia de entrenamiento.
 */
import React from 'react';
import { FormGroup, RadioGroup, ToggleGroup } from './FormPrimitives';

// ── Salud y aptitud física ─────────────────────────────────────────────────────
const TOGGLE_SI_NO = [
  { value: 'si', label: 'Sí' },
  { value: 'no', label: 'No' },
];

const TOGGLE_SI_NO_COMMITMENT = [
  { value: 'si', label: 'Sí, me comprometo' },
  { value: 'no', label: 'No' },
];

const LEVEL_OPTIONS = [
  { value: 'principiante', title: 'Principiante', desc: 'Hace más de un año que no entreno seguido. Necesito empezar de cero.' },
  { value: 'intermedio', title: 'Intermedio', desc: 'Tengo base pero necesito método. Entreno pero no veo los resultados que quiero.' },
  { value: 'avanzado', title: 'Avanzado', desc: 'Entreno firme pero toqué un techo. Busco sobrecarga progresiva y siguientes niveles.' },
];

const FREQ_OPTIONS = [2, 3, 4, 5];

/**
 * Formulario del paso 3 — Salud y aptitud física.
 * Incluye campos condicionales: descripción de patología (si responde Sí)
 * y compromiso 90/90 (solo para Plan 2).
 *
 * @param {Object} props
 * @param {Object} props.form - Estado del formulario con los valores actuales
 * @param {(field: string, value: string) => void} props.set - Función para actualizar un campo
 * @param {Object} props.errors - Objeto con mensajes de error por campo
 * @param {string} props.planId - ID del plan seleccionado (plan1 o plan2)
 * @returns {JSX.Element} Formulario del paso 3
 */
export default function Step3Health({ form, set, errors, planId }) {
  const showPathologyDesc = form.step3_pathology === 'si';

  return (
    <>
      <FormGroup label="¿Presentás alguna patología preexistente? *" error={errors.step3_pathology} errorId="err-step3_pathology">
        <ToggleGroup name="Patología preexistente" value={form.step3_pathology} onChange={v => set('step3_pathology', v)} options={TOGGLE_SI_NO} />
      </FormGroup>

      {/* Campo condicional: solo visible si respondió SI */}
      {showPathologyDesc && (
        <FormGroup label="Describí la patología *" htmlFor="step3_pathology_desc" error={errors.step3_pathology_desc} errorId="err-step3_pathology_desc">
          <textarea id="step3_pathology_desc" className="form-input" rows={3}
            placeholder="Describí tu condición..."
            value={form.step3_pathology_desc} onChange={e => set('step3_pathology_desc', e.target.value)}
            aria-required="true" aria-invalid={!!errors.step3_pathology_desc}
            aria-describedby={errors.step3_pathology_desc ? 'err-step3_pathology_desc' : undefined} />
        </FormGroup>
      )}

      <FormGroup label="¿Estás apto/a médico? *" error={errors.step3_medical} errorId="err-step3_medical">
        <ToggleGroup name="Apto médico" value={form.step3_medical} onChange={v => set('step3_medical', v)} options={TOGGLE_SI_NO} />
      </FormGroup>

      <FormGroup label="Nivel de aptitud física *" error={errors.step3_level} errorId="err-step3_level">
        <RadioGroup name="Nivel físico" value={form.step3_level} onChange={v => set('step3_level', v)} options={LEVEL_OPTIONS} />
      </FormGroup>

      {/* Solo visible para Plan 2 (Método 90/90) */}
      {planId === 'plan2' && (
        <FormGroup label="¿Asumís el compromiso mínimo de 90 días y 90 min? *" error={errors.step3_commitment} errorId="err-step3_commitment">
          <ToggleGroup name="Compromiso 90/90" value={form.step3_commitment} onChange={v => set('step3_commitment', v)} options={TOGGLE_SI_NO_COMMITMENT} />
        </FormGroup>
      )}

      <FormGroup label="¿Cuántas veces por semana te comprometés a entrenar? *" error={errors.step3_frequency} errorId="err-step3_frequency">
        <div className="toggle-group" role="radiogroup" aria-label="Frecuencia semanal">
          {FREQ_OPTIONS.map(n => (
            <button key={n} type="button" role="radio" aria-checked={form.step3_frequency === String(n)}
              className={`toggle-btn${form.step3_frequency === String(n) ? ' active' : ''}`}
              onClick={() => set('step3_frequency', String(n))}>
              {n} veces
            </button>
          ))}
        </div>
      </FormGroup>
    </>
  );
}
