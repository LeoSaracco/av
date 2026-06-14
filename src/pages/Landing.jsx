/**
 * @file Página de aterrizaje principal de la plataforma Adrián Vila.
 *       Muestra los servicios, planes de entrenamiento, sección "Sobre mí",
 *       testimonios y llamado a la acción (CTA).
 * @route /
 * @auth Público — no requiere autenticación.
 */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { SEED_PLANS } from '../data/seed';

/**
 * Componente principal de la landing page.
 * Renderiza navegación responsive, secciones ancladas (hero, servicios,
 * planes, sobre mí, testimonios, CTA y contacto) y redirige al login.
 *
 * @returns {JSX.Element} Página completa de aterrizaje.
 */
export default function Landing() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useI18n();

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
          <a href="#servicios" style={{ color: 'var(--color-text-2)', fontSize: 14 }}>{t('nav.services')}</a>
          <a href="#planes" style={{ color: 'var(--color-text-2)', fontSize: 14 }}>{t('nav.plans')}</a>
          <a href="#sobre-mi" style={{ color: 'var(--color-text-2)', fontSize: 14 }}>{t('nav.about')}</a>
          <a href="#testimonios" style={{ color: 'var(--color-text-2)', fontSize: 14 }}>{t('nav.testimonials')}</a>
          <Link to="/store" style={{ color: 'var(--color-text-2)', fontSize: 14 }}>{t('nav.store')}</Link>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/login')}>
            {t('nav.login')}
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
          <a href="#servicios" style={{ color: 'var(--color-text-2)' }} onClick={() => setMenuOpen(false)}>{t('nav.services')}</a>
          <a href="#planes" style={{ color: 'var(--color-text-2)' }} onClick={() => setMenuOpen(false)}>{t('nav.plans')}</a>
          <a href="#sobre-mi" style={{ color: 'var(--color-text-2)' }} onClick={() => setMenuOpen(false)}>{t('nav.about')}</a>
          <a href="#testimonios" style={{ color: 'var(--color-text-2)' }} onClick={() => setMenuOpen(false)}>{t('nav.testimonials')}</a>
          <Link to="/store" style={{ color: 'var(--color-text-2)' }} onClick={() => setMenuOpen(false)}>{t('nav.store')}</Link>
          <button className="btn btn-primary" onClick={() => navigate('/login')}>{t('nav.login')}</button>
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
          {t('hero.badge')}
        </div>

        <h1 style={{
          fontFamily: 'var(--font-main)', fontSize: 'clamp(42px, 8vw, 84px)',
          fontWeight: 900, lineHeight: 1.0, letterSpacing: '-2px', marginBottom: 24,
          maxWidth: 900,
        }}>
          {t('hero.titleLine1')}<br/>
          <span style={{ color: 'var(--color-accent)' }}>{t('hero.titleLine2')}</span>
        </h1>

        <p style={{
          fontSize: 'clamp(16px, 2vw, 20px)', color: 'var(--color-text-2)',
          maxWidth: 560, lineHeight: 1.7, marginBottom: 40,
        }}>
          {t('hero.subtitle')}
        </p>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn btn-primary" style={{ fontSize: 16, padding: '14px 32px' }} onClick={() => navigate('/login')}>
            {t('hero.cta')} →
          </button>
          <a href="#servicios" className="btn btn-ghost" style={{ fontSize: 16, padding: '14px 32px' }}>
            {t('hero.services')}
          </a>
        </div>

        {/* ── Estadísticas ── */}
        <div style={{
          display: 'flex', gap: 40, marginTop: 60, flexWrap: 'wrap', justifyContent: 'center',
        }}>
          {[
            { value: '+200', labelKey: 'stats.clients' },
            { value: '6+', labelKey: 'stats.experience' },
            { value: '98%', labelKey: 'stats.retention' },
            { value: '∞', labelKey: 'stats.motivation' },
          ].map(s => (
            <div key={s.labelKey} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-main)', fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 900, color: 'var(--color-accent)' }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--color-text-2)', marginTop: 2 }}>{t(s.labelKey)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Servicios ── */}
      <section id="servicios" style={{ padding: '100px 24px', background: 'var(--color-bg-2)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ fontSize: 12, color: 'var(--color-accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12 }}>{t('services.label')}</div>
            <h2 style={{ fontSize: 'clamp(30px, 5vw, 48px)', fontWeight: 800 }}>{t('services.title')}</h2>
            <p style={{ color: 'var(--color-text-2)', marginTop: 12, maxWidth: 500, margin: '12px auto 0' }}>
              {t('services.subtitle')}
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {[
              { emoji: '🏋️', key: 'services.items.routines' },
              { emoji: '📊', key: 'services.items.tracking' },
              { emoji: '💬', key: 'services.items.feedback' },
              { emoji: '📱', key: 'services.items.app' },
              { emoji: '🎯', key: 'services.items.goals' },
              { emoji: '🛒', key: 'services.items.shop' },
            ].map(s => (
              <div key={s.key} className="card card-hover" style={{ gap: 16, padding: 28 }}>
                <div style={{ fontSize: 36 }}>{s.emoji}</div>
                <h3 style={{ fontSize: 18 }}>{t(s.key + '.title')}</h3>
                <p style={{ color: 'var(--color-text-2)', fontSize: 14, lineHeight: 1.7 }}>{t(s.key + '.desc')}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Planes ── */}
      <section id="planes" className="plan-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ fontSize: 12, color: 'var(--color-accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12 }}>{t('plans.label')}</div>
            <h2 style={{ fontSize: 'clamp(30px, 5vw, 48px)', fontWeight: 800 }}>{t('plans.title')}</h2>
            <p style={{ color: 'var(--color-text-2)', marginTop: 12, maxWidth: 500, margin: '12px auto 0' }}>
              {t('plans.subtitle')}
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, alignItems: 'stretch' }}>
            {SEED_PLANS.map(plan => (
              <div key={plan.id} className={`plan-card${plan.featured ? ' featured' : ''}`}>
                {plan.featured && <div className="plan-badge">{t('plans.badge')}</div>}

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
                  <div className="plan-name">{t(`plans.items.${plan.id}.name`)}</div>
                  <div className="plan-subtitle">{t(`plans.items.${plan.id}.subtitle`)}</div>
                </div>

                <div className="plan-price">
                  <span className="plan-price-currency">{t('plans.priceCurrency')}</span>
                  <span className="plan-price-value">{plan.price.toLocaleString('es-AR')}</span>
                  <span className="plan-price-period">{t('plans.pricePeriod')}</span>
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
                  {t('plans.cta')}
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
              <div style={{ fontSize: 12, color: 'var(--color-accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 16 }}>{t('about.label')}</div>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, marginBottom: 20, lineHeight: 1.1 }}>
                {t('about.heading1')}<br/>{t('about.heading2')}
              </h2>
              <p style={{ color: 'var(--color-text-2)', lineHeight: 1.8, marginBottom: 20, fontSize: 15 }}>
                {t('about.bio1')}
              </p>
              <p style={{ color: 'var(--color-text-2)', lineHeight: 1.8, marginBottom: 32, fontSize: 15 }}>
                {t('about.bio2')}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 32 }}>
                {['about.certs.0', 'about.certs.1', 'about.certs.2', 'about.certs.3'].map(certKey => (
                  <span key={certKey} style={{
                    background: 'var(--color-accent-dim2)', border: '1px solid rgba(0,255,0,0.15)',
                    borderRadius: 'var(--radius-full)', padding: '6px 14px', fontSize: 12,
                    color: 'var(--color-accent)', fontWeight: 600,
                  }}>{t(certKey)}</span>
                ))}
              </div>

              <button className="btn btn-primary" onClick={() => navigate('/login')}>
                {t('about.cta')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonios ── */}
      <section id="testimonios" style={{ padding: '100px 24px', background: 'var(--color-bg-2)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ fontSize: 12, color: 'var(--color-accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12 }}>{t('testimonials.label')}</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800 }}>{t('testimonials.title')}</h2>
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
            {t('cta.heading')}
          </h2>
          <p style={{ color: 'var(--color-text-2)', fontSize: 'clamp(15px, 2vw, 18px)', marginBottom: 40, lineHeight: 1.7 }}>
            {t('cta.subtitle')}
          </p>
          <button className="btn btn-primary" style={{ fontSize: 18, padding: '16px 40px' }} onClick={() => navigate('/login')}>
            {t('cta.button')}
          </button>
        </div>
      </section>

      {/* ── Contacto ── */}
      <section id="contacto" style={{ padding: '60px 24px', background: 'var(--color-bg-2)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-main)', fontWeight: 800, fontSize: 20 }}>Adrián <span style={{ color: 'var(--color-accent)' }}>Vila</span></div>
            <div style={{ fontSize: 13, color: 'var(--color-text-3)', marginTop: 4 }}>{t('footer.subtitle')}</div>
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <a href="mailto:adrian@av.com" style={{ color: 'var(--color-text-2)', fontSize: 14 }}>adrian@av.com</a>
            <a href="https://instagram.com" style={{ color: 'var(--color-text-2)', fontSize: 14 }}>@adrianvila</a>
            <Link to="/store" style={{ color: 'var(--color-text-2)', fontSize: 14 }}>{t('nav.store')}</Link>
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-text-3)' }}>{t('footer.copyright')}</div>
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
