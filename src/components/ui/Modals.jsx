import React from 'react';
import { useApp } from '../../context/AppContext';

export function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  return (
    <div key={toast.id} className={`toast ${toast.type || 'success'}`}>
      <span>{toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'}</span>
      {toast.message}
    </div>
  );
}

export function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box animate-slide">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="btn-icon btn" onClick={onClose} aria-label="Cerrar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmModal({ open, onClose, onConfirm, title, message }) {
  return (
    <Modal open={open} onClose={onClose} title={title || 'Confirmar acción'}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-danger" onClick={() => { onConfirm(); onClose(); }}>Eliminar</button>
        </>
      }>
      <p style={{ color: 'var(--color-text-2)' }}>{message || '¿Estás seguro? Esta acción no se puede deshacer.'}</p>
    </Modal>
  );
}
