/**
 * @file Pantalla de inicio de sesión conectada a la API real via JWT.
 * @route /login
 * @auth Público
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '24px',
      background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,255,0,0.07) 0%, transparent 60%)',
    }}>
      <div style={{ marginBottom: 40, textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-main)', fontSize: 28, fontWeight: 900, letterSpacing: '-1px' }}>
          Adrián <span style={{ color: 'var(--color-accent)' }}>Vila</span>
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
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
            <div style={{ fontSize: 12, color: 'var(--color-text-3)', textAlign: 'center', lineHeight: 1.6 }}>
              Demo: adrian@av.com / coach123<br />
              Cliente: martina@gmail.com / 1234
            </div>
          </form>
        </div>
      </div>

      <button onClick={() => window.history.back()} style={{ marginTop: 24, background: 'none', border: 'none', color: 'var(--color-text-2)', fontSize: 13, cursor: 'pointer' }}>
        ← Volver al inicio
      </button>
    </div>
  );
}
