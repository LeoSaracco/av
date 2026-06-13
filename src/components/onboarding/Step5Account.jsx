/**
 * @file Step5Account.jsx
 * @description Paso 6 del onboarding: creación de cuenta con verificación
 *              por email. Flujo en dos etapas: (a) envío del código,
 *              (b) ingreso de código + contraseña + aceptación de términos.
 *              En modo demo el código siempre es 123456.
 */
import React, { useState } from 'react';
import { FormGroup, FieldError } from './FormPrimitives';

// ── Crear cuenta ───────────────────────────────────────────────────────────────
const TERMS_TEXT = 'Acepto los términos y condiciones y la política de privacidad';

/**
 * Formulario del paso 6 — Creación de cuenta.
 * Gestiona el envío de código de verificación, ingreso del código,
 * creación de contraseña y aceptación de términos.
 *
 * @param {Object} props
 * @param {Object} props.form - Estado del formulario con los valores actuales
 * @param {(field: string, value: string|boolean) => void} props.set - Función para actualizar un campo
 * @param {Object} props.errors - Objeto con mensajes de error por campo
 * @param {string} props.email - Email del cliente (pre-llenado del paso 1)
 * @returns {JSX.Element} Formulario de creación de cuenta
 */
export default function Step5Account({ form, set, errors, email }) {
  const [codeSent, setCodeSent] = useState(false);

  if (!codeSent) {
    return (
      <div className="verify-email-prompt">
        <p className="verify-email-text">
          Vamos a enviar un código de verificación a <strong>{email}</strong>
        </p>
        <button className="btn btn-primary" type="button" onClick={() => setCodeSent(true)}>
          Enviar código de verificación
        </button>
        <p className="demo-hint">Demo: el código es 123456</p>
      </div>
    );
  }

  return (
    <>
      <FormGroup label="Email">
        <input className="form-input form-input-readonly" value={email} readOnly tabIndex={-1} />
      </FormGroup>

      <FormGroup label="Código de verificación *" htmlFor="step5_code" error={errors.step5_code} errorId="err-step5_code">
        <input id="step5_code" className="form-input form-input-code" placeholder="123456"
          value={form.step5_code} onChange={e => set('step5_code', e.target.value)}
          aria-required="true" aria-invalid={!!errors.step5_code} aria-describedby={errors.step5_code ? 'err-step5_code' : undefined} />
        <div className="demo-hint">Te enviamos un código a {email} (demo: 123456)</div>
      </FormGroup>

      <div className="grid-2">
        <FormGroup label="Contraseña *" htmlFor="step5_password" error={errors.step5_password} errorId="err-step5_password">
          <input id="step5_password" className="form-input" type="password" placeholder="Mínimo 6 caracteres"
            value={form.step5_password} onChange={e => set('step5_password', e.target.value)}
            aria-required="true" aria-invalid={!!errors.step5_password} aria-describedby={errors.step5_password ? 'err-step5_password' : undefined} />
        </FormGroup>
        <FormGroup label="Confirmar contraseña *" htmlFor="step5_confirm" error={errors.step5_confirm} errorId="err-step5_confirm">
          <input id="step5_confirm" className="form-input" type="password" placeholder="Repetí la contraseña"
            value={form.step5_confirm} onChange={e => set('step5_confirm', e.target.value)}
            aria-required="true" aria-invalid={!!errors.step5_confirm} aria-describedby={errors.step5_confirm ? 'err-step5_confirm' : undefined} />
        </FormGroup>
      </div>

      {/* Checkbox términos */}
      <label className="checkbox-label">
        <input type="checkbox" className="checkbox-input"
          checked={form.step5_terms} onChange={e => set('step5_terms', e.target.checked)}
          aria-required="true" aria-invalid={!!errors.step5_terms} aria-describedby={errors.step5_terms ? 'err-step5_terms' : undefined} />
        <span className="checkbox-text">{TERMS_TEXT} *</span>
      </label>
      <FieldError msg={errors.step5_terms} id="err-step5_terms" />
    </>
  );
}
