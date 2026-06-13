/**
 * @file Dashboard principal del coach. Muestra estadísticas de dietas,
 *       rutinas, templates y asignaciones, junto con los últimos clientes,
 *       observaciones recientes y accesos rápidos a acciones frecuentes.
 * @route /coach
 * @auth Requiere rol "coach".
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { CoachLayout } from '../../components/layout/CoachLayout';

/**
 * Dashboard principal del coach.
 * Muestra estadísticas resumidas (dietas, rutinas, templates, asignaciones),
 * los últimos clientes, observaciones recientes y accesos rápidos a las
 * acciones más frecuentes desde el panel de coach.
 *
 * @returns {JSX.Element} Vista completa del dashboard del coach.
 */
export default function CoachDashboard() {
  const { clients, routines, templates, assignments, notes, dietTemplates } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();

  const assignedCount = assignments.filter(a => a.active).length;
  const recentNotes = notes.slice(-3).reverse();

  const statusCounts = clients.reduce((acc, c) => {
    const s = c.status || 'sin estado';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const statusCards = [
    { status: 'activo', label: 'Activos', color: 'var(--color-accent)', bg: 'var(--color-accent-dim)', count: statusCounts['activo'] || 0 },
    { status: 'pausado', label: 'Pausados', color: 'var(--color-warning)', bg: 'rgba(255, 184, 0, 0.15)', count: statusCounts['pausado'] || 0 },
    { status: 'inactivo', label: 'Inactivos', color: 'var(--color-text-3)', bg: 'var(--color-surface-2)', count: statusCounts['inactivo'] || 0 },
  ];

  const clientActivityData = [
    { month: 'Ene', activos: 2 },
    { month: 'Feb', activos: 3 },
    { month: 'Mar', activos: 4 },
    { month: 'Abr', activos: 5 },
    { month: 'May', activos: 4 },
    { month: 'Jun', activos: assignedCount },
  ];

  const stats = [
    { label: 'Dietas Base', value: dietTemplates?.length || 0, icon: '🥗', path: '/coach/diet-templates' },
    { label: 'Rutinas', value: routines.length, icon: '💪', path: '/coach/routines' },
    { label: 'Templates', value: templates.length, icon: '📋', path: '/coach/templates' },
    { label: 'Asignadas', value: assignedCount, icon: '🔗', path: '/coach/assign' },
  ];

  // ── Render ──────────────────────────────────────────────────────────────────
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
            <div style={{ display: 'flex', alignIítems: 'center', justifyContent: 'space-between' }}>
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

      {/* Client activity chart */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, marginBottom: 16 }}>Clientes activos por mes</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={clientActivityData} margin={{ top: 4, right: 4, left: -20, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-text-3)' }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: 'var(--color-text-3)' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text)',
                fontSize: 13,
              }}
              cursor={{ fill: 'var(--color-accent-dim2)' }}
            />
            <Bar dataKey="activos" fill="rgb(0, 255, 0)" radius={[6, 6, 0, 0]} maxBarSize={40} name="Clientes activos" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Client status distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
        {statusCards.map(s => (
          <div
            key={s.status}
            style={{
              background: s.bg,
              border: `1px solid ${s.color}`,
              borderRadius: 'var(--radius-lg)',
              padding: '18px 16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              transition: 'var(--transition)',
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-main)', color: s.color }}>
              {s.count}
            </div>
            <div style={{ fontSize: 12, color: s.color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {/* Recent clients */}
        <div className="card">
          <div style={{ display: 'flex', alignIítems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
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
                    display: 'flex', alignIítems: 'center', gap: 12,
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
          <div style={{ display: 'flex', alignIítems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16 }}>Úúúltimas observaciones</h3>
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignIítems: 'center' }}>
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

        {/* Quick actions */}
        <div className="card">
          <h3 style={{ fontSize: 16, marginBottom: 16 }}>Acciones rápidas</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { emoji: '👤', label: 'Nuevo cliente', path: '/coach/clients', action: 'add' },
              { emoji: '📋', label: 'Nuevo template', path: '/coach/templates' },
              { emoji: '🥗', label: 'Dieta base', path: '/coach/diet-templates' },
              { emoji: '💪', label: 'Nueva rutina', path: '/coach/routines' },
              { emoji: '🔗', label: 'Asignar rutina', path: '/coach/assign' },
            ].map(a => (
              <button key={a.label}
                onClick={() => navigate(a.path)}
                style={{
                  display: 'flex', alignIítems: 'center', gap: 12, padding: '12px 14px',
                  background: 'var(--color-bg-3)', border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'var(--transition)',
                  color: 'var(--color-text)', fontFamily: 'var(--font-body)', textAlign: 'left',
                  width: '100%',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-surface)'; e.currentTarget.style.borderColor = 'var(--color-accent)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-bg-3)'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
              >
                <span style={{ fontSize: 20 }}>{a.emoji}</span>
                <span style={{ fontWeight: 500, fontSize: 14 }}>{a.label}</span>
                <span style={{ marginLeft: 'auto', color: 'var(--color-text-3)' }}>→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </CoachLayout>
  );
}
