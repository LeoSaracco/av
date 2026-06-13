/**
 * @file Step4Profile.jsx
 * @description Paso 4 del onboarding: perfil psicológico y motivacional
 *              del cliente, relación con su cuerpo, propósito, complejos,
 *              lesiones, ciudad y preferencia de comunidad.
 */
import React from 'react';
import { FormGroup, ToggleGroup } from './FormPrimitives';

// ── Perfil y motivación ────────────────────────────────────────────────────────
const TOGGLE_SI_NO = [
  { value: 'si', label: 'Sí' },
  { value: 'no', label: 'No' },
];

/**
 * Textarea con contador de caracteres en tiempo real.
 *
 * @param {Object} props
 * @param {string} props.id - ID del textarea
 * @param {string} props.value - Valor actual
 * @param {(e: React.ChangeEvent) => void} props.onChange - Callback al cambiar
 * @param {string} [props.placeholder] - Placeholder del campo
 * @param {number} [props.rows] - Número de filas visibles
 * @param {number} [props.maxLength] - Longitud máxima de caracteres
 * @returns {JSX.Element} Textarea con contador
 */
function CharTextarea({ id, value, onChange, placeholder, rows, maxLength }) {
  return (
    <>
      <textarea id={id} className="form-input" rows={rows} placeholder={placeholder} maxLength={maxLength}
        value={value} onChange={onChange} />
      <div className="char-count">{(value || '').length}/{maxLength}</div>
    </>
  );
}

/**
 * Formulario del paso 4 — Perfil y motivación.
 * Recoge aspectos psicológicos: relación con el cuerpo, propósito,
 * complejos, lesiones, ubicación y preferencia de comunidad.
 *
 * @param {Object} props
 * @param {Object} props.form - Estado del formulario con los valores actuales
 * @param {(field: string, value: string) => void} props.set - Función para actualizar un campo
 * @param {Object} props.errors - Objeto con mensajes de error por campo
 * @returns {JSX.Element} Formulario del paso 4
 */
export default function Step4Profile({ form, set, errors }) {
  return (
    <>
      <FormGroup label="¿Cómo te sentís con tu cuerpo hoy? *" htmlFor="step4_body" error={errors.step4_body} errorId="err-step4_body">
        <CharTextarea id="step4_body" rows={3} maxLength={200}
          placeholder="Describí tu relación con el espejo en una frase..."
          value={form.step4_body} onChange={e => set('step4_body', e.target.value)} />
      </FormGroup>

      <FormGroup label="Propósito mayor (no estético) para entrenar *" htmlFor="step4_purpose" error={errors.step4_purpose} errorId="err-step4_purpose">
        <CharTextarea id="step4_purpose" rows={3} maxLength={200}
          placeholder="¿Qué beneficio no estético te motiva más hoy?"
          value={form.step4_purpose} onChange={e => set('step4_purpose', e.target.value)} />
      </FormGroup>

      <FormGroup label="¿Sentís que tenés alguna distorsión con tu imagen corporal o complejos?" htmlFor="step4_complexes" error={errors.step4_complexes} errorId="err-step4_complexes">
        <CharTextarea id="step4_complexes" rows={2} maxLength={200}
          placeholder="Contanos si algo te condiciona..."
          value={form.step4_complexes} onChange={e => set('step4_complexes', e.target.value)} />
      </FormGroup>

      <FormGroup label="Lesiones o condiciones físicas a considerar" htmlFor="step4_injuries" error={errors.step4_injuries} errorId="err-step4_injuries">
        <textarea id="step4_injuries" className="form-input" rows={2} maxLength={200}
          placeholder="¿Alguna lesión actual o pasada que debamos saber?"
          value={form.step4_injuries} onChange={e => set('step4_injuries', e.target.value)}
          aria-invalid={!!errors.step4_injuries} aria-describedby={errors.step4_injuries ? 'err-step4_injuries' : undefined} />
      </FormGroup>

      <div className="grid-2">
        <FormGroup label="¿Desde qué ciudad entrenás? *" htmlFor="step4_city" error={errors.step4_city} errorId="err-step4_city">
          <input id="step4_city" className="form-input" placeholder="Ej: Buenos Aires"
            value={form.step4_city} onChange={e => set('step4_city', e.target.value)}
            aria-required="true" aria-invalid={!!errors.step4_city} aria-describedby={errors.step4_city ? 'err-step4_city' : undefined} />
        </FormGroup>
        <FormGroup label="¿Conectar con la comunidad?" error={errors.step4_community} errorId="err-step4_community">
          <ToggleGroup name="Comunidad" value={form.step4_community} onChange={v => set('step4_community', v)} options={TOGGLE_SI_NO} />
        </FormGroup>
      </div>
    </>
  );
}
