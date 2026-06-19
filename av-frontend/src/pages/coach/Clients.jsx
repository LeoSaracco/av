/**
 * @file Gestión de clientes (ABM). Permite listar, buscar, crear, editar
 *       y eliminar clientes con tabla responsive y modal de formulario.
 * @route /coach/clients
 * @auth Requiere rol "coach".
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { CoachLayout } from '../../components/layout/CoachLayout';
import { inlineSpinnerStyle } from '../../utils/spinnerStyle';
import { Modal, ConfirmModal } from '../../components/ui/Modals';

const EMPTY_CLIENT = { name: '', email: '', phone: '', goal: '', status: 'activo' };

export default function Clients() {
  const { clients, addClient, updateClient, deleteClient, assignments, routines } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [form, setForm] = useState(EMPTY_CLIENT);
  const [editId, setEditId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm(EMPTY_CLIENT); setEditId(null); setModal('form'); };
  const openEdit = (c) => { setForm({ name: c.name, email: c.email, phone: c.phone || '', goal: c.goal, status: c.status }); setEditId(c.id); setModal('form'); };
  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) return;
    setSaving(true);
    try {
      if (editId) await updateClient(editId, form);
      else await addClient(form);
      setModal(null);
    } catch { /* ignore */ } finally {
      setSaving(false);
    }
  };

  const getRoutineForClient = (clientId) => {
    const a = assignments.find(a => a.clientId === clientId && a.active);
    return a ? routines.find(r => r.id === a.routineId) : null;
  };

  return (
    <CoachLayout>
      <div className="page-header">
        <div>
          <h1>Clientes</h1>
          <p>{clients.length} clientes · {clients.filter(c => c.status === 'activo').length} activos</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Nuevo cliente</button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <div className="search-bar" style={{ maxWidth: 380 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-3)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input placeholder="Buscar por nombre o email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: 48 }}>👥</span>
          <h3>No hay clientes</h3>
          <p>Agregá tu primer cliente para comenzar</p>
          <button className="btn btn-primary" onClick={openAdd}>+ Agregar cliente</button>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="table-wrapper desktop-only">
            <table>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Email</th>
                  <th>Objetivo</th>
                  <th>Rutina</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => {
                  const routine = getRoutineForClient(c.id);
                  return (
                    <tr key={c.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="avatar" style={{ width: 34, height: 34, fontSize: 12 }}>
                            {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <span style={{ fontWeight: 600 }}>{c.name}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--color-text-2)' }}>{c.email}</td>
                      <td style={{ color: 'var(--color-text-2)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.goal}</td>
                      <td>
                        {routine
                          ? <span style={{ fontSize: 13, color: 'var(--color-accent)' }}>✓ {routine.name}</span>
                          : <span style={{ fontSize: 13, color: 'var(--color-text-3)' }}>Sin rutina</span>}
                      </td>
                      <td><span className={`badge ${c.status === 'activo' ? 'badge-success' : 'badge-warning'}`}>{c.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-sm btn-ghost" onClick={() => navigate(`/coach/clients/${c.id}`)}>Ver</button>
                          <button className="btn btn-sm btn-ghost" onClick={() => openEdit(c)}>Editar</button>
                          <button className="btn btn-sm btn-danger" onClick={() => setConfirmId(c.id)}>✕</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="mobile-only" style={{ gap: 12 }}>
            {filtered.map(c => {
              const routine = getRoutineForClient(c.id);
              return (
                <div key={c.id} className="card" style={{ gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar">
                        {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontFamily: 'var(--font-main)' }}>{c.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-3)' }}>{c.email}</div>
                      </div>
                    </div>
                    <span className={`badge ${c.status === 'activo' ? 'badge-success' : 'badge-warning'}`}>{c.status}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--color-text-2)', lineHeight: 1.5 }}>{c.goal}</p>
                  {routine && <div style={{ fontSize: 12, color: 'var(--color-accent)' }}>💪 {routine.name}</div>}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button className="btn btn-sm btn-secondary" onClick={() => navigate(`/coach/clients/${c.id}`)}>Ver detalle</button>
                    <button className="btn btn-sm btn-ghost" onClick={() => openEdit(c)}>Editar</button>
                    <button className="btn btn-sm btn-danger" onClick={() => setConfirmId(c.id)}>Eliminar</button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Add/Edit Modal */}
      <Modal open={modal === 'form'} onClose={() => setModal(null)}
        title={editId ? 'Editar cliente' : 'Nuevo cliente'}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setModal(null)} disabled={saving}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={saving ? { minWidth: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 } : {}}>
              {saving ? <div style={inlineSpinnerStyle(18, '#000', 'rgba(0,0,0,0.25)')} /> : editId ? 'Guardar cambios' : 'Crear cliente'}
            </button>
          </>
        }>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Nombre completo *</label>
            <input className="form-input" placeholder="Ej: Martina Gómez" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input className="form-input" type="email" placeholder="cliente@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Teléfono</label>
            <input className="form-input" placeholder="+54 11 1234-5678" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Objetivo</label>
            <textarea className="form-input" placeholder="Ej: Bajar 8 kg y tonificar..." rows={3} value={form.goal} onChange={e => setForm(f => ({ ...f, goal: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Estado</label>
            <select className="form-input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              <option value="activo">Activo</option>
              <option value="pausado">Pausado</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        </div>
      </Modal>

      <ConfirmModal open={!!confirmId} onClose={() => { if (!deleting) setConfirmId(null); }}
        onConfirm={async () => { setDeleting(true); try { await deleteClient(confirmId); } catch { /* ignore */ } setDeleting(false); setConfirmId(null); }}
        title="Eliminar cliente"
        message="¿Eliminar este cliente? Se perderán sus datos, notas y asignaciones."
        confirmDisabled={deleting}
        confirmLabel={deleting ? <div style={inlineSpinnerStyle(16, '#fff', 'rgba(255,255,255,0.25)')} /> : 'Eliminar'} />
    </CoachLayout>
  );
}
