/**
 * @file Página de objetivos y metas del cliente. Muestra el objetivo
 *       principal con barra de progreso, objetivos secundarios con
 *       checkboxes y una línea de tiempo con hitos del programa.
 * @route /client/goals
 * @auth Requiere rol "client".
 */
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { ClientLayout } from '../../components/layout/ClientLayout';

/**
 * Página de objetivos y metas del cliente.
 * Muestra el objetivo principal con barra de progreso porcentual,
 * objetivos secundarios con indicadores de cumplimiento y una línea
 * de tiempo con los hitos del programa de entrenamiento.
 *
 * @returns {JSX.Element} Vista de objetivos con progreso y línea de hitos.
 */
export default function ClientGoals() {
  const { user } = useAuth();
  const { getClient, getProgressForClient } = useApp();

  const client = getClient(user?.clientId);
  const progress = client ? getProgressForClient(client.id) : [];
  const firstWeight = progress[0]?.weight;
  const lastWeight = progress[progress.length - 1]?.weight;
  const weightDiff = firstWeight && lastWeight ? Math.abs(lastWeight - firstWeight).toFixed(1) : 0;

  // Derive target weight from goal text (heuristic for demo)
  const goalKg = client?.goal?.match(/(\d+)\s*kg/)?.[1];
  const startWeight = firstWeight || 0;
  const targetWeight = goalKg ? parseFloat(goalKg) : null;

  // Progress percentage dummy
  const progressPct = weightDiff > 0 && targetWeight
    ? Math.min(Math.round((parseFloat(weightDiff) / Math.abs(startWeight - targetWeight)) * 100), 100)
    : Math.round((progress.length / 10) * 100);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <ClientLayout>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>Mis objetivos</div>
        <h1 style={{ fontSize: 22 }}>Objetivos y metas</h1>
      </div>

      {/* Main goal */}
      <div className="card" style={{ gap: 16, marginBottom: 16, background: 'linear-gradient(135deg, rgba(0,255,0,0.08), transparent)', border: '1px solid rgba(0,255,0,0.2)' }}>
        <div style={{ display: 'flex', alignIítems: 'center', gap: 10 }}>
          <span style={{ fontSize: 28 }}>🎯</span>
          <h2 style={{ fontSize: 18 }}>Objetivo principal</h2>
        </div>
        <p style={{ fontSize: 15, color: 'var(--color-text)', lineHeight: 1.7, fontStyle: 'italic' }}>
          "{client?.goal || 'Sin objetivo definido'}"
        </p>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--color-text-2)' }}>Progreso estimado</span>
            <span style={{ fontSize: 12, color: 'var(--color-accent)', fontWeight: 700 }}>{progressPct}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </div>

      {/* Sub-goals */}
      <h3 style={{ fontSize: 15, marginBottom: 14 }}>Objetivos secundarios</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {[
          { icon: '⚖️', title: 'Control de peso', desc: `De ${firstWeight || '—'} kg hacia la meta.`, done: progress.length >= 3 },
          { icon: '💧', title: 'Hidratación', desc: 'Beber 2L de agua por día.', done: true },
          { icon: '😴', title: 'Descanso', desc: '7-9 horas de sueño por noche.', done: false },
          { icon: '🥗', title: 'Alimentación', desc: 'Seguir el plan nutricional del coach.', done: true },
          { icon: '📅', title: 'Consistencia', desc: 'Entrenar las sesiones programadas.', done: progress.length >= 2 },
        ].map(g => (
          <div key={g.title} className="card" style={{ flexDirection: 'row', alignIítems: 'center', gap: 14, padding: '14px 16px' }}>
            <span style={{ fontSize: 24 }}>{g.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-main)', ...(g.done ? { textDecoration: 'none' } : {}) }}>{g.title}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-2)', marginTop: 2 }}>{g.desc}</div>
            </div>
            <div style={{
              width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
              background: g.done ? 'var(--color-accent)' : 'var(--color-bg-3)',
              border: `2px solid ${g.done ? 'var(--color-accent)' : 'var(--color-border)'}`,
              display: 'flex', alignIítems: 'center', justifyContent: 'center',
              fontSize: 12, color: g.done ? '#000' : 'transparent',
            }}>
              {g.done ? '✓' : ''}
            </div>
          </div>
        ))}
      </div>

      {/* Timeline milestones */}
      <h3 style={{ fontSize: 15, marginBottom: 14 }}>Hitos del programa</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {[
          { date: client?.joinDate || '—', title: 'Inicio del programa', done: true },
          { date: '1 mes', title: 'Primera evaluación', done: progress.length > 0 },
          { date: '2 meses', title: 'Ajuste de rutina', done: progress.length >= 4 },
          { date: '3 meses', title: 'Evaluación de progreso', done: false },
          { date: '6 meses', title: 'Objetivo final', done: false },
        ].map((m, i, arr) => (
          <div key={m.title} style={{ display: 'flex', gap: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignIítems: 'center' }}>
              <div style={{
                width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                background: m.done ? 'var(--color-accent)' : 'var(--color-bg-4)',
                border: `2px solid ${m.done ? 'var(--color-accent)' : 'var(--color-border)'}`,
                marginTop: 16,
              }} />
              {i < arr.length - 1 && <div style={{ width: 2, flex: 1, background: m.done ? 'var(--color-accent-dim)' : 'var(--color-border)', minHeight: 20 }} />}
            </div>
            <div style={{ padding: '12px 0', flex: 1 }}>
              <div style={{ fontSize: 11, color: m.done ? 'var(--color-accent)' : 'var(--color-text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{m.date}</div>
              <div style={{ fontWeight: 600, fontSize: 14, color: m.done ? 'var(--color-text)' : 'var(--color-text-2)' }}>{m.title}</div>
            </div>
          </div>
        ))}
      </div>
    </ClientLayout>
  );
}
