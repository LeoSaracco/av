/**
 * @file Modals.jsx
 * @description Componentes de UI reutilizables para notificaciones toast,
 *              ventanas modales genéricas y modales de confirmación de eliminación.
 */
import React from 'react';
import { useApp } from '../../context/AppContext';

/**
 * Componente de notificación toast.
 * Se suscribe al contexto global y muestra un mensaje temporal
 * con ícono según el tipo (success, error, info).
 *
 * @returns {JSX.Element|null} Elemento toast o null si no hay mensaje activo
 */
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

/**
 * Modal genérico con overlay, cabecera con título y botón de cierre,
 * cuerpo de contenido y pie de modal opcional.
 *
 * @param {Object} props
 * @param {boolean} props.open - Controla la visibilidad del modal
 * @param {() => void} props.onClose - Callback al cerrar (overlay click o botón X)
 * @param {string} props.title - Título del modal
 * @param {React.ReactNode} props.children - Contenido del cuerpo del modal
 * @param {React.ReactNode} [props.footer] - Contenido opcional del pie del modal
 * @returns {JSX.Element|null} Elemento modal o null si no está abierto
 */
export function Modal({ open, onClose, title, children, footer, className }) {
  if (!open) return null;
  return (
    <div className={`modal-overlay${className ? ' ' + className : ''}`} onClick={e => e.target === e.currentTarget && onClose()}>
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

/**
 * Modal de confirmación para acciones destructivas (eliminar).
 * Extiende {@link Modal} con botones Cancelar/Eliminar predefinidos.
 *
 * @param {Object} props
 * @param {boolean} props.open - Controla la visibilidad del modal
 * @param {() => void} props.onClose - Callback al cerrar
 * @param {() => void} props.onConfirm - Callback al confirmar la acción
 * @param {string} [props.title='Confirmar acción'] - Título del modal
 * @param {string} [props.message] - Mensaje de advertencia
 * @returns {JSX.Element} Modal de confirmación
 */
export function ConfirmModal({ open, onClose, onConfirm, title, message, confirmLabel, confirmDisabled }) {
  return (
    <Modal open={open} onClose={onClose} title={title || 'Confirmar accion'} className="confirm-modal"
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose} disabled={confirmDisabled}>Cancelar</button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={confirmDisabled}>
            {confirmLabel || 'Eliminar'}
          </button>
        </>
      }>
      <p style={{ color: 'var(--color-text-2)' }}>{message || 'Estas seguro? Esta accion no se puede deshacer.'}</p>
    </Modal>
  );
}
