/**
 * @file Vista de observaciones del coach para el cliente. Lista todas las
 *       notas y feedback que Adrián Vila registró sobre su entrenamiento.
 * @route /client/notes
 * @auth Requiere rol "client".
 */
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { ClientLayout } from '../../components/layout/ClientLayout';

/**
 * Vista de observaciones del coach para el cliente.
 * Lista cronológicamente todas las notas y feedback que Adrián Vila
 * registró sobre el entrenamiento del cliente.
 *
 * @returns {JSX.Element} Vista de solo lectura de observaciones del coach.
 */
export default function ClientNotes() {
  const { user } = useAuth();
  const { getClient, getNotesForClient } = useApp();

  const client = getClient(user?.clientId);
  const notes = client ? getNotesForClient(client.id) : [];

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <ClientLayout>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>Del coach</div>
        <h1 style={{ fontSize: 22 }}>Observaciones</h1>
        <p style={{ fontSize: 13, color: 'var(--color-text-2)', marginTop: 4 }}>
          Notas y feedback de Adrián Vila sobre tu entrenamiento
        </p>
      </div>

      {notes.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: 48 }}>📝</span>
          <h3>Sin observaciones aún</h3>
          <p>Tu coach irá agregando observaciones sobre tu progreso aquí.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {notes.map((n, i) => (
            <div key={n.id} className="card" style={{ gap: 12 }}>
              <div style={{ display: 'flex', alignIítems: 'center', gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'var(--color-accent-dim)', color: 'var(--color-accent)',
                  display: 'flex', alignIítems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontFamily: 'var(--font-main)', fontSize: 13,
                  flexShrink: 0,
                }}>AV</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>Adrián Vila</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-3)' }}>{n.createdAt}</div>
                </div>
                {i === 0 && <span className="badge badge-success" style={{ marginLeft: 'auto' }}>Reciente</span>}
              </div>

              <div style={{
                borderLeft: '3px solid var(--color-accent)',
                paddingLeft: 14, paddingTop: 2,
              }}>
                <p style={{ fontSize: 14, color: 'var(--color-text)', lineHeight: 1.75 }}>{n.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </ClientLayout>
  );
}
