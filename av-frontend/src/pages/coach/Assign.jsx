/**
 * @file Panel de asignación de rutinas a clientes. Incluye selector de
 *       cliente/rutina, vista de asignaciones actuales y editor inline
 *       para rutinas ya asignadas.
 * @route /coach/assign
 * @auth Requiere rol "coach".
 */
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CoachLayout } from '../../components/layout/CoachLayout';
import { inlineSpinnerStyle } from '../../utils/spinnerStyle';
import { Modal } from '../../components/ui/Modals';

export default function Assign() {
  const { clients, routines, assignRoutine, getAssignmentForClient, getRoutine } = useApp();
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedRoutine, setSelectedRoutine] = useState('');
  const [success, setSuccess] = useState(false);

  const handleAssign = () => {
    if (!selectedClient || !selectedRoutine) return;
    assignRoutine(selectedClient, selectedRoutine);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <CoachLayout>
      <div className="page-header">
        <div>
          <h1>Asignación de rutinas</h1>
          <p>Asigná rutinas a tus clientes y editalas de forma independiente</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        {/* Assign panel */}
        <div className="card" style={{ gap: 20 }}>
          <h3 style={{ fontSize: 16 }}>🔗 Asignar nueva rutina</h3>
          <div className="form-group">
            <label className="form-label">Cliente</label>
            <select className="form-input" value={selectedClient} onChange={e => setSelectedClient(e.target.value)}>
              <option value="">— Seleccionar cliente —</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Rutina</label>
            <select className="form-input" value={selectedRoutine} onChange={e => setSelectedRoutine(e.target.value)}>
              <option value="">— Seleccionar rutina —</option>
              {routines.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          {selectedClient && selectedRoutine && (
            <div style={{ background: 'var(--color-accent-dim2)', border: '1px solid rgba(0,255,0,0.15)', borderRadius: 'var(--radius-md)', padding: '12px 14px', fontSize: 13 }}>
              <div style={{ color: 'var(--color-text-2)' }}>
                Se asignará <strong style={{ color: 'var(--color-text)' }}>{routines.find(r => r.id === selectedRoutine)?.name}</strong> a{' '}
                <strong style={{ color: 'var(--color-accent)' }}>{clients.find(c => c.id === selectedClient)?.name}</strong>
              </div>
              {getAssignmentForClient(selectedClient) && (
                <div style={{ marginTop: 6, color: 'var(--color-warning)', fontSize: 12 }}>
                  ⚠ Este cliente ya tiene una rutina asignada. Se reemplazará.
                </div>
              )}
            </div>
          )}
          <button
            className="btn btn-primary"
            disabled={!selectedClient || !selectedRoutine}
            style={{ opacity: (!selectedClient || !selectedRoutine) ? 0.5 : 1 }}
            onClick={handleAssign}
          >
            Asignar rutina
          </button>
          {success && (
            <div style={{ background: 'var(--color-accent-dim)', border: '1px solid rgba(0,255,0,0.3)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: 13, color: 'var(--color-accent)' }}>
              ✓ Rutina asignada correctamente
            </div>
          )}
        </div>

        {/* Current assignments */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h3 style={{ fontSize: 16 }}>📋 Asignaciones actuales</h3>
          {clients.map(c => {
            const assignment = getAssignmentForClient(c.id);
            const routine = assignment ? getRoutine(assignment.routineId) : null;
            return (
              <div key={c.id} className="card" style={{ gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="avatar" style={{ width: 36, height: 36, fontSize: 13 }}>
                    {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontFamily: 'var(--font-main)', fontSize: 14 }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-3)' }}>{c.email}</div>
                  </div>
                  <span className={`badge ${c.status === 'activo' ? 'badge-success' : 'badge-warning'}`}>{c.status}</span>
                </div>

                {routine ? (
                  <div style={{ background: 'var(--color-bg-3)', borderRadius: 'var(--radius-sm)', padding: '10px 12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-accent)', marginBottom: 2 }}>
                          💪 {routine.name}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-3)' }}>
                          {routine.exercises?.length} ejercicios · Asignada el {assignment.assignedAt}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: 13, color: 'var(--color-text-3)', fontStyle: 'italic', padding: '4px 0' }}>
                    Sin rutina asignada
                  </div>
                )}

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="btn btn-sm btn-ghost"
                    onClick={() => { setSelectedClient(c.id); }}
                  >
                    {routine ? 'Cambiar' : 'Asignar'}
                  </button>
                  {routine && (
                    <AssignedRoutineEditor clientId={c.id} routine={routine} routineId={assignment.routineId} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </CoachLayout>
  );
}

// ── Inline editor for assigned routine ─────────────────────────────────────────
function AssignedRoutineEditor({ routine, routineId }) {
  const { updateRoutine } = useApp();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const openEdit = () => {
    setForm({ name: routine.name, goal: routine.goal, exercises: routine.exercises.map(e => ({ ...e })) });
    setOpen(true);
  };

  const updateEx = (idx, field, val) => setForm(f => ({
    ...f,
    exercises: f.exercises.map((e, i) => i === idx ? { ...e, [field]: field === 'sets' || field === 'reps' ? Number(val) : val } : e)
  }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateRoutine(routineId, form);
      setOpen(false);
    } catch { /* ignore */ } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button className="btn btn-sm btn-secondary" onClick={openEdit}>Editar rutina</button>
      <Modal open={open} onClose={() => setOpen(false)}
        title={`Editar rutina de ${routine.name}`}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setOpen(false)} disabled={saving}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={saving ? { minWidth: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 } : {}}>
              {saving ? <div style={inlineSpinnerStyle(18, '#000', 'rgba(0,0,0,0.25)')} /> : 'Guardar'}
            </button>
          </>
        }>
        {form && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: 'rgba(0,255,0,0.06)', border: '1px solid rgba(0,255,0,0.15)', borderRadius: 'var(--radius-sm)', padding: '8px 12px', fontSize: 12, color: 'var(--color-accent)' }}>
              ✓ Editás la rutina asignada. El template original no se modifica.
            </div>
            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Objetivo</label>
              <input className="form-input" value={form.goal} onChange={e => setForm(f => ({ ...f, goal: e.target.value }))} />
            </div>
            {form.exercises.map((ex, idx) => (
              <div key={ex.id || idx} style={{ background: 'var(--color-bg-3)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 12 }}>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>{ex.name}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: 11 }}>Series</label>
                    <input className="form-input" type="number" min={1} value={ex.sets} onChange={e => updateEx(idx, 'sets', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: 11 }}>Reps</label>
                    <input className="form-input" type="number" min={1} value={ex.reps} onChange={e => updateEx(idx, 'reps', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: 11 }}>Descanso</label>
                    <input className="form-input" value={ex.rest} onChange={e => updateEx(idx, 'rest', e.target.value)} />
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: 8 }}>
                  <label className="form-label" style={{ fontSize: 11 }}>Notas</label>
                  <input className="form-input" value={ex.notes} onChange={e => updateEx(idx, 'notes', e.target.value)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </>
  );
}
