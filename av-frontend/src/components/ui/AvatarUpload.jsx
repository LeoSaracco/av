/**
 * @file AvatarUpload.jsx
 * @description Componente de subida de avatar con vista previa,
 *              fallback de iniciales y función de upload stub.
 *              Usa las clases .avatar, .avatar-lg y .avatar-xl de global.css.
 */

import React, { useState, useRef } from 'react';

/**
 * Extrae las iniciales de un nombre (máximo 2 caracteres).
 *
 * @param {string} name - Nombre completo
 * @returns {string} Iniciales en mayúscula
 */
function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

/**
 * @callback OnUploadCallback
 * @param {string} dataUrl - URL en base64 de la imagen (stub, TODO: reemplazar por URL de API)
 */

/**
 * Componente de subida de avatar.
 * Muestra la imagen actual o iniciales como fallback, permite seleccionar
 * un archivo, previsualizarlo y subirlo (stub).
 *
 * @param {Object} props
 * @param {string} [props.avatarUrl] - URL de la imagen de avatar actual
 * @param {string} [props.name] - Nombre del usuario para iniciales de fallback
 * @param {'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño del avatar
 * @param {boolean} [props.editable=true] - Si se permite cambiar el avatar
 * @param {OnUploadCallback} [props.onUpload] - Callback con el resultado del upload
 * @returns {JSX.Element} Componente de avatar con controles de subida
 */
export default function AvatarUpload({
  avatarUrl,
  name = '',
  size = 'md',
  editable = true,
  onUpload,
}) {
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const sizeClass = size === 'lg' || size === 'xl' ? `avatar-${size}` : '';

  const displayUrl = preview || avatarUrl;
  const initials = getInitials(name);

  /**
   * Maneja la selección de archivo: genera preview local.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target.result);
      // También llamamos a onUpload inmediatamente con el dataURL (stub)
      handleUpload(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  /**
   * Stub de subida: devuelve el data URL local.
   * TODO: Conectar a endpoint de API para almacenar la imagen.
   *
   * @param {string} dataUrl - Imagen en base64
   */
  const handleUpload = (dataUrl) => {
    setUploading(true);
    // Simula un delay de red
    setTimeout(() => {
      setUploading(false);
      if (onUpload) onUpload(dataUrl);
    }, 500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      {/* Avatar visual */}
      {displayUrl ? (
        <img
          src={displayUrl}
          alt={`Avatar de ${name || 'usuario'}`}
          className={`avatar ${sizeClass}`}
          style={{ objectFit: 'cover' }}
        />
      ) : (
        <div className={`avatar ${sizeClass}`} aria-label={name || 'Usuario'}>
          {initials}
        </div>
      )}

      {/* Controles de edición */}
      {editable && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="avatar-upload-input"
            aria-label="Seleccionar imagen de avatar"
          />
          <button
            type="button"
            className="btn btn-sm btn-ghost"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? 'Subiendo...' : displayUrl ? 'Cambiar foto' : 'Subir foto'}
          </button>
        </>
      )}

      {/* Indicador de carga */}
      {uploading && (
        <span style={{ fontSize: 11, color: 'var(--color-text-3)' }}>
          Procesando imagen...
        </span>
      )}
    </div>
  );
}
