/**
 * @file Simulador de pago con tarjeta estilo Mercado Pago. Incluye
 *       formulario de datos de tarjeta, estados de procesamiento,
 *       aprobación, rechazo y redirección al onboarding.
 * @route /pago?plan={planId}
 * @auth Público — demo, no se realiza ningún cobro real.
 */
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const MPLogo = () => (
  <svg width="38" height="38" viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="10" fill="#009EE3"/>
    <path d="M13 24c0-6.075 4.925-11 11-11s11 4.925 11 11-4.925 11-11 11-11-4.925-11-11z" fill="white"/>
    <circle cx="24" cy="24" r="5" fill="#009EE3"/>
    <path d="M24 19v10M19 24h10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const CreditCardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);

const LockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const CrossIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const Spinner = () => (
  <div style={{ width: 52, height: 52, borderRadius: '50%', border: '4px solid #E5E5E5', borderTopColor: '#009EE3', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
);

/**
 * Simulador visual de pago con tarjeta. Emula el flujo completo de
 * Mercado Pago: formulario de tarjeta → procesamiento → aprobación
 * (con countdown de redirección) → onboarding.
 *
 * @returns {JSX.Element} Pantalla de checkout con estados dinámicos.
 */
export default function PaymentSimulator() {
  const [searchParams] = useSearchParams();
  const { plans } = useApp();
  const planId = searchParams.get('plan') || '';
  const plan = plans.find(p => p.id === planId) || plans[0] || null;
  const formatPrice = (p) => '$' + p.toLocaleString('es-AR');

  const [status, setStatus] = useState('form');
  // ── Datos de tarjeta pre-cargados para demo ──
  const [card, setCard] = useState({
    number: '4509953566233704',
    name: 'JUAN PEREZ',
    expiry: '1228',
    cvv: '123',
  });
  const [redirectCountdown, setRedirectCountdown] = useState(3);

  // ── Redirección tras aprobación ──
  useEffect(() => {
    if (status === 'approved') {
      if (redirectCountdown > 0) {
        const timer = setTimeout(() => setRedirectCountdown(c => c - 1), 1000);
        return () => clearTimeout(timer);
      }
      window.location.href = `#/onboarding?plan=${planId}`;
    }
  }, [status, redirectCountdown, planId]);

  // Pago mockeado para demo: no crea una preferencia real ni realiza cobros.
  const handlePay = async () => {
    if (!plan || !card.number || !card.name || !card.expiry || !card.cvv) return;
    setStatus('processing');
    await new Promise(resolve => setTimeout(resolve, 1200));
    setStatus('approved');
  };

  const isFormValid = card.number.length >= 13 && card.name.trim() && card.expiry.length >= 3 && card.cvv.length >= 3;

  if (!plan) {
    return (
      <div style={{ minHeight: '100vh', background: '#F5F5F5', fontFamily: "'Inter', -apple-system, sans-serif", color: '#333', display: 'grid', placeItems: 'center', padding: 20 }}>
        <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E5E5E5', padding: 24, maxWidth: 420, textAlign: 'center' }}>
          <h3 style={{ marginBottom: 8 }}>No hay planes disponibles</h3>
          <p style={{ color: '#666', margin: 0 }}>No se puede iniciar el pago hasta que el backend publique planes.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5', fontFamily: "'Inter', -apple-system, sans-serif", color: '#333' }}>
      {/* ── Header Mercado Pago ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E5E5', padding: '0 20px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <MPLogo />
            <span style={{ fontSize: 16, fontWeight: 700, color: '#333' }}>Mercado Pago</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#666' }}>
            <LockIcon />
            <span>Entorno seguro</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '20px 16px 40px' }}>

        {/* ── Estado: Formulario ── */}
        {status === 'form' && (
          <>
            {/* ── Indicador de paso ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24, fontSize: 13, color: '#009EE3', fontWeight: 600 }}>
              <CreditCardIcon />
              <span>Paso 2 de 2: Pagá con tarjeta</span>
            </div>

            <div className="mp-checkout-grid" style={{ display: 'grid', gap: 24, alignItems: 'start' }}>
              {/* ── Columna izquierda: formulario de tarjeta ── */}
              <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E5E5E5', overflow: 'hidden' }}>
                <div style={{ padding: '20px 20px 12px', borderBottom: '1px solid #F0F0F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <CreditCardIcon />
                    <span style={{ fontSize: 15, fontWeight: 600 }}>Tarjeta de crédito o débito</span>
                  </div>
                </div>
                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#555', marginBottom: 6 }}>Número de tarjeta</label>
                    <input
                      placeholder="1234 5678 9012 3456"
                      value={card.number}
                      onChange={e => setCard(c => ({ ...c, number: e.target.value.replace(/\D/g, '').slice(0, 16) }))}
                      style={{ width: '100%', height: 44, borderRadius: 6, border: '1px solid #D5D5D5', padding: '0 12px', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
                      onFocus={e => e.target.style.borderColor = '#009EE3'}
                      onBlur={e => e.target.style.borderColor = '#D5D5D5'}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#555', marginBottom: 6 }}>Nombre del titular</label>
                    <input
                      placeholder="Como aparece en la tarjeta"
                      value={card.name}
                      onChange={e => setCard(c => ({ ...c, name: e.target.value.toUpperCase() }))}
                      style={{ width: '100%', height: 44, borderRadius: 6, border: '1px solid #D5D5D5', padding: '0 12px', fontSize: 15, outline: 'none', boxSizing: 'border-box', textTransform: 'uppercase' }}
                      onFocus={e => e.target.style.borderColor = '#009EE3'}
                      onBlur={e => e.target.style.borderColor = '#D5D5D5'}
                    />
                  </div>
                  <div className="mp-card-row" style={{ display: 'grid', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#555', marginBottom: 6 }}>Vencimiento</label>
                      <input
                        placeholder="MM/AA"
                        value={card.expiry}
                        onChange={e => setCard(c => ({ ...c, expiry: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                        style={{ width: '100%', height: 44, borderRadius: 6, border: '1px solid #D5D5D5', padding: '0 12px', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
                        onFocus={e => e.target.style.borderColor = '#009EE3'}
                        onBlur={e => e.target.style.borderColor = '#D5D5D5'}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#555', marginBottom: 6 }}>CVV</label>
                      <input
                        type="password"
                        placeholder="123"
                        maxLength={4}
                        value={card.cvv}
                        onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                        style={{ width: '100%', height: 44, borderRadius: 6, border: '1px solid #D5D5D5', padding: '0 12px', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
                        onFocus={e => e.target.style.borderColor = '#009EE3'}
                        onBlur={e => e.target.style.borderColor = '#D5D5D5'}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handlePay}
                    disabled={!isFormValid}
                    style={{
                      width: '100%', height: 48, borderRadius: 6, border: 'none',
                      background: isFormValid ? '#009EE3' : '#B8DDF5',
                      color: '#fff', fontWeight: 700, fontSize: 16, cursor: isFormValid ? 'pointer' : 'not-allowed',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => { if (isFormValid) e.target.style.background = '#0089C7'; }}
                    onMouseLeave={e => { if (isFormValid) e.target.style.background = '#009EE3'; }}
                  >
                    <LockIcon />
                    Pagar {formatPrice(plan.price)}
                  </button>

                  <p style={{ fontSize: 11, color: '#999', textAlign: 'center', margin: 0 }}>
                    Demo — No se realiza ningún cobro real. Datos de tarjeta simulados.
                  </p>
                </div>
              </div>

              {/* ── Columna derecha: resumen de compra ── */}
              <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E5E5E5', padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 14 }}>
                  Resumen de compra
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{plan.name}</span>
                  <span style={{ fontSize: 12, color: '#666' }}>{plan.subtitle}</span>
                </div>
                <div style={{ height: 1, background: '#F0F0F0', margin: '14px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 13, color: '#666' }}>Total mensual</span>
                  <span style={{ fontSize: 24, fontWeight: 800, color: '#333' }}>{formatPrice(plan.price)}</span>
                </div>

                <div style={{ marginTop: 16, fontSize: 12, color: '#666', lineHeight: 1.6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <LockIcon />
                    <span>Pago seguro con Mercado Pago</span>
                  </div>
                  <div>La suscripción se renueva automáticamente cada mes. Podés cancelar cuando quieras.</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => { window.location.href = '#/'; }}
              style={{ marginTop: 16, background: 'none', border: 'none', color: '#666', fontSize: 13, cursor: 'pointer', display: 'block' }}
            >
              ← Cancelar y volver
            </button>
          </>
        )}

        {/* ── Estado: Procesando ── */}
        {status === 'processing' && (
          <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E5E5E5', padding: '48px 32px', textAlign: 'center', maxWidth: 480, margin: '40px auto' }}>
            <Spinner />
            <h3 style={{ fontSize: 18, marginTop: 24, marginBottom: 8, color: '#333' }}>Procesando tu pago</h3>
            <p style={{ fontSize: 14, color: '#666', margin: 0 }}>Estamos validando los datos de tu tarjeta con Mercado Pago...</p>
          </div>
        )}

        {/* ── Estado: Aprobado ── */}
        {status === 'approved' && (
          <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E5E5E5', padding: '48px 32px', textAlign: 'center', maxWidth: 480, margin: '40px auto' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#43A047' }}>
              <CheckIcon />
            </div>
            <h3 style={{ fontSize: 20, marginBottom: 8, color: '#333' }}>Pago aprobado</h3>
            <p style={{ fontSize: 14, color: '#666', marginBottom: 8, lineHeight: 1.6 }}>
              Tu pago de {formatPrice(plan.price)} fue procesado correctamente.
            </p>
            <p style={{ fontSize: 14, color: '#009EE3', fontWeight: 600, marginBottom: 24 }}>
              Redirigiendo al formulario en {redirectCountdown}...
            </p>
            <div style={{ height: 4, background: '#E5E5E5', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%', background: '#009EE3', borderRadius: 2,
                width: `${(3 - redirectCountdown) / 3 * 100}%`,
                transition: 'width 1s linear',
              }} />
            </div>
          </div>
        )}

        {/* ── Estado: Rechazado (fallback) ── */}
        {status === 'rejected' && (
          <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E5E5E5', padding: '48px 32px', textAlign: 'center', maxWidth: 480, margin: '40px auto' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#FFEBEE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#E53935' }}>
              <CrossIcon />
            </div>
            <h3 style={{ fontSize: 20, marginBottom: 8, color: '#333' }}>Pago rechazado</h3>
            <p style={{ fontSize: 14, color: '#666', marginBottom: 24 }}>
              No se pudo procesar el pago. Revisá los datos e intentá de nuevo.
            </p>
            <button
              onClick={() => { setStatus('form'); setCard({ number: '', name: '', expiry: '', cvv: '' }); }}
              style={{ width: '100%', height: 48, borderRadius: 6, border: 'none', background: '#009EE3', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
            >
              Intentar de nuevo
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
