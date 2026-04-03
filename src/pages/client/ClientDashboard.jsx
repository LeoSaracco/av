import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { ClientLayout } from '../../components/layout/ClientLayout';

export default function ClientDashboard() {
  const { user } = useAuth();
  const { getClient, getAssignmentForClient, getRoutine, getNotesForClient, getProgressForClient } = useApp();
  const navigate = useNavigate();

  const client = getClient(user?.clientId);
  const assignment = client ? getAssignmentForClient(client.id) : null;
  const routine = assignment ? getRoutine(assignment.routineId) : null;
  const notes = client ? getNotesForClient(client.id) : [];
  const progress = client ? getProgressForClient(client.id) : [];
  const latestNote = notes[0];
  const lastWeight = progress.length > 0 ? progress[progress.length - 1] : null;
  const firstWeight = progress.length > 0 ? progress[0] : null;
  const weightDiff = lastWeight && firstWeight ? (lastWeight.weight - firstWeight.weight).toFixed(1) : null;

  return (
    <ClientLayout>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: 'var(--color-text-2)' }}>Bienvenido de nuevo 👋</div>
        <h1 style={{ fontSize: 26, marginTop: 4 }}>{user?.name?.split(' ')[0]}</h1>
        {client?.goal && (
          <p style={{ fontSize: 13, color: 'var(--color-text-2)', marginTop: 6, lineHeight: 1.5 }}>
            🎯 {client.goal}
          </p>
        )}
      </div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 20 }}>
        <div className="stat-card">
          <div style={{ fontSize: 24 }}>💪</div>
          <div className="stat-value" style={{ fontSize: 20 }}>{routine?.exercises?.length || 0}</div>
          <div className="stat-label">Ejercicios</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: 24 }}>📊</div>
          <div className="stat-value" style={{ fontSize: 20 }}>{progress.length}</div>
          <div className="stat-label">Registros</div>
        </div>
        {weightDiff !== null && (
          <div className="stat-card" style={{ gridColumn: '1 / -1' }}>
            <div style={{ fontSize: 24 }}>{parseFloat(weightDiff) < 0 ? '📉' : '📈'}</div>
            <div className="stat-value" style={{ fontSize: 20, color: parseFloat(weightDiff) < 0 ? 'var(--color-accent)' : 'var(--color-warning)' }}>
              {parseFloat(weightDiff) > 0 ? '+' : ''}{weightDiff} kg
            </div>
            <div className="stat-label">Desde el inicio</div>
          </div>
        )}
      </div>

      {/* Routine card */}
      <div
        className="card card-hover"
        style={{ gap: 14, marginBottom: 16, cursor: 'pointer' }}
        onClick={() => navigate('/client/routine')}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: 15 }}>💪 Mi rutina</h3>
          <span style={{ color: 'var(--color-accent)', fontSize: 18 }}>→</span>
        </div>
        {routine ? (
          <>
            <div>
              <div style={{ fontWeight: 700, fontFamily: 'var(--font-main)', fontSize: 16 }}>{routine.name}</div>
              <div style={{ fontSize: 12, color: 'var(--color-accent)', marginTop: 4, fontWeight: 600 }}>{routine.goal}</div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {routine.exercises?.slice(0, 4).map(e => (
                <span key={e.id} style={{ fontSize: 11, background: 'var(--color-bg-3)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '3px 8px', color: 'var(--color-text-2)' }}>
                  {e.name}
                </span>
              ))}
              {(routine.exercises?.length || 0) > 4 && (
                <span style={{ fontSize: 11, color: 'var(--color-text-3)', padding: '3px 4px' }}>+{routine.exercises.length - 4} más</span>
              )}
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: '100%' }} />
            </div>
            <p style={{ fontSize: 12, color: 'var(--color-accent)', fontWeight: 600 }}>Ver rutina completa →</p>
          </>
        ) : (
          <p style={{ color: 'var(--color-text-3)', fontSize: 14 }}>Tu coach aún no te asignó una rutina.</p>
        )}
      </div>

      {/* Latest note */}
      {latestNote && (
        <div className="card" style={{ gap: 10, marginBottom: 16, cursor: 'pointer' }} onClick={() => navigate('/client/notes')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: 15 }}>📝 Última observación del coach</h3>
            <span style={{ color: 'var(--color-accent)', fontSize: 16 }}>→</span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--color-text-2)', lineHeight: 1.6, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
            {latestNote.text}
          </p>
          <span style={{ fontSize: 11, color: 'var(--color-text-3)' }}>{latestNote.createdAt}</span>
        </div>
      )}

      {/* Progress CTA */}
      <div
        className="card"
        style={{ gap: 12, cursor: 'pointer', background: 'linear-gradient(135deg, rgba(0,255,0,0.08), transparent)', border: '1px solid rgba(0,255,0,0.2)' }}
        onClick={() => navigate('/client/progress')}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: 15 }}>📊 Registrar progreso</h3>
          <span style={{ color: 'var(--color-accent)', fontSize: 16 }}>→</span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--color-text-2)' }}>
          {lastWeight ? `Último registro: ${lastWeight.weight} kg el ${lastWeight.date}` : 'Registrá tu peso y comentarios de hoy.'}
        </p>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-accent)' }}>Agregar registro →</span>
      </div>
    </ClientLayout>
  );
}
