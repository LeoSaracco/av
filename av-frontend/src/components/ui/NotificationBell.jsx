/**
 * @file Campanita de notificaciones con badge de mensajes no leídos.
 *       Usa el contexto global para leer unreadCount.
 */
import React from 'react';
import { useApp } from '../../context/AppContext';

/**
 * Icono de campana + badge rojo condicional.
 * Tamaño prominente con animación pulse cuando hay notificaciones.
 *
 * @param {Object} props
 * @param {(e: Event) => void} props.onClick - callback al hacer clic
 * @returns {JSX.Element}
 */
export default function NotificationBell({ onClick }) {
  const { unreadCount } = useApp();
  const hasNotifications = unreadCount > 0;

  return (
    <button
      onClick={onClick}
      aria-label={`Notificaciones${hasNotifications ? `: ${unreadCount} sin leer` : ''}`}
      style={{
        position: 'relative',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '6px',
        color: hasNotifications ? 'var(--color-accent)' : 'var(--color-text-3)',
        opacity: hasNotifications ? 1 : 0.5,
        transition: 'color 0.2s ease, opacity 0.2s ease, transform 0.2s ease',
        transform: hasNotifications ? 'scale(1.1)' : 'scale(1)',
        animation: hasNotifications ? 'pulse 2s ease-in-out infinite' : 'none',
      }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      {hasNotifications && (
        <span style={{
          position: 'absolute',
          top: 0,
          right: 0,
          minWidth: 20,
          height: 20,
          borderRadius: 10,
          background: 'var(--color-danger)',
          color: '#fff',
          fontSize: 11,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 1,
          transform: 'translate(25%, -25%)',
          animation: 'fadeIn 0.3s ease',
        }}>
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}
