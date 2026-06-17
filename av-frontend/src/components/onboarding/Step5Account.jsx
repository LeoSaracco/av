/**
 * @file Paso 6 del onboarding: creacion de cuenta con verificacion
 *       por email. Flujo en dos etapas: (a) envio del codigo,
 *       (b) ingreso de codigo + contraseña + aceptacion de terminos.
 */
import React, { useState } from 'react';
import { FormGroup, FieldError } from './FormPrimitives';
import { apiSendVerificationCode } from '../../api/apiClient';

const TERMS_TEXT = 'Acepto los terminos y condiciones y la politica de privacidad';

export default function Step5Account({ form, set, errors, email, onCodeSent }) {
  const [codeSent, setCodeSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');

  const handleSendCode = async () => {
    setSending(true);
    setSendError('');
    try {
      await apiSendVerificationCode(email);
      setCodeSent(true);
      if (onCodeSent) onCodeSent();
    } catch (err) {
      setSendError(err.message || 'No se pudo enviar el codigo');
    } finally {
      setSending(false);
    }
  };

  if (!codeSent) {
    return (
      <div className="verify-email-prompt">
        <p className="verify-email-text">
          Vamos a enviar un codigo de verificacion a <strong>{email}</strong>
        </p>
        <button
          className="btn btn-primary"
          type="button"
          onClick={handleSendCode}
          disabled={sending}
        >
          {sending ? 'Enviando...' : 'Enviar codigo de verificacion'}
        </button>
        {sendError && (
          <div style={{ background: 'rgba(255,59,59,0.1)', border: '1px solid rgba(255,59,59,0.3)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: 13, color: 'var(--color-error)', marginTop: 12 }}>
            {sendError}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <FormGroup label="Email">
        <input className="form-input form-input-readonly" value={email} readOnly tabIndex={-1} />
      </FormGroup>

      <FormGroup label="Codigo de verificacion *" htmlFor="step5_code" error={errors.step5_code} errorId="err-step5_code">
        <input id="step5_code" className="form-input form-input-code" placeholder="XXXXXX"
          value={form.step5_code} onChange={e => set('step5_code', e.target.value)}
          aria-required="true" aria-invalid={!!errors.step5_code} aria-describedby={errors.step5_code ? 'err-step5_code' : undefined} maxLength={6} />
        <FieldError msg={errors.step5_code} id="err-step5_code" />
      </FormGroup>

      <div className="grid-2">
        <FormGroup label="Contraseña *" htmlFor="step5_password" error={errors.step5_password} errorId="err-step5_password">
          <input id="step5_password" className="form-input" type="password" placeholder="Minimo 6 caracteres"
            value={form.step5_password} onChange={e => set('step5_password', e.target.value)}
            aria-required="true" aria-invalid={!!errors.step5_password} aria-describedby={errors.step5_password ? 'err-step5_password' : undefined} />
        </FormGroup>
        <FormGroup label="Confirmar contraseña *" htmlFor="step5_confirm" error={errors.step5_confirm} errorId="err-step5_confirm">
          <input id="step5_confirm" className="form-input" type="password" placeholder="Repeti la contraseña"
            value={form.step5_confirm} onChange={e => set('step5_confirm', e.target.value)}
            aria-required="true" aria-invalid={!!errors.step5_confirm} aria-describedby={errors.step5_confirm ? 'err-step5_confirm' : undefined} />
        </FormGroup>
      </div>

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
