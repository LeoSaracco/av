import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { ClientLayout } from '../../components/layout/ClientLayout';

export default function ClientRoutine() {
  const { user } = useAuth();
  const { getClient, getAssignmentForClient, getRoutine } = useApp();
  const [expanded, setExpanded] = useState(null);

  const client = getClient(user?.clientId);
  const assignment = client ? getAssignmentForClient(client.id) : null;
  const routine = assignment ? getRoutine(assignment.routineId) : null;

  if (!routine) return (
    <ClientLayout>
      <div className="empty-state" style={{ minHeight: '60vh' }}>
        <span style={{ fontSize: 56 }}>💪</span>
        <h3>Sin rutina asignada</h3>
        <p>Tu coach aún no te asignó una rutina. En breve estará disponible.</p>
      </div>
    </ClientLayout>
  );

  return (
    <ClientLayout>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>Mi rutina activa</div>
        <h1 style={{ fontSize: 22, lineHeight: 1.2 }}>{routine.name}</h1>
        {routine.goal && (
          <div style={{ marginTop: 8 }}>
            <span className="badge badge-success">{routine.goal}</span>
          </div>
        )}
        <p style={{ fontSize: 13, color: 'var(--color-text-3)', marginTop: 8 }}>
          {routine.exercises?.length} ejercicios · Asignada el {assignment.assignedAt}
        </p>
      </div>

      {/* Exercise list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {routine.exercises?.map((ex, i) => (
          <div
            key={ex.id}
            style={{
              background: 'var(--color-surface)', border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)', overflow: 'hidden',
              transition: 'var(--transition)',
              ...(expanded === i ? { borderColor: 'rgba(0,255,0,0.3)' } : {}),
            }}
          >
            {/* Exercise header — always visible */}
            <div
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', cursor: 'pointer' }}
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              <div style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                background: expanded === i ? 'var(--color-accent)' : 'var(--color-accent-dim2)',
                color: expanded === i ? '#000' : 'var(--color-accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 14, fontFamily: 'var(--font-main)',
                transition: 'var(--transition)',
              }}>{i + 1}</div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontFamily: 'var(--font-main)', fontSize: 15 }}>{ex.name}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-3)', marginTop: 2 }}>
                  {ex.sets} series × {ex.reps} reps · {ex.rest} descanso
                </div>
              </div>

              <div style={{ color: 'var(--color-text-3)', transition: 'transform 0.2s', transform: expanded === i ? 'rotate(180deg)' : 'none' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>

            {/* Expanded params */}
            {expanded === i && (
              <div style={{ padding: '0 16px 16px', animation: 'fadeIn 0.2s ease' }}>
                <div className="divider" style={{ marginTop: 0, marginBottom: 14 }} />
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: ex.notes ? 14 : 0 }}>
                  {[
                    { label: 'Series', value: ex.sets },
                    { label: 'Repeticiones', value: ex.reps },
                    { label: 'Descanso', value: ex.rest },
                  ].map(p => (
                    <div key={p.label} className="exercise-param" style={{ minWidth: 80, flex: 1 }}>
                      <span className="exercise-param-value" style={{ fontSize: 20 }}>{p.value}</span>
                      <span className="exercise-param-label">{p.label}</span>
                    </div>
                  ))}
                </div>
                {ex.notes && (
                  <div style={{
                    background: 'var(--color-bg-3)', borderRadius: 'var(--radius-sm)',
                    padding: '10px 12px', marginTop: 12,
                    borderLeft: '3px solid var(--color-accent)',
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Nota del coach</div>
                    <p style={{ fontSize: 13, color: 'var(--color-text-2)', lineHeight: 1.6 }}>{ex.notes}</p>
                  </div>
                )}
                {ex.videoUrl && (
                  <a href={ex.videoUrl} target="_blank" rel="noopener noreferrer"
                    className="btn btn-ghost btn-sm" style={{ marginTop: 10 }}>
                    🎬 Ver video del ejercicio
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </ClientLayout>
  );
}
