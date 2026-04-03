import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { ClientLayout } from '../../components/layout/ClientLayout';
import { Modal } from '../../components/ui/Modals';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ClientProgress() {
  const { user } = useAuth();
  const { getClient, getProgressForClient, addProgress, deleteProgress } = useApp();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), weight: '', comment: '' });

  const client = getClient(user?.clientId);
  const progress = client ? getProgressForClient(client.id) : [];

  const handleSave = () => {
    if (!form.weight || isNaN(parseFloat(form.weight))) return;
    addProgress(client.id, { date: form.date, weight: parseFloat(form.weight), comment: form.comment });
    setModal(false);
    setForm({ date: new Date().toISOString().slice(0, 10), weight: '', comment: '' });
  };

  const firstWeight = progress.length > 0 ? progress[0].weight : null;
  const lastWeight = progress.length > 0 ? progress[progress.length - 1].weight : null;
  const weightDiff = firstWeight && lastWeight ? (lastWeight - firstWeight).toFixed(1) : null;
  const minW = progress.length > 0 ? Math.min(...progress.map(p => p.weight)) : 0;
  const maxW = progress.length > 0 ? Math.max(...progress.map(p => p.weight)) : 0;

  const chartData = progress.map(p => ({ ...p, date: p.date.slice(5) })); // MM-DD format

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '8px 12px', fontSize: 12 }}>
          <p style={{ color: 'var(--color-text-2)' }}>{label}</p>
          <p style={{ color: 'var(--color-accent)', fontWeight: 700, fontSize: 15 }}>{payload[0].value} kg</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ClientLayout>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>Mi evolución</div>
          <h1 style={{ fontSize: 22 }}>Progreso de peso</h1>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setModal(true)}>+ Registrar</button>
      </div>

      {/* Summary stats */}
      {progress.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'Inicial', value: `${firstWeight} kg`, color: 'var(--color-text-2)' },
            { label: 'Actual', value: `${lastWeight} kg`, color: 'var(--color-accent)' },
            { label: 'Cambio', value: `${parseFloat(weightDiff) > 0 ? '+' : ''}${weightDiff} kg`, color: parseFloat(weightDiff) < 0 ? 'var(--color-accent)' : 'var(--color-warning)' },
          ].map(s => (
            <div key={s.label} className="stat-card" style={{ padding: '14px 12px', gap: 6, alignItems: 'center', textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 800, fontFamily: 'var(--font-main)', color: s.color }}>{s.value}</div>
              <div className="stat-label" style={{ fontSize: 10 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      {progress.length >= 2 && (
        <div className="card" style={{ marginBottom: 20, padding: '20px 8px 12px' }}>
          <h3 style={{ fontSize: 14, marginBottom: 16, paddingLeft: 12 }}>Evolución de peso</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#606060' }} />
              <YAxis domain={[minW - 1, maxW + 1]} tick={{ fontSize: 11, fill: '#606060' }} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone" dataKey="weight"
                stroke="rgb(0,255,0)" strokeWidth={2.5}
                dot={{ fill: 'rgb(0,255,0)', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#fff', stroke: 'rgb(0,255,0)', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* History */}
      {progress.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: 48 }}>📊</span>
          <h3>Sin registros</h3>
          <p>Registrá tu peso hoy para comenzar a ver tu evolución</p>
          <button className="btn btn-primary" onClick={() => setModal(true)}>+ Registrar ahora</button>
        </div>
      ) : (
        <div>
          <h3 style={{ fontSize: 14, color: 'var(--color-text-2)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Historial</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[...progress].reverse().map((p, i) => {
              const prev = progress[progress.length - 2 - i];
              const diff = prev ? (p.weight - prev.weight).toFixed(1) : null;
              return (
                <div key={p.id} className="card" style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: '14px 16px' }}>
                  <div style={{ textAlign: 'center', minWidth: 56 }}>
                    <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-main)', color: 'var(--color-accent)' }}>{p.weight}</div>
                    <div style={{ fontSize: 10, color: 'var(--color-text-3)' }}>kg</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{p.date}</div>
                    {p.comment && <p style={{ fontSize: 12, color: 'var(--color-text-2)', marginTop: 2 }}>{p.comment}</p>}
                  </div>
                  {diff !== null && (
                    <div style={{ fontSize: 12, fontWeight: 700, color: parseFloat(diff) < 0 ? 'var(--color-accent)' : parseFloat(diff) > 0 ? 'var(--color-warning)' : 'var(--color-text-3)' }}>
                      {parseFloat(diff) > 0 ? '+' : ''}{diff}
                    </div>
                  )}
                  <button onClick={() => deleteProgress(p.id)} style={{ background: 'none', border: 'none', color: 'var(--color-text-3)', cursor: 'pointer', fontSize: 14, padding: 4 }}>✕</button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)}
        title="Nuevo registro de peso"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSave}>Guardar registro</button>
          </>
        }>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Fecha</label>
            <input className="form-input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Peso (kg) *</label>
            <input className="form-input" type="number" step="0.1" min="30" max="200" placeholder="Ej: 72.5" value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Comentario</label>
            <textarea className="form-input" rows={3} placeholder="Cómo te sentiste hoy, observaciones..." value={form.comment} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))} />
          </div>
        </div>
      </Modal>
    </ClientLayout>
  );
}
