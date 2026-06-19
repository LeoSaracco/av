/**
 * @file Pantalla de inicio de sesion conectada a la API real via JWT.
 * @route /login
 * @auth Publico
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiForgotPassword, apiResetPassword } from '../api/apiClient';
import { inlineSpinnerStyle } from '../utils/spinnerStyle';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showReset, setShowReset] = useState(false);
  const [resetStep, setResetStep] = useState('email');
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [resetMsg, setResetMsg] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.ok) {
      const role = result.user?.roles?.includes('ROLE_COACH') ? 'coach' : 'client';
      navigate(role === 'coach' ? '/coach' : '/client');
    } else {
      setError(result.error);
    }
  };

  const handleSendResetCode = async () => {
    setResetLoading(true);
    setResetError('');
    try {
      await apiForgotPassword(resetEmail);
      setResetMsg('Codigo enviado a ' + resetEmail);
      setResetStep('code');
    } catch (err) {
      setResetError(err.message || 'Error al enviar el codigo');
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (resetPassword.length < 6) {
      setResetError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setResetLoading(true);
    setResetError('');
    try {
      await apiResetPassword(resetEmail, resetCode, resetPassword);
      setResetMsg('Contraseña actualizada. Ya podes iniciar sesion.');
      setTimeout(() => {
        setShowReset(false);
        setResetStep('email');
        setResetMsg('');
        setEmail(resetEmail);
      }, 2000);
    } catch (err) {
      setResetError(err.message || 'Error al restablecer la contraseña');
    } finally {
      setResetLoading(false);
    }
  };

  const closeReset = () => {
    setShowReset(false);
    setResetStep('email');
    setResetMsg('');
    setResetError('');
    setResetCode('');
    setResetPassword('');
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '24px',
      background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,255,0,0.07) 0%, transparent 60%)',
    }}>
      <div style={{ marginBottom: 40, textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-main)', fontSize: 28, fontWeight: 900, letterSpacing: '-1px' }}>
          Adrian <span style={{ color: 'var(--color-accent)' }}>Vila</span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--color-text-3)', marginTop: 4 }}>Plataforma de Entrenamiento</div>
      </div>

      <div style={{
        width: '100%', maxWidth: 420,
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: '0 24px 60px rgba(0,0,0,0.7)',
      }}>
        {showReset ? (
          <div style={{ padding: 28 }}>
            {resetStep === 'email' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h3 style={{ fontFamily: 'var(--font-main)', fontSize: 18, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>Recuperar contraseña</h3>
                <p style={{ fontSize: 13, color: 'var(--color-text-2)', margin: 0 }}>Ingresa tu email y te enviaremos un codigo para restablecer tu contraseña.</p>
                <div className="form-group">
                  <label className="form-label" htmlFor="reset-email">Email</label>
                  <input id="reset-email" className="form-input" type="email" placeholder="tu@email.com"
                    value={resetEmail} onChange={e => setResetEmail(e.target.value)} />
                </div>
                {resetError && (
                  <div style={{ background: 'rgba(255,59,59,0.1)', border: '1px solid rgba(255,59,59,0.3)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: 13, color: 'var(--color-error)' }}>
                    {resetError}
                  </div>
                )}
                {resetMsg && (
                  <div style={{ background: 'rgba(0,255,0,0.08)', border: '1px solid rgba(0,255,0,0.2)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: 13, color: 'var(--color-accent)' }}>
                    {resetMsg}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-ghost" onClick={closeReset}>Cancelar</button>
                  <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleSendResetCode} disabled={resetLoading || !resetEmail}>
                    {resetLoading ? <div style={inlineSpinnerStyle(18, '#000', 'rgba(0,0,0,0.25)')} /> : 'Enviar código'}
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h3 style={{ fontFamily: 'var(--font-main)', fontSize: 18, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>Nueva contraseña</h3>
                <p style={{ fontSize: 13, color: 'var(--color-text-2)', margin: 0 }}>Ingresa el codigo que recibiste y tu nueva contraseña.</p>
                <div className="form-group">
                  <label className="form-label" htmlFor="reset-code">Codigo</label>
                  <input id="reset-code" className="form-input" placeholder="XXXXXX"
                    value={resetCode} onChange={e => setResetCode(e.target.value)} maxLength={6} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="reset-new-password">Nueva contraseña</label>
                  <input id="reset-new-password" className="form-input" type="password" placeholder="Minimo 6 caracteres"
                    value={resetPassword} onChange={e => setResetPassword(e.target.value)} />
                </div>
                {resetError && (
                  <div style={{ background: 'rgba(255,59,59,0.1)', border: '1px solid rgba(255,59,59,0.3)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: 13, color: 'var(--color-error)' }}>
                    {resetError}
                  </div>
                )}
                {resetMsg && (
                  <div style={{ background: 'rgba(0,255,0,0.08)', border: '1px solid rgba(0,255,0,0.2)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: 13, color: 'var(--color-accent)' }}>
                    {resetMsg}
                  </div>
                )}
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleResetPassword} disabled={resetLoading || !resetCode || !resetPassword}>
                  {resetLoading ? <div style={inlineSpinnerStyle(18, '#000', 'rgba(0,0,0,0.25)')} /> : 'Cambiar contraseña'}
                </button>
                <button className="btn btn-ghost" onClick={closeReset}>Cancelar</button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ padding: 28 }}>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email</label>
                <input id="email" className="form-input" type="email" placeholder="tu@email.com"
                  value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="password">Contraseña</label>
                <input id="password" className="form-input" type="password" placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              {error && (
                <div style={{ background: 'rgba(255,59,59,0.1)', border: '1px solid rgba(255,59,59,0.3)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: 13, color: 'var(--color-error)' }}>
                  {error}
                </div>
              )}
              <button className="btn btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                {loading ? <div style={inlineSpinnerStyle(18, '#000', 'rgba(0,0,0,0.25)')} /> : 'Iniciar sesión'}
              </button>
              <div style={{ textAlign: 'center' }}>
                <button type="button" onClick={() => { setShowReset(true); setResetEmail(email); }} style={{ background: 'none', border: 'none', color: 'var(--color-text-2)', fontSize: 12, cursor: 'pointer' }}>
                  Olvide mi contraseña
                </button>
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-text-3)', textAlign: 'center', lineHeight: 1.6 }}>
                Demo: adrian@av.com / coach123<br />
                Cliente: martina@gmail.com / 1234
              </div>
            </form>
          </div>
        )}
      </div>

      <button onClick={() => window.history.back()} style={{ marginTop: 24, background: 'none', border: 'none', color: 'var(--color-text-2)', fontSize: 13, cursor: 'pointer' }}>
        ← Volver al inicio
      </button>
    </div>
  );
}
