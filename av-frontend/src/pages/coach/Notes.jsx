/**
 * @file Gestión de observaciones por cliente. Presenta un selector lateral
 *       de clientes y un panel central con el listado de notas (CRUD).
 * @route /coach/notes
 * @auth Requiere rol "coach".
 */
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CoachLayout } from '../../components/layout/CoachLayout';
import { inlineSpinnerStyle } from '../../utils/spinnerStyle';
import { Modal, ConfirmModal } from '../../components/ui/Modals';

export default function Notes() {
  const { clients, notes, addNote, updateNote, deleteNote, getNotesForClient } = useApp();
  const [selectedClient, setSelectedClient] = useState(clients[0]?.id || '');
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [confirmId, setConfirmId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const clientNotes = selectedClient ? getNotesForClient(selectedClient) : [];
  const currentClient = clients.find(c => c.id === selectedClient);

  const openAdd = () => { setNoteText(''); setEditId(null); setModal(true); };
  const openEdit = (n) => { setNoteText(n.text); setEditId(n.id); setModal(true); };
  const handleSave = async () => {
    if (!noteText.trim() || !selectedClient) return;
    setSaving(true);
    try {
      if (editId) await updateNote(editId, noteText);
      else await addNote(selectedClient, noteText);
      setModal(false);
    } catch { /* ignore */ } finally {
      setSaving(false);
    }
  };

  return (
    <CoachLayout>
      <div className="page-header">
        <div>
          <h1>Observaciones</h1>
          <p>Notas y seguimiento por cliente</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd} disabled={!selectedClient}>
          + Nueva observación
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
        {/* Client selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h3 style={{ fontSize: 14, color: 'var(--color-text-2)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 4 }}>Clientes</h3>
          {clients.map(c => {
            const count = notes.filter(n => n.clientId === c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedClient(c.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                  borderRadius: 'var(--radius-md)', background: selectedClient === c.id ? 'var(--color-accent-dim2)' : 'var(--color-bg-3)',
                  border: `1px solid ${selectedClient === c.id ? 'rgba(0,255,0,0.2)' : 'var(--color-border)'}`,
                  cursor: 'pointer', transition: 'var(--transition)', textAlign: 'left', width: '100%',
                }}
              >
                <div className="avatar" style={{ width: 34, height: 34, fontSize: 12 }}>
                  {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: selectedClient === c.id ? 'var(--color-accent)' : 'var(--color-text)', fontFamily: 'var(--font-main)' }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-3)' }}>{count} observación{count !== 1 ? 'es' : ''}</div>
                </div>
                {selectedClient === c.id && <span style={{ color: 'var(--color-accent)' }}>→</span>}
              </button>
            );
          })}
        </div>

        {/* Notes panel */}
        <div style={{ flex: '1', minWidth: 0 }}>
          {!selectedClient ? (
            <div className="empty-state">
              <p>Seleccioná un cliente</p>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 16 }}>{currentClient?.name}</h3>
                  <p style={{ fontSize: 13, color: 'var(--color-text-2)' }}>{clientNotes.length} observaciones</p>
                </div>
                <button className="btn btn-primary btn-sm" onClick={openAdd}>+ Agregar</button>
              </div>

              {clientNotes.length === 0 ? (
                <div className="empty-state" style={{ padding: '32px 0' }}>
                  <span style={{ fontSize: 40 }}>📝</span>
                  <h3>Sin observaciones</h3>
                  <p>Agregá la primera nota para {currentClient?.name}</p>
                  <button className="btn btn-primary btn-sm" onClick={openAdd}>+ Agregar observación</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {clientNotes.map(n => (
                    <div key={n.id} className="card" style={{ gap: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-block' }} />
                          <span style={{ fontSize: 12, color: 'var(--color-text-3)', fontWeight: 500 }}>{n.createdAt}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-sm btn-ghost" onClick={() => openEdit(n)}>Editar</button>
                          <button className="btn btn-sm btn-danger" onClick={() => setConfirmId(n.id)}>✕</button>
                        </div>
                      </div>
                      <p style={{ fontSize: 14, color: 'var(--color-text)', lineHeight: 1.7 }}>{n.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Modal open={modal} onClose={() => setModal(false)}
        title={editId ? 'Editar observación' : `Nueva observación — ${currentClient?.name}`}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setModal(false)} disabled={saving}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={saving ? { minWidth: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 } : {}}>
              {saving ? <div style={inlineSpinnerStyle(18, '#000', 'rgba(0,0,0,0.25)')} /> : editId ? 'Guardar' : 'Agregar'}
            </button>
          </>
        }>
        <div className="form-group">
          <label className="form-label">Observación</label>
          <textarea className="form-input" rows={5} placeholder="Escribí tu observación..." value={noteText} onChange={e => setNoteText(e.target.value)} autoFocus />
        </div>
      </Modal>

      <ConfirmModal open={!!confirmId} onClose={() => { if (!deleting) setConfirmId(null); }}
        onConfirm={async () => { setDeleting(true); try { await deleteNote(confirmId); } catch { /* ignore */ } setDeleting(false); setConfirmId(null); }}
        title="Eliminar observación" message="¿Eliminar esta observación?"
        confirmDisabled={deleting}
        confirmLabel={deleting ? <div style={inlineSpinnerStyle(16, '#fff', 'rgba(255,255,255,0.25)')} /> : 'Eliminar'} />
    </CoachLayout>
  );
}
