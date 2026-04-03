import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CoachLayout } from '../../components/layout/CoachLayout';
import { Modal, ConfirmModal } from '../../components/ui/Modals';

const EMPTY_EX = { name: '', sets: 3, reps: 10, rest: '60s', notes: '', videoUrl: '' };
const EMPTY_TPL = { name: '', goal: '', description: '', exercises: [] };

export default function Templates() {
  const { templates, addTemplate, updateTemplate, deleteTemplate } = useApp();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_TPL);
  const [editId, setEditId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [viewId, setViewId] = useState(null);

  const filtered = templates.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.goal.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm({ ...EMPTY_TPL, exercises: [] }); setEditId(null); setModal('form'); };
  const openEdit = (t) => {
    setForm({ name: t.name, goal: t.goal, description: t.description || '', exercises: t.exercises.map(e => ({ ...e })) });
    setEditId(t.id); setModal('form');
  };
  const openView = (t) => { setViewId(t.id); setModal('view'); };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editId) updateTemplate(editId, form);
    else addTemplate(form);
    setModal(null);
  };

  const addExercise = () => setForm(f => ({ ...f, exercises: [...f.exercises, { ...EMPTY_EX, id: Date.now().toString() }] }));
  const updateExercise = (idx, field, val) => setForm(f => ({
    ...f,
    exercises: f.exercises.map((e, i) => i === idx ? { ...e, [field]: field === 'sets' || field === 'reps' ? Number(val) : val } : e)
  }));
  const removeExercise = (idx) => setForm(f => ({ ...f, exercises: f.exercises.filter((_, i) => i !== idx) }));

  const viewTemplate = templates.find(t => t.id === viewId);

  return (
    <CoachLayout>
      <div className="page-header">
        <div>
          <h1>Templates de rutinas</h1>
          <p>{templates.length} templates creados</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Nuevo template</button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div className="search-bar" style={{ maxWidth: 380 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-3)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input placeholder="Buscar templates..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: 48 }}>📋</span>
          <h3>No hay templates</h3>
          <p>Creá tu primer template para reutilizarlo en múltiples rutinas</p>
          <button className="btn btn-primary" onClick={openAdd}>+ Crear template</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {filtered.map(t => (
            <div key={t.id} className="card card-hover" style={{ gap: 14, cursor: 'pointer' }} onClick={() => openView(t)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontFamily: 'var(--font-main)', fontSize: 16, marginBottom: 4 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-accent)', fontWeight: 600 }}>{t.goal}</div>
                </div>
                <span className="badge badge-neutral">{t.exercises.length} ej.</span>
              </div>
              {t.description && (
                <p style={{ fontSize: 13, color: 'var(--color-text-2)', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {t.description}
                </p>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {t.exercises.slice(0, 3).map(e => (
                  <span key={e.id} style={{ fontSize: 11, background: 'var(--color-bg-3)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '3px 8px', color: 'var(--color-text-2)' }}>
                    {e.name}
                  </span>
                ))}
                {t.exercises.length > 3 && (
                  <span style={{ fontSize: 11, color: 'var(--color-text-3)', padding: '3px 4px' }}>+{t.exercises.length - 3} más</span>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }} onClick={e => e.stopPropagation()}>
                <button className="btn btn-sm btn-ghost" onClick={() => openEdit(t)}>Editar</button>
                <button className="btn btn-sm btn-danger" onClick={() => setConfirmId(t.id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Modal */}
      <Modal open={modal === 'view'} onClose={() => setModal(null)} title={viewTemplate?.name}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => { openEdit(viewTemplate); }}>Editar</button>
            <button className="btn btn-primary" onClick={() => setModal(null)}>Cerrar</button>
          </>
        }>
        {viewTemplate && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <span className="badge badge-success">{viewTemplate.goal}</span>
              {viewTemplate.description && <p style={{ marginTop: 10, fontSize: 14, color: 'var(--color-text-2)', lineHeight: 1.6 }}>{viewTemplate.description}</p>}
            </div>
            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-text-2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {viewTemplate.exercises.length} Ejercicios
            </div>
            {viewTemplate.exercises.map((ex, i) => (
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
        title={editId ? 'Editar template' : 'Nuevo template'}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSave}>{editId ? 'Guardar' : 'Crear template'}</button>
          </>
        }>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Nombre del template *</label>
            <input className="form-input" placeholder="Ej: Full Body Hipertrofia 3x" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Objetivo</label>
            <input className="form-input" placeholder="Ej: Ganar masa muscular" value={form.goal} onChange={e => setForm(f => ({ ...f, goal: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Descripción</label>
            <textarea className="form-input" rows={2} placeholder="Descripción del template..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>

          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>Ejercicios ({form.exercises.length})</span>
              <button className="btn btn-sm btn-secondary" onClick={addExercise}>+ Agregar ejercicio</button>
            </div>
            {form.exercises.length === 0 && (
              <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--color-text-3)', fontSize: 13 }}>
                No hay ejercicios. Agregá el primero.
              </div>
            )}
            {form.exercises.map((ex, idx) => (
              <div key={idx} style={{ background: 'var(--color-bg-3)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 14, marginBottom: 10 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
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
                  <label className="form-label" style={{ fontSize: 11 }}>Notas / clave técnica</label>
                  <input className="form-input" placeholder="Notas opcionales..." value={ex.notes} onChange={e => updateExercise(idx, 'notes', e.target.value)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      <ConfirmModal open={!!confirmId} onClose={() => setConfirmId(null)}
        onConfirm={() => deleteTemplate(confirmId)}
        title="Eliminar template" message="¿Eliminar este template? Las rutinas creadas desde él no se verán afectadas." />
    </CoachLayout>
  );
}
