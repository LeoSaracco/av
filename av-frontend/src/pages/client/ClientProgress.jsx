/**
 * @file Registro y seguimiento del progreso de peso del cliente. Incluye
 *       grafico de evolucion (Recharts), estadisticas de resumen,
 *       historial cronologico y alta/baja de registros.
 * @route /client/progress
 * @auth Requiere rol "client".
 */
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { ClientLayout } from '../../components/layout/ClientLayout';
import { Modal, ConfirmModal } from '../../components/ui/Modals';
import Loader from '../../components/ui/Loader';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '8px 12px', fontSize: 12 }}>
        <p style={{ color: 'var(--color-text-2)' }}>{label}</p>
        <p style={{ color: 'var(--color-accent)', fontWeight: 700, fontSize: 15 }}>{payload[0].value} kg</p>
      </div>
    );
  }
  return null;
}

const emptyForm = () => ({ date: new Date().toISOString().slice(0, 10), weight: '', comment: '' });

export default function ClientProgress() {
  const { user } = useAuth();
  const { getClient, getProgressForClient, addProgress, deleteProgress, loadError } = useApp();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [weightError, setWeightError] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const client = getClient(user?.clientId);
  const progress = client ? getProgressForClient(client.id) : [];

  const openModal = () => { setForm(emptyForm()); setWeightError(''); setModal(true); };
  const closeModal = () => { setModal(false); setWeightError(''); };

  const handleSave = async () => {
    if (!form.weight || isNaN(parseFloat(form.weight))) {
      setWeightError('Ingresa un peso valido');
      return;
    }
    setSaving(true);
    try {
      await addProgress(client.id, { date: form.date, weight: parseFloat(form.weight), comment: form.comment });
      closeModal();
    } catch {
      // toast handled by context
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    setDeleting(true);
    try {
      await deleteProgress(confirmDeleteId);
      setConfirmDeleteId(null);
    } catch {
      // toast handled by context
    } finally {
      setDeleting(false);
    }
  };

  const firstWeight = progress.length > 0 ? progress[0].weight : null;
  const lastWeight = progress.length > 0 ? progress[progress.length - 1].weight : null;
  const weightDiff = firstWeight && lastWeight ? (lastWeight - firstWeight).toFixed(1) : null;
  const minW = progress.length > 0 ? Math.min(...progress.map(p => p.weight)) : 0;
  const maxW = progress.length > 0 ? Math.max(...progress.map(p => p.weight)) : 0;

  const chartData = progress.map(p => ({ ...p, date: p.date.slice(5) }));

  return (
    <ClientLayout>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>Mi evolucion</div>
          <h1 style={{ fontSize: 22 }}>Progreso de peso</h1>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openModal}>+ Registrar</button>
      </div>

      {loadError && (
        <div style={{ background: 'rgba(255,59,59,0.1)', border: '1px solid rgba(255,59,59,0.3)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: 13, color: 'var(--color-error)', marginBottom: 20 }}>
          {loadError}
        </div>
      )}

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

      {progress.length >= 2 && (
        <div className="card" style={{ marginBottom: 20, padding: '20px 8px 12px' }}>
          <h3 style={{ fontSize: 14, marginBottom: 16, paddingLeft: 12 }}>Evolucion de peso</h3>
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

      {progress.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: 48 }}>📊</span>
          <h3>Sin registros</h3>
          <p>Registra tu peso hoy para comenzar a ver tu evolucion</p>
          <button className="btn btn-primary" onClick={openModal}>+ Registrar ahora</button>
        </div>
      ) : (
        <div>
          <h3 style={{ fontSize: 14, color: 'var(--color-text-2)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Historial</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[...progress].reverse().map((p, i) => {
              const prev = progress[progress.length - 2 - i];
              const diff = prev ? (p.weight - prev.weight).toFixed(1) : null;
              const diffNum = diff !== null ? parseFloat(diff) : null;
              const accentColor = diffNum !== null && diffNum < 0 ? 'var(--color-accent)' : diffNum !== null && diffNum > 0 ? 'var(--color-warning)' : 'var(--color-border)';

              return (
                <div key={p.id} style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderLeft: `3px solid ${accentColor}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  position: 'relative',
                  transition: 'var(--transition)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {new Date(p.date + 'T00:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <button onClick={() => setConfirmDeleteId(p.id)} style={{ background: 'none', border: 'none', color: 'var(--color-text-3)', cursor: 'pointer', fontSize: 16, padding: '2px 4px', lineHeight: 1 }} title="Eliminar registro">✕</button>
                  </div>
                  <div style={{ display: 'flex', gap: 24, marginBottom: p.comment ? 8 : 0 }}>
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-main)', color: 'var(--color-accent)' }}>{p.weight}</div>
                      <div style={{ fontSize: 10, color: 'var(--color-text-3)', marginTop: 2 }}>kg</div>
                    </div>
                    {diff !== null && (
                      <div>
                        <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-main)', color: diffNum < 0 ? 'var(--color-accent)' : diffNum > 0 ? 'var(--color-warning)' : 'var(--color-text-3)' }}>
                          {diffNum > 0 ? '+' : ''}{diff}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--color-text-3)', marginTop: 2 }}>kg cambio</div>
                      </div>
                    )}
                  </div>
                  {p.comment && (
                    <p style={{ fontSize: 13, color: 'var(--color-text-2)', margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>
                      {p.comment}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Modal open={modal} onClose={closeModal}
        title="Nuevo registro de peso"
        footer={
          <>
            <button className="btn btn-ghost" onClick={closeModal} disabled={saving}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ minWidth: 120 }}>
              {saving ? <Loader size="sm" /> : 'Guardar registro'}
            </button>
          </>
        }>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Fecha</label>
            <input className="form-input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Peso (kg) *</label>
            <input className="form-input" type="number" step="0.1" min="30" max="200" placeholder="Ej: 72.5" value={form.weight} onChange={e => { setForm(f => ({ ...f, weight: e.target.value })); setWeightError(''); }} />
            {weightError && <span style={{ fontSize: 12, color: 'var(--color-error)', marginTop: 4, display: 'block' }}>{weightError}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Comentario</label>
            <textarea className="form-input" rows={3} placeholder="Como te sentiste hoy, observaciones..." value={form.comment} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))} />
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={handleDelete}
        title="Eliminar registro"
        message="Seguro que queres eliminar este registro de peso? No se puede deshacer."
        confirmLabel={deleting ? <Loader size="sm" /> : 'Eliminar'}
        confirmDisabled={deleting}
      />
    </ClientLayout>
  );
}
