/**
 * @file Panel de asignación de rutinas a clientes con grilla de cards
 *       y formulario full-page con steps para asignar/reasignar rutinas.
 * @route /coach/assign
 * @auth Requiere rol "coach".
 */
import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CoachLayout } from '../../components/layout/CoachLayout';
import { inlineSpinnerStyle } from '../../utils/spinnerStyle';

function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 480);
  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < 480);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return mobile;
}

function InlineSearch({ options, value, onChange, placeholder }) {
  const [filter, setFilter] = useState('');
  const selected = options.find(o => o.id === value);
  const filtered = options.filter(o =>
    !filter || o.label.toLowerCase().includes(filter.toLowerCase())
  );

  if (value && selected) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--color-accent-dim2)', border: '1px solid rgba(0,255,0,0.15)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-main)' }}>{selected.label}</div>
          {selected.subtitle && <div style={{ fontSize: 12, color: 'var(--color-text-3)', marginTop: 2 }}>{selected.subtitle}</div>}
        </div>
        <button className="btn btn-sm btn-ghost" onClick={() => { onChange(''); setFilter(''); }}>Cambiar</button>
      </div>
    );
  }

  return (
    <div>
      <input className="form-input" placeholder={placeholder} value={filter} onChange={e => setFilter(e.target.value)} autoFocus />
      <div style={{ maxHeight: 260, overflowY: 'auto', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', marginTop: 8, background: 'var(--color-surface)' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 14, fontSize: 13, color: 'var(--color-text-3)', textAlign: 'center' }}>Sin resultados</div>
        ) : filtered.map(o => (
          <div key={o.id} onClick={() => { onChange(o.id); setFilter(''); }}
            style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid var(--color-border)', fontSize: 14, lineHeight: 1.3 }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-bg-3)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
            {o.label}
            {o.subtitle && <div style={{ fontSize: 12, color: 'var(--color-text-3)', marginTop: 2 }}>{o.subtitle}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function StepIndicator({ steps, current, mobile }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: mobile ? 6 : 12,
      marginBottom: mobile ? 16 : 20, padding: '0 8px', userSelect: 'none',
    }}>
      {steps.map((label, i) => (
        <React.Fragment key={label}>
          <div style={{
            fontSize: mobile ? 11 : 13,
            fontWeight: current === i ? 700 : 400,
            color: current === i ? 'var(--color-accent)' : i < current ? 'var(--color-text-2)' : 'var(--color-text-3)',
            fontFamily: 'var(--font-main)',
            textAlign: 'center',
          }}>
            {current === i ? '●' : '○'}<br />{label}
          </div>
          {i < steps.length - 1 && (
            <div style={{
              flex: 1, height: 2, maxWidth: mobile ? 24 : 48,
              background: i < current ? 'var(--color-accent)' : 'var(--color-border)',
              borderRadius: 1, marginTop: -8,
            }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

const EMPTY_EX = { name: '', sets: 3, reps: 10, rest: '60s', notes: '' };

export default function Assign() {
  const { clients, routines, assignRoutine, addRoutine, getAssignmentForClient, getRoutine } = useApp();
  const isMobile = useIsMobile();

  const [search, setSearch] = useState('');
  const [view, setView] = useState('grid');
  const [mode, setMode] = useState('assign');
  const [step, setStep] = useState(0);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedRoutineId, setSelectedRoutineId] = useState('');
  const [existingRoutineId, setExistingRoutineId] = useState('');
  const [exerciseForm, setExerciseForm] = useState({ name: '', goal: '', exercises: [] });
  const [originalSnapshot, setOriginalSnapshot] = useState('');
  const [reason, setReason] = useState('');
  const [observations, setObservations] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [newExerciseId, setNewExerciseId] = useState('');

  const selectedClient = clients.find(c => c.id === selectedClientId);
  const selectedRoutine = routines.find(r => r.id === selectedRoutineId);
  const existingRoutine = existingRoutineId ? getRoutine(existingRoutineId) : null;

  const steps = mode === 'reassign'
    ? ['Socio', 'Rutina', 'Ejercicios', 'Motivo']
    : ['Socio', 'Rutina', 'Ejercicios', 'Confirmar'];
  const isLastStep = step === steps.length - 1;

  const clientOptions = useMemo(() =>
    clients.map(c => ({ id: c.id, label: c.name, subtitle: c.email })), [clients]);
  const routineOptions = useMemo(() =>
    routines.map(r => ({ id: r.id, label: r.name, subtitle: `${r.exercises?.length || 0} ejercicios` })), [routines]);

  const openForm = (clientId = '', routineId = '') => {
    setView('form');
    setMode(routineId ? 'reassign' : 'assign');
    setSelectedClientId(clientId);
    setSelectedRoutineId('');
    setExistingRoutineId(routineId);
    setExerciseForm({ name: '', goal: '', exercises: [] });
    setOriginalSnapshot('');
    setReason('');
    setObservations('');
    setSaveError('');
    setNewExerciseId('');
    setStep(clientId ? 1 : 0);
  };

  const closeForm = () => {
    setView('grid');
    setStep(0);
    setSelectedClientId('');
    setSelectedRoutineId('');
    setExistingRoutineId('');
    setExerciseForm({ name: '', goal: '', exercises: [] });
    setOriginalSnapshot('');
    setReason('');
    setObservations('');
    setSaveError('');
    setNewExerciseId('');
  };

  const handleRoutineSelect = (routineId) => {
    setSelectedRoutineId(routineId);
    if (routineId) {
      const r = routines.find(rt => rt.id === routineId);
      if (r) {
        const exercises = (r.exercises || []).map(e => ({ ...e }));
        setExerciseForm({ name: r.name, goal: r.goal || '', exercises });
        setOriginalSnapshot(JSON.stringify({ name: r.name, goal: r.goal || '', exercises: r.exercises || [] }));
      }
    } else {
      setExerciseForm({ name: '', goal: '', exercises: [] });
      setOriginalSnapshot('');
    }
  };

  const addExercise = () => {
    const id = Date.now().toString();
    setExerciseForm(f => ({ ...f, exercises: [{ ...EMPTY_EX, id }, ...f.exercises] }));
    setNewExerciseId(id);
  };
  const updateExercise = (idx, field, val) => setExerciseForm(f => ({
    ...f,
    exercises: f.exercises.map((e, i) => i === idx ? { ...e, [field]: field === 'sets' || field === 'reps' ? Number(val) : val } : e)
  }));
  const removeExercise = (idx) => setExerciseForm(f => ({ ...f, exercises: f.exercises.filter((_, i) => i !== idx) }));

  const canAdvance = (() => {
    if (step === 0) return !!selectedClientId;
    if (step === 1) return !!selectedRoutineId;
    if (step === 2) return exerciseForm.exercises.length > 0;
    if (step === 3 && mode === 'reassign') return !!reason;
    return true;
  })();

  const nextStep = () => { if (canAdvance && step < steps.length - 1) { setSaveError(''); setStep(s => s + 1); } };
  const prevStep = () => { if (step > 0) { setSaveError(''); setStep(s => s - 1); } };

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    try {
      const current = JSON.stringify({ name: exerciseForm.name, goal: exerciseForm.goal, exercises: exerciseForm.exercises });
      const modified = current !== originalSnapshot;
      let routineIdToAssign = selectedRoutineId;
      if (modified) {
        const newRoutine = await addRoutine({
          name: exerciseForm.name,
          goal: exerciseForm.goal,
          exercises: exerciseForm.exercises,
          templateId: selectedRoutine?.templateId || null,
        });
        routineIdToAssign = newRoutine.id;
      }
      await assignRoutine(selectedClientId, routineIdToAssign, undefined, reason || undefined, observations || undefined);
      closeForm();
    } catch (err) {
      setSaveError(err.message || 'Error al asignar rutina');
    } finally {
      setSaving(false);
    }
  };

  const filteredClients = useMemo(() => {
    if (!search) return clients;
    const q = search.toLowerCase();
    return clients.filter(c => {
      if (c.name.toLowerCase().includes(q)) return true;
      const a = getAssignmentForClient(c.id);
      if (!a) return false;
      const r = getRoutine(a.routineId);
      return r?.name?.toLowerCase().includes(q);
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

  // ── Form view ────────────────────────────────────────────────────────────────
  if (view === 'form') {
    const showPrev = mode === 'reassign' ? step > 1 : step > 0;
    return (
      <CoachLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
          <button className="btn btn-ghost" onClick={closeForm} style={{ fontSize: 14 }}>← Volver a asignaciones</button>
          <h2 style={{ fontSize: 18, fontFamily: 'var(--font-main)', margin: 0 }}>{mode === 'reassign' ? 'Reasignar rutina' : 'Asignar rutina'}</h2>
        </div>

        <StepIndicator steps={steps} current={step} mobile={isMobile} />

        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          {step === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={{ fontSize: 13, color: 'var(--color-text-2)', margin: 0 }}>Buscá el socio al que querés asignarle una rutina</p>
              <InlineSearch options={clientOptions} value={selectedClientId} onChange={setSelectedClientId} placeholder="🔍 Buscar socio..." />
            </div>
          )}

          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 13, color: 'var(--color-accent)', fontWeight: 600 }}>👤 {selectedClient?.name}</div>
              {mode === 'reassign' && existingRoutine && (
                <div style={{ background: 'rgba(255,200,0,0.08)', border: '1px solid rgba(255,200,0,0.2)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', fontSize: 12, color: 'var(--color-warning)' }}>
                  ⚠ Rutina anterior: {existingRoutine.name} — será reemplazada
                </div>
              )}
              <p style={{ fontSize: 13, color: 'var(--color-text-2)', margin: 0 }}>{mode === 'reassign' ? 'Elegí la nueva rutina base' : 'Elegí la rutina base'}</p>
              <InlineSearch options={routineOptions} value={selectedRoutineId} onChange={handleRoutineSelect} placeholder="🔍 Buscar rutina..." />
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: 13, color: 'var(--color-accent)', fontWeight: 600 }}>👤 {selectedClient?.name} · 💪 {selectedRoutine?.name}</div>
              <div style={{ background: 'rgba(0,150,255,0.06)', border: '1px solid rgba(0,150,255,0.15)', borderRadius: 'var(--radius-sm)', padding: '8px 12px', fontSize: 12, color: 'var(--color-text-2)' }}>
                ℹ Personalizá la rutina para este socio. El template original no se modifica.
              </div>
              <div className="form-group">
                <label className="form-label">Nombre rutina</label>
                <input className="form-input" value={exerciseForm.name} onChange={e => setExerciseForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Objetivo</label>
                <input className="form-input" placeholder="Ej: Ganar masa muscular" value={exerciseForm.goal} onChange={e => setExerciseForm(f => ({ ...f, goal: e.target.value }))} />
              </div>
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>Ejercicios ({exerciseForm.exercises.length})</span>
                  <button className="btn btn-sm btn-secondary" onClick={addExercise}>+ Agregar</button>
                </div>
                {exerciseForm.exercises.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--color-text-3)', fontSize: 13 }}>Sin ejercicios. Agregá el primero.</div>
                )}
                {exerciseForm.exercises.map((ex, idx) => {
                  const isNew = ex.id === newExerciseId && newExerciseId !== '';
                  return (
                  <div key={ex.id || idx} style={{
                    background: isNew ? 'var(--color-accent-dim2)' : 'var(--color-bg-3)',
                    border: isNew ? '1px solid rgba(0,255,0,0.2)' : '1px solid var(--color-border)',
                    borderLeft: isNew ? '3px solid var(--color-accent)' : '3px solid transparent',
                    borderRadius: 'var(--radius-md)', padding: 14, marginBottom: 10, transition: 'border-color 0.3s ease, background 0.3s ease',
                  }}>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 10, alignItems: 'center' }}>
                      {isNew && <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>Nuevo</span>}
                      <input className="form-input" style={{ flex: 1 }} placeholder="Nombre del ejercicio" value={ex.name} onChange={e => updateExercise(idx, 'name', e.target.value)} />
                      <button className="btn btn-sm btn-danger" onClick={() => removeExercise(idx)}>✕</button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                      <div className="form-group"><label className="form-label" style={{ fontSize: 11 }}>Series</label><input className="form-input" type="number" min={1} value={ex.sets} onChange={e => updateExercise(idx, 'sets', e.target.value)} /></div>
                      <div className="form-group"><label className="form-label" style={{ fontSize: 11 }}>Reps</label><input className="form-input" type="number" min={1} value={ex.reps} onChange={e => updateExercise(idx, 'reps', e.target.value)} /></div>
                      <div className="form-group"><label className="form-label" style={{ fontSize: 11 }}>Descanso</label><input className="form-input" placeholder="60s" value={ex.rest} onChange={e => updateExercise(idx, 'rest', e.target.value)} /></div>
                    </div>
                    <div className="form-group" style={{ marginTop: 8 }}><label className="form-label" style={{ fontSize: 11 }}>Notas</label><input className="form-input" placeholder="Clave técnica, variante..." value={ex.notes} onChange={e => updateExercise(idx, 'notes', e.target.value)} /></div>
                  </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && mode === 'reassign' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: 'var(--color-accent-dim2)', border: '1px solid rgba(0,255,0,0.15)', borderRadius: 'var(--radius-md)', padding: '14px', fontSize: 13, lineHeight: 1.5 }}>
                💡 {existingRoutine?.name} → <strong style={{ color: 'var(--color-accent)' }}>{exerciseForm.name}</strong>
              </div>
              <div className="form-group">
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
                <textarea className="form-input" rows={3} value={observations} onChange={e => setObservations(e.target.value)}
                  placeholder="Ej: Excelente progreso, pasamos a un split de 4 días..." />
              </div>
            </div>
          )}

          {step === 3 && mode === 'assign' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: 'var(--color-accent-dim2)', border: '1px solid rgba(0,255,0,0.15)', borderRadius: 'var(--radius-md)', padding: '14px', fontSize: 13 }}>
                <div style={{ fontWeight: 600, fontFamily: 'var(--font-main)', marginBottom: 4 }}>👤 {selectedClient?.name}</div>
                <div style={{ fontWeight: 600 }}>💪 {exerciseForm.name}</div>
                <div style={{ color: 'var(--color-text-3)', marginTop: 4 }}>
                  {exerciseForm.exercises.length} ejercicios{exerciseForm.exercises.length > 0 && ` · ${exerciseForm.exercises.slice(0, 3).map(e => e.name).filter(Boolean).join(', ')}${exerciseForm.exercises.length > 3 ? `, +${exerciseForm.exercises.length - 3} más` : ''}`}
                </div>
              </div>
            </div>
          )}

          {saveError && <div style={{ fontSize: 12, color: 'var(--color-danger)', marginTop: 12 }}>{saveError}</div>}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
            <div>{showPrev && <button className="btn btn-ghost" onClick={prevStep} disabled={saving}>← Anterior</button>}</div>
            <div>
              {!isLastStep ? (
                <button className="btn btn-primary" onClick={nextStep} disabled={!canAdvance}>Siguiente →</button>
              ) : (
                <button className="btn btn-primary" onClick={handleSave} disabled={saving || !canAdvance}
                  style={saving ? { minWidth: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 } : {}}>
                  {saving ? <div style={inlineSpinnerStyle(18, '#000', 'rgba(0,0,0,0.25)')} /> : 'Guardar'}
                </button>
              )}
            </div>
          </div>
        </div>
      </CoachLayout>
    );
  }

  // ── Grid view ────────────────────────────────────────────────────────────────
  return (
    <CoachLayout>
      <div className="page-header">
        <div>
          <h1>Asignación de rutinas</h1>
          <p>Asigná rutinas a tus clientes y personalizalas para cada uno</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-bar" style={{ maxWidth: 380, flex: 1 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-3)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input placeholder="Buscar cliente o rutina..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={() => openForm('', '')}>+ Asignar rutina</button>
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
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-accent)', marginBottom: 4 }}>💪 {routine.name}</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
                        {routine.exercises?.slice(0, 3).map(e => (
                          <span key={e.id} style={{ fontSize: 10, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '2px 6px', color: 'var(--color-text-2)' }}>{e.name}</span>
                        ))}
                        {(routine.exercises?.length || 0) > 3 && <span style={{ fontSize: 10, color: 'var(--color-text-3)', padding: '2px 4px' }}>+{routine.exercises.length - 3} más</span>}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-3)' }}>{routine.exercises?.length || 0} ejercicios · Asignada {assignment.assignedAt}</div>
                    </div>
                    <button className="btn btn-sm btn-primary" onClick={() => openForm(c.id, assignment.routineId)}>Cambiar</button>
                  </>
                ) : (
                  <>
                    <div style={{ padding: '8px 0', fontSize: 13, color: 'var(--color-text-3)', fontStyle: 'italic' }}>Sin rutina asignada</div>
                    <button className="btn btn-sm btn-primary" onClick={() => openForm(c.id, '')}>Asignar</button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </CoachLayout>
  );
}
