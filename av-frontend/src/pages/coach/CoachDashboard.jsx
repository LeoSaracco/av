/**
 * @file Dashboard principal del coach. Muestra estadísticas de dietas,
 *       rutinas, templates y asignaciones, junto con los últimos clientes,
 *       observaciones recientes y accesos rápidos a acciones frecuentes.
 * @route /coach
 * @auth Requiere rol "coach".
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { CoachLayout } from '../../components/layout/CoachLayout';

export default function CoachDashboard() {
  const { clients, routines, templates, assignments, notes, dietTemplates } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();

  const assignedCount = assignments.filter(a => a.active).length;
  const recentNotes = notes.slice(-3).reverse();

  const stats = [
    { label: 'Dietas Base', value: dietTemplates?.length || 0, icon: '🥗', path: '/coach/diet-templates' },
    { label: 'Rutinas', value: routines.length, icon: '💪', path: '/coach/routines' },
    { label: 'Templates', value: templates.length, icon: '📋', path: '/coach/templates' },
    { label: 'Asignadas', value: assignedCount, icon: '🔗', path: '/coach/assign' },
  ];

  return (
    <CoachLayout>
      <div className="page-header">
        <div>
          <h1>¡Buen día, {user?.name?.split(' ')[0]}! 👋</h1>
          <p>Resumen de tu actividad como coach</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/coach/clients')}>
          + Nuevo cliente
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map(s => (
          <div key={s.label} className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate(s.path)}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 28 }}>{s.icon}</span>
              {s.active !== undefined && (
                <span className="badge badge-success">{s.active} activos</span>
              )}
            </div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {/* Recent clients */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16 }}>Clientes recientes</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/coach/clients')}>Ver todos</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {clients.slice(0, 4).map(c => {
              const assignment = assignments.find(a => a.clientId === c.id && a.active);
              const routine = assignment ? routines.find(r => r.id === assignment.routineId) : null;
              return (
                <div key={c.id}
                  onClick={() => navigate(`/coach/clients/${c.id}`)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px', borderRadius: 'var(--radius-md)',
                    background: 'var(--color-bg-3)', cursor: 'pointer',
                    transition: 'var(--transition)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface-2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--color-bg-3)'}
                >
                  <div className="avatar" style={{ width: 36, height: 36, fontSize: 13 }}>
                    {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {routine ? routine.name : 'Sin rutina asignada'}
                    </div>
                  </div>
                  <span className={`badge ${c.status === 'activo' ? 'badge-success' : 'badge-warning'}`}>{c.status}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent notes */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16 }}>Últimas observaciones</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/coach/notes')}>Ver todas</button>
          </div>
          {recentNotes.length === 0 ? (
            <div className="empty-state" style={{ padding: '24px 0' }}>
              <span style={{ fontSize: 32 }}>📝</span>
              <p>No hay observaciones aún</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recentNotes.map(n => {
                const client = clients.find(c => c.id === n.clientId);
                return (
                  <div key={n.id} style={{
                    background: 'var(--color-bg-3)', borderRadius: 'var(--radius-md)',
                    padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-accent)' }}>{client?.name}</span>
                      <span style={{ fontSize: 11, color: 'var(--color-text-3)' }}>{n.createdAt}</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--color-text-2)', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {n.text}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </CoachLayout>
  );
}
