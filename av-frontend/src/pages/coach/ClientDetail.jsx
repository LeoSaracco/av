/**
 * @file Vista detallada de un cliente con pestañas: resumen, rutina,
 *       nutrición (con chat Q&A y asignación/edición de dieta), notas y
 *       progreso de peso.
 * @route /coach/clients/:id
 * @auth Requiere rol "coach".
 */
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { CoachLayout } from '../../components/layout/CoachLayout';
import { Modal, ConfirmModal } from '../../components/ui/Modals';
import { inlineSpinnerStyle } from '../../utils/spinnerStyle';

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getClient, getAssignmentForClient, getRoutine,
    getNotesForClient, addNote, updateNote, deleteNote,
    getProgressForClient,
    dietTemplates, getDietAssignmentForClient, getDiet, createDietFromTemplate, getNutritionThreadForClient, addNutritionMessage, updateDiet, assignDiet
  } = useApp();

  const client = getClient(id);
  const assignment = getAssignmentForClient(id);
  const routine = assignment ? getRoutine(assignment.routineId) : null;
  const notes = getNotesForClient(id);
  const progress = getProgressForClient(id);

  const [tab, setTab] = useState('overview');
  const [noteModal, setNoteModal] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [editNoteId, setEditNoteId] = useState(null);
  const [confirmNoteId, setConfirmNoteId] = useState(null);

  // Nutrition state
  const dietAssignment = getDietAssignmentForClient(id);
  const diet = dietAssignment ? getDiet(dietAssignment.dietId) : null;
  const thread = getNutritionThreadForClient(id);
  const [threadInput, setThreadInput] = useState('');
  const [assignDietModal, setAssignDietModal] = useState(false);
  const [selectedDietTpl, setSelectedDietTpl] = useState('');
  const [editDietModal, setEditDietModal] = useState(false);
  const [editDietForm, setEditDietForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleAssignDiet = async () => {
    setSaving(true);
    try {
      if (selectedDietTpl) {
        const newDiet = createDietFromTemplate(selectedDietTpl, null, null);
        if (newDiet) {
          assignDiet(client.id, newDiet.id);
          setAssignDietModal(false);
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEditDiet = async () => {
    setSaving(true);
    try {
      if (diet && editDietForm) {
        updateDiet(diet.id, editDietForm);
        setEditDietModal(false);
      }
    } finally {
      setSaving(false);
    }
  };

  if (!client) return (
    <CoachLayout>
      <div className="empty-state">
        <span style={{ fontSize: 48 }}>❌</span>
        <h3>Cliente no encontrado</h3>
        <button className="btn btn-primary" onClick={() => navigate('/coach/clients')}>Volver</button>
      </div>
    </CoachLayout>
  );

  const openAddNote = () => { setNoteText(''); setEditNoteId(null); setNoteModal(true); };
  const openEditNote = (n) => { setNoteText(n.text); setEditNoteId(n.id); setNoteModal(true); };
  const handleSaveNote = async () => {
    if (!noteText.trim()) return;
    setSaving(true);
    try {
      if (editNoteId) updateNote(editNoteId, noteText);
      else addNote(id, noteText);
      setNoteModal(false);
    } finally {
      setSaving(false);
    }
  };

  const lastWeight = progress.length > 0 ? progress[progress.length - 1].weight : null;
  const firstWeight = progress.length > 0 ? progress[0].weight : null;
  const weightDiff = lastWeight && firstWeight ? (lastWeight - firstWeight).toFixed(1) : null;

  return (
    <CoachLayout>
      {/* Back */}
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: 20 }} onClick={() => navigate('/coach/clients')}>
        ← Volver a clientes
      </button>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
        <div className="avatar avatar-xl">
          {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: 26 }}>{client.name}</h1>
            <span className={`badge ${client.status === 'activo' ? 'badge-success' : 'badge-warning'}`}>{client.status}</span>
          </div>
          <p style={{ color: 'var(--color-text-2)', marginTop: 4, fontSize: 14 }}>{client.email}</p>
          <p style={{ color: 'var(--color-text-3)', fontSize: 13, marginTop: 2 }}>Desde {client.joinDate}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/coach/assign')}>Asignar rutina</button>
          <button className="btn btn-primary btn-sm" onClick={openAddNote}>+ Nota</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: 24 }}>
        {[
          { id: 'overview', label: 'Resumen' },
          { id: 'routine', label: 'Rutina' },
          { id: 'nutrition', label: 'Nutrición' },
          { id: 'notes', label: `Notas (${notes.length})` },
          { id: 'progress', label: `Progreso (${progress.length})` },
        ].map(t => (
          <button key={t.id} className={`tab-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          <div className="card" style={{ gap: 12 }}>
            <h3 style={{ fontSize: 15 }}>🎯 Objetivo</h3>
            <p style={{ color: 'var(--color-text-2)', fontSize: 14, lineHeight: 1.7 }}>{client.goal || 'Sin objetivo definido'}</p>
          </div>

          <div className="card" style={{ gap: 12 }}>
            <h3 style={{ fontSize: 15 }}>💪 Rutina activa</h3>
            {routine ? (
              <>
                <p style={{ fontWeight: 600, color: 'var(--color-accent)' }}>{routine.name}</p>
                <p style={{ fontSize: 13, color: 'var(--color-text-2)' }}>{routine.exercises?.length} ejercicios · Desde {assignment.assignedAt}</p>
              </>
            ) : (
              <p style={{ color: 'var(--color-text-3)', fontSize: 14 }}>Sin rutina asignada</p>
            )}
            <button className="btn btn-sm btn-ghost" onClick={() => navigate('/coach/assign')}>
              {routine ? 'Cambiar rutina' : 'Asignar rutina'}
            </button>
          </div>

          <div className="card" style={{ gap: 12 }}>
            <h3 style={{ fontSize: 15 }}>📊 Progreso de peso</h3>
            {progress.length > 0 ? (
              <>
                <div style={{ display: 'flex', gap: 20 }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-3)', textTransform: 'uppercase' }}>Inicial</div>
                    <div style={{ fontWeight: 700, fontSize: 20, fontFamily: 'var(--font-main)' }}>{firstWeight} kg</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-3)', textTransform: 'uppercase' }}>Actual</div>
                    <div style={{ fontWeight: 700, fontSize: 20, fontFamily: 'var(--font-main)', color: 'var(--color-accent)' }}>{lastWeight} kg</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-3)', textTransform: 'uppercase' }}>Cambio</div>
                    <div style={{ fontWeight: 700, fontSize: 20, fontFamily: 'var(--font-main)', color: parseFloat(weightDiff) < 0 ? 'var(--color-accent)' : 'var(--color-warning)' }}>
                      {parseFloat(weightDiff) > 0 ? '+' : ''}{weightDiff} kg
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p style={{ color: 'var(--color-text-3)', fontSize: 14 }}>Sin registros de peso</p>
            )}
          </div>

          <div className="card" style={{ gap: 12 }}>
            <h3 style={{ fontSize: 15 }}>📞 Contacto</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--color-text-3)', width: 60 }}>Email:</span>
                <span style={{ fontSize: 13 }}>{client.email}</span>
              </div>
              {client.phone && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: 'var(--color-text-3)', width: 60 }}>Tel:</span>
                  <span style={{ fontSize: 13 }}>{client.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ROUTINE */}
      {tab === 'routine' && (
        <div>
          {!routine ? (
            <div className="empty-state">
              <span style={{ fontSize: 48 }}>💪</span>
              <h3>Sin rutina asignada</h3>
              <button className="btn btn-primary" onClick={() => navigate('/coach/assign')}>Asignar rutina</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h2 style={{ fontSize: 20 }}>{routine.name}</h2>
                  <p style={{ color: 'var(--color-text-2)', fontSize: 13 }}>{routine.goal}</p>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/coach/routines`)}>Ver en rutinas</button>
              </div>
              {routine.exercises?.map((ex, i) => (
                <div key={ex.id} className="exercise-card">
                  <div className="exercise-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--color-accent-dim)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{i + 1}</div>
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
        </div>
      )}

      {/* NUTRITION */}
      {tab === 'nutrition' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {/* Left panel: Diet Details */}
          <div>
            {!diet ? (
              <div className="empty-state">
                <span style={{ fontSize: 48 }}>🥗</span>
                <h3>Sin dieta asignada</h3>
                <button className="btn btn-primary" onClick={() => setAssignDietModal(true)}>Asignar dieta base</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <h2 style={{ fontSize: 20 }}>{diet.name}</h2>
                    <p style={{ color: 'var(--color-text-2)', fontSize: 13 }}>{diet.goal}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-sm btn-ghost" onClick={() => setAssignDietModal(true)}>Cambiar base</button>
                    <button className="btn btn-sm btn-secondary" onClick={() => {
                        setEditDietForm({ name: diet.name, goal: diet.goal, indications: diet.indications, meals: diet.meals.map(m=>({...m})) });
                        setEditDietModal(true);
                      }}>Editar plan</button>
                  </div>
                </div>
                
                {diet.indications && (
                   <div style={{ background: 'var(--color-bg-3)', padding: 12, borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--color-accent)' }}>
                     <h4 style={{ fontSize: 13, textTransform: 'uppercase', color: 'var(--color-text-3)', marginBottom: 4 }}>Indicaciones Generales</h4>
                     <p style={{ fontSize: 14 }}>{diet.indications}</p>
                   </div>
                )}
                
                <h4 style={{ fontSize: 16, marginTop: 8 }}>Comidas / Bloques</h4>
                {diet.meals?.map((m, i) => (
                  <div key={m.id} className="card" style={{ gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{i + 1}</div>
                      <span style={{ fontWeight: 600, fontSize: 15 }}>{m.name}</span>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--color-text-2)', paddingLeft: 34, lineHeight: 1.6 }}>{m.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Right panel: Q&A Thread (only if diet assigned) */}
          {diet && (
            <div className="card" style={{ height: 'fit-content', padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '16px', borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-3)' }}>
                <h3 style={{ fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>💬 Consultas</h3>
                <p style={{ fontSize: 12, color: 'var(--color-text-3)' }}>Historial de seguimiento</p>
              </div>
              
              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 400, overflowY: 'auto' }}>
                {thread.messages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--color-text-3)', fontSize: 13 }}>No hay mensajes aún</div>
                ) : (
                  thread.messages.map(msg => (
                    <div key={msg.id} style={{
                      alignSelf: msg.sender === 'coach' ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                      background: msg.sender === 'coach' ? 'var(--color-accent-dim)' : 'var(--color-surface-2)',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      borderBottomRightRadius: msg.sender === 'coach' ? 0 : 'var(--radius-md)',
                      borderBottomLeftRadius: msg.sender !== 'coach' ? 0 : 'var(--radius-md)',
                    }}>
                      <div style={{ fontSize: 11, color: msg.sender === 'coach' ? 'var(--color-accent)' : 'var(--color-text-3)', marginBottom: 4, fontWeight: 600 }}>
                        {msg.sender === 'coach' ? 'Yo (Coach)' : client.name} • {msg.date}
                      </div>
                      <div style={{ fontSize: 13, lineHeight: 1.5 }}>{msg.text}</div>
                    </div>
                  ))
                )}
              </div>
              
              <div style={{ padding: 12, borderTop: '1px solid var(--color-border)', background: 'var(--color-bg-3)', display: 'flex', gap: 8 }}>
                <input className="form-input" placeholder="Escribir mensaje..." value={threadInput} onChange={e => setThreadInput(e.target.value)} onKeyDown={e => {
                  if (e.key === 'Enter' && threadInput.trim()) {
                    addNutritionMessage(client.id, 'coach', threadInput);
                    setThreadInput('');
                  }
                }} />
                <button className="btn btn-primary" onClick={() => {
                  if (threadInput.trim()) {
                    addNutritionMessage(client.id, 'coach', threadInput);
                    setThreadInput('');
                  }
                }} disabled={!threadInput.trim()}>Enviar</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* NOTES */}
      {tab === 'notes' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button className="btn btn-primary btn-sm" onClick={openAddNote}>+ Nueva observación</button>
          </div>
          {notes.length === 0 ? (
            <div className="empty-state">
              <span style={{ fontSize: 48 }}>📝</span>
              <h3>Sin observaciones</h3>
              <button className="btn btn-primary" onClick={openAddNote}>Agregar observación</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {notes.map(n => (
                <div key={n.id} className="card" style={{ gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: 'var(--color-text-3)' }}>{n.createdAt}</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-sm btn-ghost" onClick={() => openEditNote(n)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => setConfirmNoteId(n.id)}>✕</button>
                    </div>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--color-text-2)', lineHeight: 1.7 }}>{n.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PROGRESS */}
      {tab === 'progress' && (
        <div>
          {progress.length === 0 ? (
            <div className="empty-state">
              <span style={{ fontSize: 48 }}>📊</span>
              <h3>Sin registros de progreso</h3>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[...progress].reverse().map(p => (
                <div key={p.id} className="card" style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                  <div style={{ textAlign: 'center', minWidth: 60 }}>
                    <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-main)', color: 'var(--color-accent)' }}>{p.weight}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-3)' }}>kg</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{p.date}</div>
                    {p.comment && <p style={{ fontSize: 13, color: 'var(--color-text-2)' }}>{p.comment}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Note Modal */}
      <Modal open={noteModal} onClose={() => setNoteModal(false)}
        title={editNoteId ? 'Editar observación' : 'Nueva observación'}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setNoteModal(false)} disabled={saving}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSaveNote} disabled={saving}>
              {saving ? <div style={inlineSpinnerStyle(18, '#000', 'rgba(0,0,0,0.25)')} /> : (editNoteId ? 'Guardar cambios' : 'Agregar')}
            </button>
          </>
        }>
        <div className="form-group">
          <label className="form-label">Observación sobre {client.name}</label>
          <textarea className="form-input" rows={5} placeholder="Escribí tu observación aquí..." value={noteText} onChange={e => setNoteText(e.target.value)} />
        </div>
      </Modal>

      <ConfirmModal open={!!confirmNoteId} onClose={() => setConfirmNoteId(null)}
        onConfirm={async () => { setDeleting(true); try { deleteNote(confirmNoteId); } finally { setDeleting(false); setConfirmNoteId(null); } }}
        confirmDisabled={deleting}
        confirmLabel={deleting ? <div style={inlineSpinnerStyle(18, '#fff', 'rgba(255,255,255,0.25)')} /> : 'Eliminar'}
        title="Eliminar observación" message="¿Eliminar esta observación?" />
        
      {/* Assign Diet Modal */}
      <Modal open={assignDietModal} onClose={() => setAssignDietModal(false)}
        title="Asignar plantilla de dieta"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setAssignDietModal(false)} disabled={saving}>Cancelar</button>
            <button className="btn btn-primary" disabled={!selectedDietTpl || saving} onClick={handleAssignDiet}>
              {saving ? <div style={inlineSpinnerStyle(18, '#000', 'rgba(0,0,0,0.25)')} /> : 'Asignar Dieta'}
            </button>
          </>
        }>
          <div className="form-group">
            <label className="form-label">Seleccionar plantilla</label>
            <select className="form-input" value={selectedDietTpl} onChange={e=>setSelectedDietTpl(e.target.value)}>
              <option value="">-- Sin asignar --</option>
              {dietTemplates.map(t => <option value={t.id} key={t.id}>{t.name}</option>)}
            </select>
          </div>
      </Modal>

      {/* Edit Diet Form Modal */}
      <Modal open={editDietModal} onClose={() => setEditDietModal(false)}
        title="Editar dieta del cliente"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setEditDietModal(false)} disabled={saving}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSaveEditDiet} disabled={saving}>
              {saving ? <div style={inlineSpinnerStyle(18, '#000', 'rgba(0,0,0,0.25)')} /> : 'Guardar'}
            </button>
          </>
        }>
        {editDietForm && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: 'rgba(0,255,0,0.06)', border: '1px solid rgba(0,255,0,0.15)', borderRadius: 'var(--radius-sm)', padding: '8px 12px', fontSize: 12, color: 'var(--color-accent)' }}>
              ✓ Editás la dieta asignada. El template original no se modifica.
            </div>
            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input className="form-input" value={editDietForm.name} onChange={e => setEditDietForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Objetivo</label>
              <input className="form-input" value={editDietForm.goal} onChange={e => setEditDietForm(f => ({ ...f, goal: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Indicaciones Generales</label>
              <textarea className="form-input" rows={3} value={editDietForm.indications} onChange={e => setEditDietForm(f => ({ ...f, indications: e.target.value }))} />
            </div>
            
            <h4 style={{ fontSize: 15, marginTop: 8 }}>Comidas (Editar contenido)</h4>
            {editDietForm.meals.map((m, idx) => (
              <div key={m.id} style={{ background: 'var(--color-bg-3)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 12 }}>
                 <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>{m.name}</div>
                 <textarea className="form-input" rows={2} value={m.content} onChange={e => setEditDietForm(f => ({ ...f, meals: f.meals.map((meal, i) => i === idx ? { ...meal, content: e.target.value } : meal) }))} />
              </div>
            ))}
          </div>
        )}
      </Modal>
    </CoachLayout>
  );
}
