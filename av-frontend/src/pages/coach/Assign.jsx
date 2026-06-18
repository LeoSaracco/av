/**
 * @file Panel de asignación de rutinas a clientes con grilla de cards,
 *       buscador global, y modal unificado para asignar y reasignar.
 * @route /coach/assign
 * @auth Requiere rol "coach".
 */
import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CoachLayout } from '../../components/layout/CoachLayout';
import { inlineSpinnerStyle } from '../../utils/spinnerStyle';
import { Modal } from '../../components/ui/Modals';

export default function Assign() {
  const { clients, routines, assignRoutine, getAssignmentForClient, getRoutine } = useApp();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalClientId, setModalClientId] = useState('');
  const [modalRoutineId, setModalRoutineId] = useState('');
  const [reason, setReason] = useState('');
  const [observations, setObservations] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [saveError, setSaveError] = useState('');

  const isCambiar = !!(modalClientId && modalRoutineId);

  const openModal = (clientId, routineId) => {
    setModalClientId(clientId || '');
    setModalRoutineId(routineId || '');
    setReason('');
    setObservations('');
    setSaveError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    if (assigning) return;
    setModalOpen(false);
    setModalClientId('');
    setModalRoutineId('');
    setReason('');
    setObservations('');
    setSaveError('');
  };

  const modalClient = clients.find(c => c.id === modalClientId);
  const modalRoutine = routines.find(r => r.id === modalRoutineId);
  const existingAssignment = modalClientId ? getAssignmentForClient(modalClientId) : null;
  const existingRoutine = existingAssignment ? getRoutine(existingAssignment.routineId) : null;
  const isReassign = !!existingRoutine;

  const handleAssign = async () => {
    if (!modalClientId || !modalRoutineId) return;
    if (isReassign && !reason) return;
    setAssigning(true);
    setSaveError('');
    try {
      await assignRoutine(modalClientId, modalRoutineId, undefined, reason || undefined, observations || undefined);
      closeModal();
    } catch (err) {
      setSaveError(err.message || 'Error al asignar rutina');
    } finally {
      setAssigning(false);
    }
  };

  const filteredClients = useMemo(() => {
    if (!search) return clients;
    const q = search.toLowerCase();
    return clients.filter(c => {
      if (c.name.toLowerCase().includes(q)) return true;
      const assignment = getAssignmentForClient(c.id);
      if (!assignment) return false;
      const routine = getRoutine(assignment.routineId);
      return routine?.name?.toLowerCase().includes(q);
    });
  }, [clients, search, getAssignmentForClient, getRoutine]);

  const sortedClients = useMemo(() => {
    return [...filteredClients].sort((a, b) => {
      const aHas = !!getAssignmentForClient(a.id);
      const bHas = !!getAssignmentForClient(b.id);
      if (aHas && !bHas) return -1;
      if (!aHas && bHas) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [filteredClients, getAssignmentForClient]);

  return (
    <CoachLayout>
      <div className="page-header">
        <div>
          <h1>Asignación de rutinas</h1>
          <p>Asigná rutinas a tus clientes y editalas de forma independiente</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-bar" style={{ maxWidth: 380, flex: 1 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-3)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input placeholder="Buscar cliente o rutina..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={() => openModal('', '')}>
          + Asignar rutina
        </button>
      </div>

      {sortedClients.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: 48 }}>📋</span>
          <h3>{clients.length === 0 ? 'Sin clientes' : 'Sin resultados'}</h3>
          <p>{clients.length === 0 ? 'Creá clientes desde la sección Clientes.' : 'Probá con otro término de búsqueda.'}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {sortedClients.map(c => {
            const assignment = getAssignmentForClient(c.id);
            const routine = assignment ? getRoutine(assignment.routineId) : null;
            return (
              <div key={c.id} className="card" style={{ gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="avatar" style={{ width: 40, height: 40, fontSize: 14, flexShrink: 0 }}>
                    {c.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontFamily: 'var(--font-main)', fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.email}</div>
                  </div>
                </div>

                {routine ? (
                  <>
                    <div style={{ background: 'var(--color-bg-3)', borderRadius: 'var(--radius-sm)', padding: '12px' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-accent)', marginBottom: 4 }}>
                        💪 {routine.name}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
                        {routine.exercises?.slice(0, 3).map(e => (
                          <span key={e.id} style={{ fontSize: 10, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '2px 6px', color: 'var(--color-text-2)' }}>{e.name}</span>
                        ))}
                        {(routine.exercises?.length || 0) > 3 && (
                          <span style={{ fontSize: 10, color: 'var(--color-text-3)', padding: '2px 4px' }}>+{routine.exercises.length - 3} más</span>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-3)' }}>
                        {routine.exercises?.length || 0} ejercicios · Asignada {assignment.assignedAt}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-sm btn-primary" onClick={() => openModal(c.id, assignment.routineId)}>
                        Cambiar
                      </button>
                      <AssignedRoutineEditor routine={routine} routineId={assignment.routineId} />
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ padding: '8px 0', fontSize: 13, color: 'var(--color-text-3)', fontStyle: 'italic' }}>
                      Sin rutina asignada
                    </div>
                    <button className="btn btn-sm btn-primary" onClick={() => openModal(c.id, '')}>
                      Asignar
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={closeModal}
        title={isReassign ? 'Reasignar rutina' : 'Asignar rutina'}
        footer={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
            {saveError && <span style={{ fontSize: 12, color: 'var(--color-danger)', marginRight: 'auto', flex: 1 }}>{saveError}</span>}
            <button className="btn btn-ghost" onClick={closeModal} disabled={assigning}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleAssign}
              disabled={assigning || !modalClientId || !modalRoutineId || (isReassign && !reason)}
              style={assigning ? { minWidth: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 } : {}}>
              {assigning ? <div style={inlineSpinnerStyle(18, '#000', 'rgba(0,0,0,0.25)')} /> : 'Guardar'}
            </button>
          </div>
        }>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Cliente *</label>
            <select className="form-input"
              value={modalClientId}
              onChange={e => setModalClientId(e.target.value)}
              disabled={isCambiar}>
              <option value="">— Seleccionar cliente —</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Rutina *</label>
            <select className="form-input"
              value={modalRoutineId}
              onChange={e => setModalRoutineId(e.target.value)}>
              <option value="">— Seleccionar rutina —</option>
              {routines.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>

          {modalClientId && modalRoutineId && (
            <div style={{ background: 'var(--color-accent-dim2)', border: '1px solid rgba(0,255,0,0.15)', borderRadius: 'var(--radius-md)', padding: '14px', fontSize: 13, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {isReassign ? (
                <div style={{ color: 'var(--color-text)', lineHeight: 1.5 }}>
                  💡 <strong>{modalClient?.name}</strong> ya tiene asignada{' '}
                  <strong style={{ color: 'var(--color-accent)' }}>{existingRoutine.name}</strong>.
                  <br />Se reasignará a{' '}
                  <strong style={{ color: 'var(--color-accent)' }}>{modalRoutine?.name}</strong>.
                </div>
              ) : (
                <div style={{ color: 'var(--color-text-2)', lineHeight: 1.5 }}>
                  Se asignará <strong style={{ color: 'var(--color-text)' }}>{modalRoutine?.name}</strong> a{' '}
                  <strong style={{ color: 'var(--color-accent)' }}>{modalClient?.name}</strong>
                </div>
              )}

              {isReassign && (
                <>
                  <div className="form-group" style={{ marginTop: 4 }}>
                    <label className="form-label">Motivo de reasignación *</label>
                    <select className="form-input" value={reason} onChange={e => setReason(e.target.value)}>
                      <option value="">— Seleccionar motivo —</option>
                      <option value="OBJETIVO_CUMPLIDO">Cumplió el objetivo</option>
                      <option value="CAMBIO_ESTRATEGIA">Cambio de estrategia</option>
                      <option value="NO_CUMPLIO">No cumplió el objetivo</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Observaciones (opcional)</label>
                    <textarea className="form-input" rows={2} value={observations}
                      onChange={e => setObservations(e.target.value)}
                      placeholder="Ej: Excelente progreso, pasamos a un split de 4 días..." />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </Modal>
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
    const exercises = Array.isArray(routine.exercises)
      ? routine.exercises
      : (() => { try { return JSON.parse(routine.exercises || '[]'); } catch { return []; } })();
    setForm({ name: routine.name, goal: routine.goal, exercises: exercises.map(e => ({ ...e })) });
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
