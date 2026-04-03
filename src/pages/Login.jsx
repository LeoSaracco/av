import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MOCK_USERS } from '../data/seed';

export default function Login() {
  const [mode, setMode] = useState('demo'); // 'demo' | 'form'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const handleForm = (e) => {
    e.preventDefault();
    setError('');
    const result = login(email, password);
    if (result.ok) {
      navigate(result.user.role === 'coach' ? '/coach' : '/client');
    } else {
      setError(result.error);
    }
  };

  const handleDemo = (role, clientId) => {
    const user = loginAsDemo(role, clientId);
    if (user) navigate(user.role === 'coach' ? '/coach' : '/client');
  };

  const clients = MOCK_USERS.filter(u => u.role === 'client');

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '24px',
      background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,255,0,0.07) 0%, transparent 60%)',
    }}>
      {/* Logo */}
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
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)' }}>
          {[{ id: 'demo', label: 'Acceso Demo' }, { id: 'form', label: 'Iniciar Sesión' }].map(tab => (
            <button key={tab.id} onClick={() => setMode(tab.id)}
              style={{
                flex: 1, padding: '16px', border: 'none', cursor: 'pointer',
                background: mode === tab.id ? 'var(--color-surface)' : 'var(--color-bg-3)',
                color: mode === tab.id ? 'var(--color-text)' : 'var(--color-text-2)',
                fontWeight: mode === tab.id ? 700 : 500,
                fontFamily: 'var(--font-main)', fontSize: 14,
                borderBottom: mode === tab.id ? '2px solid var(--color-accent)' : '2px solid transparent',
                transition: 'var(--transition)',
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ padding: 28 }}>
          {mode === 'demo' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={{ fontSize: 13, color: 'var(--color-text-2)', marginBottom: 8, lineHeight: 1.6 }}>
                Elegí un perfil para explorar la plataforma como demo:
              </p>

              {/* Coach */}
              <button
                onClick={() => handleDemo('coach')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  background: 'linear-gradient(135deg, rgba(0,255,0,0.12), rgba(0,255,0,0.04))',
                  border: '1px solid rgba(0,255,0,0.25)', borderRadius: 'var(--radius-lg)',
                  padding: '16px 18px', cursor: 'pointer', transition: 'var(--transition)', textAlign: 'left',
                  width: '100%',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,255,0,0.5)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0,255,0,0.25)'}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'var(--color-accent-dim)', color: 'var(--color-accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, flexShrink: 0,
                }}>🏋️</div>
                <div>
                  <div style={{ fontWeight: 700, fontFamily: 'var(--font-main)', color: 'var(--color-text)' }}>Adrián Vila</div>
                  <div style={{ fontSize: 12, color: 'var(--color-accent)', fontWeight: 600 }}>Coach — Panel completo</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-3)', marginTop: 2 }}>Gestión de clientes, rutinas y más</div>
                </div>
                <div style={{ marginLeft: 'auto', color: 'var(--color-accent)' }}>→</div>
              </button>

              <div style={{ height: 1, background: 'var(--color-border)', margin: '4px 0' }} />
              <p style={{ fontSize: 12, color: 'var(--color-text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                Clientes demo
              </p>

              {clients.map(client => (
                <button
                  key={client.id}
                  onClick={() => handleDemo('client', client.clientId)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    background: 'var(--color-bg-3)', border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)', padding: '14px 18px',
                    cursor: 'pointer', transition: 'var(--transition)', textAlign: 'left', width: '100%',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-border-hover)'; e.currentTarget.style.background = 'var(--color-surface)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.background = 'var(--color-bg-3)'; }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'var(--color-surface-2)', color: 'var(--color-text-2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 14, flexShrink: 0, fontFamily: 'var(--font-main)',
                  }}>
                    {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: 14 }}>{client.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-3)' }}>{client.email}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', color: 'var(--color-text-3)', fontSize: 12 }}>→</div>
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleForm} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" placeholder="tu@email.com"
                  value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Contraseña</label>
                <input className="form-input" type="password" placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              {error && (
                <div style={{ background: 'rgba(255,59,59,0.1)', border: '1px solid rgba(255,59,59,0.3)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: 13, color: 'var(--color-error)' }}>
                  {error}
                </div>
              )}
              <button className="btn btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center' }}>
                Iniciar sesión
              </button>
              <div style={{ fontSize: 12, color: 'var(--color-text-3)', textAlign: 'center', lineHeight: 1.6 }}>
                Coach: adrian@av.com / coach123<br/>
                Cliente: martina@gmail.com / 1234
              </div>
            </form>
          )}
        </div>
      </div>

      <button onClick={() => window.history.back()} style={{ marginTop: 24, background: 'none', border: 'none', color: 'var(--color-text-2)', fontSize: 13, cursor: 'pointer' }}>
        ← Volver al inicio
      </button>
    </div>
  );
}
