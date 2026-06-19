/**
 * @file Dropdown de notificaciones anclado a la campanita del coach.
 *       Muestra preview de últimos mensajes con indicador de no leído.
 */
import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

function timeAgo(date) {
  if (!date) return '';
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'ahora';
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} h`;
  return `${Math.floor(hrs / 24)} d`;
}

/**
 * Popover con lista de notificaciones. Se renderiza via portal en document.body.
 *
 * @param {Object} props
 * @param {boolean} props.open - visibilidad del popover
 * @param {() => void} props.onClose - callback para cerrar
 * @param {DOMElement} props.anchorEl - elemento ancla (campanita)
 * @returns {JSX.Element|null}
 */
export default function NotificationPopover({ open, onClose, anchorEl }) {
  const { notifications, markThreadRead, markAllThreadsRead } = useApp();
  const navigate = useNavigate();
  const popoverRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)
          && anchorEl && !anchorEl.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose, anchorEl]);

  if (!open) return null;

  const handleClick = (n) => {
    markThreadRead(n.clientId);
    onClose();
    navigate(`/coach/nutrition?client=${n.clientId}`);
  };

  const popover = (
    <div ref={popoverRef} style={{
      position: 'fixed',
      top: anchorEl ? anchorEl.getBoundingClientRect().bottom + 8 : 60,
      right: 16,
      width: 'calc(100vw - 32px)',
      maxWidth: 360,
      maxHeight: '60dvh',
      overflowY: 'auto',
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: '0 12px 40px rgba(0,0,0,0.8)',
      zIndex: 2000,
      animation: 'fadeIn 0.2s ease',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 16px', borderBottom: '1px solid var(--color-border)',
      }}>
        <span style={{ fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-main)' }}>Notificaciones</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--color-text-3)', cursor: 'pointer', fontSize: 16, padding: 0, lineHeight: 1 }}>✕</button>
      </div>

      {notifications.length === 0 ? (
        <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--color-text-3)', fontSize: 13 }}>
          Sin notificaciones
        </div>
      ) : (
        notifications.slice(0, 20).map(n => (
          <div key={n.clientId}
            onClick={() => handleClick(n)}
            style={{
              display: 'flex', flexDirection: 'column', gap: 4,
              padding: '12px 16px', cursor: 'pointer',
              borderBottom: '1px solid var(--color-border)',
              borderLeft: n.unread ? '3px solid var(--color-accent)' : '3px solid transparent',
              opacity: n.unread ? 1 : 0.6,
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-bg-3)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, fontSize: 13, fontFamily: 'var(--font-main)' }}>💬 {n.clientName}</span>
              <span style={{ fontSize: 11, color: 'var(--color-text-3)' }}>{timeAgo(n.updatedAt)}</span>
            </div>
            {n.dietName && <span style={{ fontSize: 11, color: 'var(--color-accent)' }}>🥗 {n.dietName}</span>}
            {n.lastMessage && (
              <span style={{ fontSize: 12, color: 'var(--color-text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {n.lastSender === 'COACH' ? 'Tú: ' : ''}{n.lastMessage}
              </span>
            )}
          </div>
        ))
      )}

      {notifications.length > 0 && (
        <div style={{ borderTop: '1px solid var(--color-border)' }}>
          <button onClick={() => { markAllThreadsRead(); }}
            style={{
              width: '100%', padding: '12px 16px', background: 'none', border: 'none',
              color: 'var(--color-text-2)', fontSize: 12, cursor: 'pointer',
              textAlign: 'center', fontFamily: 'var(--font-body)',
            }}>
            Marcar todo como leído
          </button>
          <button onClick={() => { onClose(); navigate('/coach/nutrition'); }}
            style={{
              width: '100%', padding: '12px 16px', background: 'none', border: 'none',
              borderTop: '1px solid var(--color-border)',
              color: 'var(--color-accent)', fontSize: 13, cursor: 'pointer',
              textAlign: 'center', fontFamily: 'var(--font-body)', fontWeight: 600,
            }}>
            Ver todos los chats →
          </button>
        </div>
      )}
    </div>
  );

  return ReactDOM.createPortal(popover, document.body);
}
