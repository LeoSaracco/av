import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CoachLayout } from '../../components/layout/CoachLayout';
import { Modal, ConfirmModal } from '../../components/ui/Modals';

export default function Routines() {
  const { routines, templates, addRoutine, updateRoutine, deleteRoutine, duplicateRoutine, createRoutineFromTemplate } = useApp();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: '', goal: '', exercises: [] });
  const [editId, setEditId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [fromTemplate, setFromTemplate] = useState('');
  const [viewRoutine, setViewRoutine] = useState(null);

  const filtered = routines.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.goal?.toLowerCase().includes(search.toLowerCase())
  );

  const EMPTY_EX = { name: '', sets: 3, reps: 10, rest: '60s', notes: '', videoUrl: '' };

  const openAdd = () => { setForm({ name: '', goal: '', exercises: [] }); setEditId(null); setFromTemplate(''); setModal('form'); };
  const openEdit = (r) => {
    setForm({ name: r.name, goal: r.goal, exercises: r.exercises.map(e => ({ ...e })) });
    setEditId(r.id); setModal('form');
  };

  const handleTemplateSelect = (tplId) => {
    setFromTemplate(tplId);
    if (tplId) {
      const tpl = templates.find(t => t.id === tplId);
      if (tpl) setForm(f => ({ ...f, name: `${tpl.name} – copia`, goal: tpl.goal, exercises: tpl.exercises.map(e => ({ ...e, id: Date.now().toString() + Math.random() })) }));
    } else {
      setForm(f => ({ ...f, exercises: [] }));
    }
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editId) updateRoutine(editId, form);
    else addRoutine({ ...form, templateId: fromTemplate || null });
    setModal(null);
  };

  const addExercise = () => setForm(f => ({ ...f, exercises: [...f.exercises, { ...EMPTY_EX, id: Date.now().toString() }] }));
  const updateExercise = (idx, field, val) => setForm(f => ({
    ...f,
    exercises: f.exercises.map((e, i) => i === idx ? { ...e, [field]: field === 'sets' || field === 'reps' ? Number(val) : val } : e)
  }));
  const removeExercise = (idx) => setForm(f => ({ ...f, exercises: f.exercises.filter((_, i) => i !== idx) }));
  const moveExercise = (idx, dir) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= form.exercises.length) return;
    setForm(f => {
      const exs = [...f.exercises];
      [exs[idx], exs[newIdx]] = [exs[newIdx], exs[idx]];
      return { ...f, exercises: exs };
    });
  };

  return (
    <CoachLayout>
      <div className="page-header">
        <div>
          <h1>Rutinas</h1>
          <p>{routines.length} rutinas · {templates.length} templates disponibles</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Nueva rutina</button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div className="search-bar" style={{ maxWidth: 380 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-3)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input placeholder="Buscar rutinas..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: 48 }}>💪</span>
          <h3>No hay rutinas</h3>
          <p>Creá una rutina desde cero o desde un template</p>
          <button className="btn btn-primary" onClick={openAdd}>+ Crear rutina</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {filtered.map(r => {
            const tpl = r.templateId ? templates.find(t => t.id === r.templateId) : null;
            return (
              <div key={r.id} className="card card-hover" style={{ gap: 14 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <h3 style={{ fontSize: 15, fontFamily: 'var(--font-main)', lineHeight: 1.3, flex: 1 }}>{r.name}</h3>
                    <span className="badge badge-neutral">{r.exercises?.length || 0} ej.</span>
                  </div>
                  {r.goal && <p style={{ fontSize: 12, color: 'var(--color-accent)', fontWeight: 600, marginTop: 4 }}>{r.goal}</p>}
                  {tpl && <p style={{ fontSize: 11, color: 'var(--color-text-3)', marginTop: 4 }}>📋 Desde: {tpl.name}</p>}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {r.exercises?.slice(0, 4).map(e => (
                    <span key={e.id} style={{ fontSize: 11, background: 'var(--color-bg-3)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '3px 8px', color: 'var(--color-text-2)' }}>
                      {e.name}
                    </span>
                  ))}
                  {(r.exercises?.length || 0) > 4 && <span style={{ fontSize: 11, color: 'var(--color-text-3)', padding: '3px 4px' }}>+{r.exercises.length - 4} más</span>}
                </div>

                <p style={{ fontSize: 11, color: 'var(--color-text-3)' }}>Creada: {r.createdAt}</p>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button className="btn btn-sm btn-ghost" onClick={() => setViewRoutine(r)}>Ver</button>
                  <button className="btn btn-sm btn-ghost" onClick={() => openEdit(r)}>Editar</button>
                  <button className="btn btn-sm btn-secondary" onClick={() => duplicateRoutine(r.id)} title="Duplicar">⧉ Duplicar</button>
                  <button className="btn btn-sm btn-danger" onClick={() => setConfirmId(r.id)}>✕</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View Modal */}
      <Modal open={!!viewRoutine} onClose={() => setViewRoutine(null)} title={viewRoutine?.name}
        footer={<button className="btn btn-primary" onClick={() => setViewRoutine(null)}>Cerrar</button>}>
        {viewRoutine && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <span className="badge badge-success">{viewRoutine.goal}</span>
            {viewRoutine.exercises?.map((ex, i) => (
              <div key={ex.id} className="exercise-card">
                <div className="exercise-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--color-accent-dim)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{i + 1}</div>
                    <span className="exercise-name">{ex.name}</span>
                  </div>
                </div>
                <div className="exercise-params">
                  <div className="exercise-param"><span className="exercise-param-value">{ex.sets}</span><span className="exercise-param-label">Series</span></div>
                  <div className="exercise-param"><span className="exercise-param-value">{ex.reps}</span><span className="exercise-param-label">Reps</span></div>
                  <div className="exercise-param"><span className="exercise-param-value">{ex.rest}</span><span className="exercise-param-label">Descanso</span></div>
                </div>
                {ex.notes && <p style={{ fontSize: 12, color: 'var(--color-text-2)', fontStyle: 'italic' }}>📝 {ex.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Add/Edit Modal */}
      <Modal open={modal === 'form'} onClose={() => setModal(null)}
        title={editId ? 'Editar rutina' : 'Nueva rutina'}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSave}>{editId ? 'Guardar' : 'Crear rutina'}</button>
          </>
        }>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!editId && (
            <div className="form-group">
              <label className="form-label">Crear desde template (opcional)</label>
              <select className="form-input" value={fromTemplate} onChange={e => handleTemplateSelect(e.target.value)}>
                <option value="">— Desde cero —</option>
                {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Nombre de la rutina *</label>
            <input className="form-input" placeholder="Ej: Full Body – Martina" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Objetivo</label>
            <input className="form-input" placeholder="Ej: Ganar masa muscular" value={form.goal} onChange={e => setForm(f => ({ ...f, goal: e.target.value }))} />
          </div>
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>Ejercicios ({form.exercises.length})</span>
              <button className="btn btn-sm btn-secondary" onClick={addExercise}>+ Agregar</button>
            </div>
            {form.exercises.length === 0 && (
              <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--color-text-3)', fontSize: 13 }}>Sin ejercicios. Agregá el primero.</div>
            )}
            {form.exercises.map((ex, idx) => (
              <div key={idx} style={{ background: 'var(--color-bg-3)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 14, marginBottom: 10 }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 10, alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <button style={{ background: 'none', border: 'none', color: 'var(--color-text-3)', cursor: 'pointer', padding: '1px 4px', fontSize: 12 }} onClick={() => moveExercise(idx, -1)}>▲</button>
                    <button style={{ background: 'none', border: 'none', color: 'var(--color-text-3)', cursor: 'pointer', padding: '1px 4px', fontSize: 12 }} onClick={() => moveExercise(idx, 1)}>▼</button>
                  </div>
                  <input className="form-input" style={{ flex: 1 }} placeholder="Nombre del ejercicio" value={ex.name} onChange={e => updateExercise(idx, 'name', e.target.value)} />
                  <button className="btn btn-sm btn-danger" onClick={() => removeExercise(idx)}>✕</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: 11 }}>Series</label>
                    <input className="form-input" type="number" min={1} value={ex.sets} onChange={e => updateExercise(idx, 'sets', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: 11 }}>Reps</label>
                    <input className="form-input" type="number" min={1} value={ex.reps} onChange={e => updateExercise(idx, 'reps', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: 11 }}>Descanso</label>
                    <input className="form-input" placeholder="60s" value={ex.rest} onChange={e => updateExercise(idx, 'rest', e.target.value)} />
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: 8 }}>
                  <label className="form-label" style={{ fontSize: 11 }}>Notas</label>
                  <input className="form-input" placeholder="Clave técnica, variante..." value={ex.notes} onChange={e => updateExercise(idx, 'notes', e.target.value)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      <ConfirmModal open={!!confirmId} onClose={() => setConfirmId(null)}
        onConfirm={() => deleteRoutine(confirmId)}
        title="Eliminar rutina" message="¿Eliminar esta rutina? Las asignaciones existentes se perderán." />
    </CoachLayout>
  );
}
