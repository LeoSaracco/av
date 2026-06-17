/**
 * @file Gestión de plantillas de dieta base (CRUD). Cada plantilla
 *       contiene nombre, objetivo, indicaciones y comidas/bloques.
 *       Luego pueden asignarse a clientes.
 * @route /coach/diet-templates
 * @auth Requiere rol "coach".
 */
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CoachLayout } from '../../components/layout/CoachLayout';
import { Modal, ConfirmModal } from '../../components/ui/Modals';
import { inlineSpinnerStyle } from '../../utils/spinnerStyle';

export default function DietTemplates() {
  const { dietTemplates, addDietTemplate, updateDietTemplate, deleteDietTemplate, uid } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: '', goal: '', description: '', indications: '',
    meals: [],
  });

  const openAdd = () => {
    setFormData({ name: '', goal: '', description: '', indications: '', meals: [] });
    setEditId(null);
    setSaveError('');
    setModalOpen(true);
  };

  const openEdit = (t) => {
    setFormData({
      name: t.name, goal: t.goal || '', description: t.description || '', indications: t.indications || '',
      meals: t.meals ? [...t.meals] : [],
    });
    setEditId(t.id);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return;
    setSaving(true);
    setSaveError('');
    try {
      if (editId) await updateDietTemplate(editId, formData);
      else await addDietTemplate(formData);
      setModalOpen(false);
    } catch (err) {
      setSaveError(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleAddMeal = () => {
    setFormData(prev => ({
      ...prev,
      meals: [...prev.meals, { id: uid(), name: '', content: '' }]
    }));
  };

  const updateMeal = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      meals: prev.meals.map(m => m.id === id ? { ...m, [field]: value } : m)
    }));
  };

  const removeMeal = (id) => {
    setFormData(prev => ({ ...prev, meals: prev.meals.filter(m => m.id !== id) }));
  };

  return (
    <CoachLayout>
      <div className="page-header">
        <div>
          <h1>Dietas / Nutrición Base</h1>
          <p>Plantillas de nutrición para asignar a clientes</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Nueva Dieta Base</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {dietTemplates.map(t => (
          <div key={t.id} className="card" style={{ gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h3 style={{ fontSize: '18px', paddingRight: '12px' }}>{t.name}</h3>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => openEdit(t)}>Editar</button>
                <button className="btn btn-danger btn-sm" onClick={() => setConfirmId(t.id)}>✕</button>
              </div>
            </div>
            {t.goal && <p style={{ fontSize: '13px', color: 'var(--color-accent)', fontWeight: 600 }}>🎯 {t.goal}</p>}
            {t.description && <p style={{ fontSize: '14px', color: 'var(--color-text-2)', lineHeight: 1.5 }}>{t.description}</p>}
            
            <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--color-text-3)' }}>
              <span>{t.meals?.length || 0} comidas/bloques</span>
              <span>Creado: {t.createdAt}</span>
            </div>
          </div>
        ))}
      </div>

      {dietTemplates.length === 0 && (
        <div className="empty-state">
          <span style={{ fontSize: '48px' }}>🥗</span>
          <h3>Sin plantillas de dietas</h3>
          <p>Creá planes base para luego asignarlos fácilmente.</p>
          <button className="btn btn-primary" onClick={openAdd}>Crear plantilla</button>
        </div>
      )}

      {/* Modal CRUD */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Editar Dieta' : 'Nueva Dieta'}
        footer={
          <>
            {saveError && <span style={{ fontSize: 12, color: 'var(--color-danger)', marginRight: 'auto' }}>{saveError}</span>}
            <button className="btn btn-ghost" onClick={() => setModalOpen(false)} disabled={saving}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={saving ? { minWidth: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 } : {}}>
              {saving ? <div style={inlineSpinnerStyle(18, '#000', 'rgba(0,0,0,0.25)')} /> : 'Guardar dieta'}
            </button>
          </>
        }>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Nombre de la dieta</label>
            <input className="form-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Ej: Déficit Calórico Moderado" />
          </div>
          <div className="form-group">
            <label className="form-label">Objetivo</label>
            <input className="form-input" value={formData.goal} onChange={e => setFormData({ ...formData, goal: e.target.value })} placeholder="Ej: Bajar % de grasa" />
          </div>
          <div className="form-group">
            <label className="form-label">Descripción</label>
            <textarea className="form-input" rows={2} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Indicaciones generales (Tips)</label>
            <textarea className="form-input" rows={3} value={formData.indications} onChange={e => setFormData({ ...formData, indications: e.target.value })} placeholder="Recomendaciones de agua, cocción, etc." />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Comidas / Bloques</label>
              <button className="btn btn-sm btn-ghost" onClick={handleAddMeal}>+ Agregar comida</button>
            </div>
            
            {formData.meals.length === 0 && <p style={{ fontSize: '13px', color: 'var(--color-text-3)', textAlign: 'center', padding: '12px' }}>No hay comidas agregadas</p>}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {formData.meals.map((m, i) => (
                <div key={m.id} style={{ background: 'var(--color-bg-3)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>
                      {i + 1}
                    </div>
                    <input className="form-input form-input-sm" style={{ flex: 1 }} value={m.name} onChange={e => updateMeal(m.id, 'name', e.target.value)} placeholder="Ej: Almuerzo" />
                    <button className="btn btn-sm btn-danger" onClick={() => removeMeal(m.id)}>✕</button>
                  </div>
                  <div>
                    <textarea className="form-input form-input-sm" rows={2} value={m.content} onChange={e => updateMeal(m.id, 'content', e.target.value)} placeholder="Ej: 150g pollo + ensalada..." />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmModal open={!!confirmId} onClose={() => { if (!deleting) setConfirmId(null); }}
        onConfirm={async () => {
          setDeleting(true);
          try { await deleteDietTemplate(confirmId); } catch { /* toast already shown */ }
          setDeleting(false);
          setConfirmId(null);
        }}
        title="Eliminar plantilla" message="¿Estás seguro de eliminar esta plantilla de dieta? No afectará a las dietas ya asignadas."
        confirmDisabled={deleting}
        confirmLabel={deleting ? <div style={inlineSpinnerStyle(16, '#fff', 'rgba(255,255,255,0.25)')} /> : 'Eliminar'} />
    </CoachLayout>
  );
}
