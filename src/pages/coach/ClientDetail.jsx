import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { CoachLayout } from '../../components/layout/CoachLayout';
import { Modal, ConfirmModal } from '../../components/ui/Modals';

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getClient, updateClient, getAssignmentForClient, getRoutine,
    getNotesForClient, addNote, updateNote, deleteNote,
    getProgressForClient,
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
  const handleSaveNote = () => {
    if (!noteText.trim()) return;
    if (editNoteId) updateNote(editNoteId, noteText);
    else addNote(id, noteText);
    setNoteModal(false);
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
            <button className="btn btn-ghost" onClick={() => setNoteModal(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSaveNote}>
              {editNoteId ? 'Guardar cambios' : 'Agregar'}
            </button>
          </>
        }>
        <div className="form-group">
          <label className="form-label">Observación sobre {client.name}</label>
          <textarea className="form-input" rows={5} placeholder="Escribí tu observación aquí..." value={noteText} onChange={e => setNoteText(e.target.value)} />
        </div>
      </Modal>

      <ConfirmModal open={!!confirmNoteId} onClose={() => setConfirmNoteId(null)}
        onConfirm={() => deleteNote(confirmNoteId)}
        title="Eliminar observación" message="¿Eliminar esta observación?" />
    </CoachLayout>
  );
}
