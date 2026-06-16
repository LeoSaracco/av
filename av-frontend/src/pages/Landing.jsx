/**
 * @file Página de aterrizaje principal de la plataforma Adrián Vila.
 *       Muestra los servicios, planes de entrenamiento, sección "Sobre mí",
 *       testimonios y llamado a la acción (CTA).
 * @route /
 * @auth Público — no requiere autenticación.
 */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

/**
 * Componente principal de la landing page.
 * Renderiza navegación responsive, secciones ancladas (hero, servicios,
 * planes, sobre mí, testimonios, CTA y contacto) y redirige al login.
 *
 * @returns {JSX.Element} Página completa de aterrizaje.
 */
export default function Landing() {
  const navigate = useNavigate();
  const { plans, loaded } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* ── Navegación ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', height: '64px',
        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <span style={{ fontFamily: 'var(--font-main)', fontWeight: 800, fontSize: 20, letterSpacing: '-0.5px' }}>
          Adrián <span style={{ color: 'var(--color-accent)' }}>Vila</span>
        </span>

        {/* Desktop nav */}
        <div className="landing-nav-links" style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          <a href="#servicios" style={{ color: 'var(--color-text-2)', fontSize: 14 }}>Servicios</a>
          <a href="#planes" style={{ color: 'var(--color-text-2)', fontSize: 14 }}>Planes</a>
          <a href="#sobre-mi" style={{ color: 'var(--color-text-2)', fontSize: 14 }}>Sobre mí</a>
          <a href="#testimonios" style={{ color: 'var(--color-text-2)', fontSize: 14 }}>Testimonios</a>
          <Link to="/store" style={{ color: 'var(--color-text-2)', fontSize: 14 }}>Tienda</Link>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/login')}>
            Acceder
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: 'none', background: 'none', border: '1px solid var(--color-border)', borderRadius: 8, padding: '6px 10px', color: 'var(--color-text)' }}
          className="hamburger-btn"
        >
          ☰
        </button>
      </nav>

      {/* ── Menú mobile ── */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 64, left: 0, right: 0, zIndex: 199,
          background: 'var(--color-bg-2)', borderBottom: '1px solid var(--color-border)',
          padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16,
        }}>
          <a href="#servicios" style={{ color: 'var(--color-text-2)' }} onClick={() => setMenuOpen(false)}>Servicios</a>
          <a href="#planes" style={{ color: 'var(--color-text-2)' }} onClick={() => setMenuOpen(false)}>Planes</a>
          <a href="#sobre-mi" style={{ color: 'var(--color-text-2)' }} onClick={() => setMenuOpen(false)}>Sobre mí</a>
          <a href="#testimonios" style={{ color: 'var(--color-text-2)' }} onClick={() => setMenuOpen(false)}>Testimonios</a>
          <Link to="/store" style={{ color: 'var(--color-text-2)' }} onClick={() => setMenuOpen(false)}>Tienda</Link>
          <button className="btn btn-primary" onClick={() => navigate('/login')}>Acceder</button>
        </div>
      )}

      {/* ── Hero ── */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: '100px 24px 60px',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,255,0,0.06) 0%, transparent 70%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* ── Líneas decorativas ── */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute', left: 0, right: 0,
              top: `${20 + i * 18}%`,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(0,255,0,0.06), transparent)',
            }}/>
          ))}
        </div>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'var(--color-accent-dim2)', border: '1px solid rgba(0,255,0,0.2)',
          borderRadius: 'var(--radius-full)', padding: '6px 16px',
          fontSize: 12, color: 'var(--color-accent)', fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 28,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-block', animation: 'pulse 2s infinite' }}/>
          Entrenamiento Personalizado Premium
        </div>

        <h1 style={{
          fontFamily: 'var(--font-main)', fontSize: 'clamp(42px, 8vw, 84px)',
          fontWeight: 900, lineHeight: 1.0, letterSpacing: '-2px', marginBottom: 24,
          maxWidth: 900,
        }}>
          Tu mejor versión<br/>
          <span style={{ color: 'var(--color-accent)' }}>comienza hoy.</span>
        </h1>

        <p style={{
          fontSize: 'clamp(16px, 2vw, 20px)', color: 'var(--color-text-2)',
          maxWidth: 560, lineHeight: 1.7, marginBottom: 40,
        }}>
          Entrenamiento 100% personalizado, rutinas diseñadas para tus objetivos,
          seguimiento constante y resultados reales. Sin excusas.
        </p>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn btn-primary" style={{ fontSize: 16, padding: '14px 32px' }} onClick={() => navigate('/login')}>
            Comenzar ahora →
          </button>
          <a href="#servicios" className="btn btn-ghost" style={{ fontSize: 16, padding: '14px 32px' }}>
            Ver servicios
          </a>
        </div>

        {/* ── Estadísticas ── */}
        <div style={{
          display: 'flex', gap: 40, marginTop: 60, flexWrap: 'wrap', justifyContent: 'center',
        }}>
          {[
            { value: '+200', label: 'Clientes transformados' },
            { value: '6+', label: 'Años de experiencia' },
            { value: '98%', label: 'Tasa de retención' },
            { value: '∞', label: 'Motivación incluida' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-main)', fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 900, color: 'var(--color-accent)' }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--color-text-2)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Servicios ── */}
      <section id="servicios" style={{ padding: '100px 24px', background: 'var(--color-bg-2)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ fontSize: 12, color: 'var(--color-accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12 }}>Servicios</div>
            <h2 style={{ fontSize: 'clamp(30px, 5vw, 48px)', fontWeight: 800 }}>¿Qué incluye tu plan?</h2>
            <p style={{ color: 'var(--color-text-2)', marginTop: 12, maxWidth: 500, margin: '12px auto 0' }}>
              Todo lo que necesitás para transformar tu cuerpo y hábitos, en un solo lugar.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {[
              { emoji: '🏋️', title: 'Rutinas Personalizadas', desc: 'Planes diseñados específicamente para tus objetivos, historial y disponibilidad. Sin copiar y pegar.' },
              { emoji: '📊', title: 'Seguimiento de Evolución', desc: 'Control de peso, medidas y performance con gráficos de progreso. Ves tu avance en tiempo real.' },
              { emoji: '💬', title: 'Feedback Permanente', desc: 'Observaciones semanales del coach. Ajustes en tu plan cuando los necesitás.' },
              { emoji: '📱', title: 'App en Tu Bolsillo', desc: 'Accedé a tu rutina desde el celular, tablet o PC. Siempre disponible, siempre actualizada.' },
              { emoji: '🎯', title: 'Objetivos Claros', desc: 'Definimos metas reales y medibles juntos. Sin promesas vacías - resultados concretos.' },
              { emoji: '🛒', title: 'Tienda Premium', desc: 'Ropa, suplementos y accesorios seleccionados. Todo lo que necesitás para entrenar a tope.' },
            ].map(s => (
              <div key={s.title} className="card card-hover" style={{ gap: 16, padding: 28 }}>
                <div style={{ fontSize: 36 }}>{s.emoji}</div>
                <h3 style={{ fontSize: 18 }}>{s.title}</h3>
                <p style={{ color: 'var(--color-text-2)', fontSize: 14, lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Planes ── */}
      <section id="planes" className="plan-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ fontSize: 12, color: 'var(--color-accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12 }}>Planes</div>
            <h2 style={{ fontSize: 'clamp(30px, 5vw, 48px)', fontWeight: 800 }}>Elegí tu camino</h2>
            <p style={{ color: 'var(--color-text-2)', marginTop: 12, maxWidth: 500, margin: '12px auto 0' }}>
              Tres planes diseñados para distintas necesidades. Todos con acompañamiento real.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, alignItems: 'stretch' }}>
            {plans.length === 0 && (
              <p style={{ color: 'var(--color-text-2)', textAlign: 'center', gridColumn: '1 / -1' }}>
                {loaded ? 'No hay planes disponibles.' : 'Cargando planes...'}
              </p>
            )}
            {plans.map(plan => (
              <div key={plan.id} className={`plan-card${plan.featured ? ' featured' : ''}`}>
                {plan.featured && <div className="plan-badge">Más elegido</div>}

                <div className="plan-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {plan.id === 'plan1' ? (
                      <><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></>
                    ) : plan.id === 'plan2' ? (
                      <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>
                    ) : (
                      <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>
                    )}
                  </svg>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div className="plan-name">{plan.name}</div>
                  <div className="plan-subtitle">{plan.subtitle}</div>
                </div>

                <div className="plan-price">
                  <span className="plan-price-currency">$</span>
                  <span className="plan-price-value">{plan.price.toLocaleString('es-AR')}</span>
                  <span className="plan-price-period">/mes ARS</span>
                </div>

                <div className="plan-features">
                  {plan.features.map((f, i) => (
                    <div key={i} className="plan-feature">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <button
                  className={`btn ${plan.featured ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ width: '100%', justifyContent: 'center', marginTop: 'auto', padding: '13px 20px' }}
                  onClick={() => { window.location.href = `#/pago?plan=${plan.id}`; }}
                >
                  Lo quiero
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sobre mí ── */}
      <section id="sobre-mi" style={{ padding: '100px 24px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 60, alignItems: 'center' }}>
            {/* ── Imagen placeholder ── */}
            <div style={{
              aspectRatio: '4/5', background: 'linear-gradient(135deg, var(--color-bg-3) 0%, var(--color-surface) 100%)',
              borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 16, color: 'var(--color-text-3)', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: '60%', background: 'linear-gradient(180deg, rgba(0,255,0,0.06) 0%, transparent 100%)',
              }}/>
              <span style={{ fontSize: 80 }}>💪</span>
              <span style={{ fontSize: 14, color: 'var(--color-text-3)' }}>Adrián Vila</span>
            </div>

            <div>
              <div style={{ fontSize: 12, color: 'var(--color-accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 16 }}>Sobre mí</div>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, marginBottom: 20, lineHeight: 1.1 }}>
                Más de 6 años<br/>transformando vidas.
              </h2>
              <p style={{ color: 'var(--color-text-2)', lineHeight: 1.8, marginBottom: 20, fontSize: 15 }}>
                Soy <strong style={{ color: 'var(--color-text)' }}>Adrián Vila</strong>, preparador físico certificado con especialización en
                hipertrofia, pérdida de grasa y rendimiento deportivo. Trabajo con atletas
                y personas comunes que quieren resultados reales.
              </p>
              <p style={{ color: 'var(--color-text-2)', lineHeight: 1.8, marginBottom: 32, fontSize: 15 }}>
                Cada plan es único. Cada cliente importa. No creo en las soluciones genéricas
                ni en los milagros rápidos. Creo en el trabajo constante, la metodología
                y el acompañamiento real.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 32 }}>
                {['Preparador Físico Certificado', 'Especialista en Hipertrofia', 'Coach Nutricional', 'Entrenador Funcional'].map(cert => (
                  <span key={cert} style={{
                    background: 'var(--color-accent-dim2)', border: '1px solid rgba(0,255,0,0.15)',
                    borderRadius: 'var(--radius-full)', padding: '6px 14px', fontSize: 12,
                    color: 'var(--color-accent)', fontWeight: 600,
                  }}>{cert}</span>
                ))}
              </div>

              <button className="btn btn-primary" onClick={() => navigate('/login')}>
                Empezar entrenamiento →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonios ── */}
      <section id="testimonios" style={{ padding: '100px 24px', background: 'var(--color-bg-2)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ fontSize: 12, color: 'var(--color-accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12 }}>Testimonios</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800 }}>Lo que dicen mis clientes</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {[
              { name: 'Martina G.', goal: 'Bajé 12 kg en 5 meses', text: 'Jamás pensé que iba a poder sostener una rutina tan exigente. Adrián me enseñó que el proceso importa más que la meta. Los resultados llegaron solos.', stars: 5 },
              { name: 'Lucas F.', goal: 'Gané 8 kg de masa muscular', text: 'En 6 meses logré lo que no pude en 2 años por mi cuenta. El seguimiento personalizado hace toda la diferencia. Cada semana hay ajustes según cómo me siento.', stars: 5 },
              { name: 'Sofía H.', goal: 'Mejoré mi 10k en 8 minutos', text: 'Vine por rendimiento deportivo y superé todas mis expectativas. El plan funcional que armó Adrián combinó perfecto fuerza y cardio para mi objetivo.', stars: 5 },
              { name: 'Diego R.', goal: 'Recuperé mi espalda', text: 'Tenía una lesión crónica y pensé que no podría entrenar más. El enfoque de Adrián fue progresivo e inteligente. Hoy entreno sin dolor.', stars: 5 },
            ].map(t => (
              <div key={t.name} className="card" style={{ gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-main)' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-accent)', fontWeight: 600 }}>{t.goal}</div>
                  </div>
                  <div style={{ color: '#FFB800', fontSize: 14 }}>{'★'.repeat(t.stars)}</div>
                </div>
                <p style={{ color: 'var(--color-text-2)', fontSize: 14, lineHeight: 1.7, fontStyle: 'italic' }}>"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        padding: '100px 24px', textAlign: 'center',
        background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(0,255,0,0.08) 0%, transparent 70%)',
      }}>
        <div className="container-sm">
          <h2 style={{ fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 900, marginBottom: 20, lineHeight: 1.1 }}>
            ¿Listo para cambiar?
          </h2>
          <p style={{ color: 'var(--color-text-2)', fontSize: 'clamp(15px, 2vw, 18px)', marginBottom: 40, lineHeight: 1.7 }}>
            El mejor momento para empezar fue ayer. El segundo mejor momento es ahora.
          </p>
          <button className="btn btn-primary" style={{ fontSize: 18, padding: '16px 40px' }} onClick={() => navigate('/login')}>
            Acceder a la plataforma →
          </button>
        </div>
      </section>

      {/* ── Contacto ── */}
      <section id="contacto" style={{ padding: '60px 24px', background: 'var(--color-bg-2)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-main)', fontWeight: 800, fontSize: 20 }}>Adrián <span style={{ color: 'var(--color-accent)' }}>Vila</span></div>
            <div style={{ fontSize: 13, color: 'var(--color-text-3)', marginTop: 4 }}>Preparador Físico Personalizado</div>
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <a href="mailto:adrian@av.com" style={{ color: 'var(--color-text-2)', fontSize: 14 }}>adrian@av.com</a>
            <a href="https://instagram.com" style={{ color: 'var(--color-text-2)', fontSize: 14 }}>@adrianvila</a>
            <Link to="/store" style={{ color: 'var(--color-text-2)', fontSize: 14 }}>Tienda</Link>
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-text-3)' }}>© 2026 Adrián Vila. Todos los derechos reservados.</div>
        </div>
      </section>

      <style>{`
        @media (max-width: 640px) {
          .landing-nav-links { display: none !important; }
          .hamburger-btn { display: block !important; }
        }
      `}</style>
    </div>
  );
}
