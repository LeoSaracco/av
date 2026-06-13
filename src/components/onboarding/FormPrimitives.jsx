/**
 * @file FormPrimitives.jsx
 * @description Componentes primitivos de formulario reutilizables en el
 *              flujo de onboarding: mensajes de error, grupos de campos,
 *              grupos de botones radio y toggles.
 */
import React from 'react';

/**
 * Mensaje de error para campos de formulario.
 * Solo se renderiza si hay un mensaje de error presente.
 *
 * @param {Object} props
 * @param {string} [props.msg] - Mensaje de error a mostrar
 * @param {string} [props.id] - ID para asociar con aria-describedby
 * @returns {JSX.Element|null} Elemento de error o null
 */
export function FieldError({ msg, id }) {
  if (!msg) return null;
  return (
    <div className="field-error" id={id} role="alert">
      <span aria-hidden="true">!</span> {msg}
    </div>
  );
}

/**
 * Agrupación de campo de formulario con label, contenido y error.
 *
 * @param {Object} props
 * @param {string} props.label - Texto de la etiqueta
 * @param {string} [props.htmlFor] - ID del input asociado
 * @param {React.ReactNode} props.children - Campo(s) de formulario
 * @param {string} [props.error] - Mensaje de error
 * @param {string} [props.errorId] - ID del elemento de error
 * @returns {JSX.Element} Grupo de formulario
 */
export function FormGroup({ label, htmlFor, children, error, errorId }) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={htmlFor}>{label}</label>
      {children}
      <FieldError msg={error} id={errorId} />
    </div>
  );
}

/**
 * Grupo de botones radio con estilo de tarjetas seleccionables.
 * Soporta layouts en columna simple, 2, 3 o 4 columnas.
 *
 * @param {Object} props
 * @param {'single'|'cols-2'|'cols-3'|'cols-4'} [props.layout='single'] - Disposición de las tarjetas
 * @param {string} props.name - Nombre del grupo (para accesibilidad)
 * @param {string} props.value - Valor actualmente seleccionado
 * @param {(value: string) => void} props.onChange - Callback al seleccionar
 * @param {Array<{value: string, title?: string, label?: string, desc?: string}>} props.options - Opciones del radio
 * @param {string} [props.error] - Mensaje de error
 * @param {string} [props.errorId] - ID del elemento de error
 * @returns {JSX.Element} Grupo de radio buttons
 */
export function RadioGroup({ layout = 'single', name, value, onChange, options, error, errorId }) {
  const colsClass = layout === 'cols-2' ? 'radio-group cols-2' : layout === 'cols-3' ? 'radio-group cols-3' : layout === 'cols-4' ? 'radio-group cols-4' : 'radio-group';
  return (
    <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
      <div className={colsClass} role="radiogroup" aria-label={name}>
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={value === opt.value}
            className={`radio-card${value === opt.value ? ' selected' : ''}`}
            onClick={() => onChange(opt.value)}
          >
            <span className="radio-dot" aria-hidden="true" />
            {opt.desc ? (
              <span className="radio-card-content">
                <span className="radio-card-title">{opt.title || opt.label}</span>
                <span className="radio-card-desc">{opt.desc}</span>
              </span>
            ) : (
              <span>{opt.title || opt.label}</span>
            )}
          </button>
        ))}
      </div>
      <FieldError msg={error} id={errorId} />
    </fieldset>
  );
}

/**
 * Grupo de botones toggle (estilo switch horizontal).
 * Ideal para opciones binarias o listas cortas.
 *
 * @param {Object} props
 * @param {string} props.name - Nombre del grupo (para accesibilidad)
 * @param {string} props.value - Valor actualmente seleccionado
 * @param {(value: string) => void} props.onChange - Callback al seleccionar
 * @param {Array<{value: string, label: string}>} props.options - Opciones del toggle
 * @param {string} [props.error] - Mensaje de error
 * @param {string} [props.errorId] - ID del elemento de error
 * @returns {JSX.Element} Grupo de botones toggle
 */
export function ToggleGroup({ name, value, onChange, options, error, errorId }) {
  return (
    <div>
      <div className="toggle-group" role="radiogroup" aria-label={name}>
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={value === opt.value}
            className={`toggle-btn${value === opt.value ? ' active' : ''}`}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <FieldError msg={error} id={errorId} />
    </div>
  );
}
