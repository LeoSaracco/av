/**
 * @file StepIcons.jsx
 * @description Colección de íconos SVG utilizados en el flujo de onboarding
 *              para representar visualmente cada paso del proceso.
 */
import React from 'react';

const svgProps = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };

// ── Íconos de pasos ────────────────────────────────────────────────────────────
/** @returns {JSX.Element} Ícono de usuario/persona */
export function IconUser() {
  return <svg {...svgProps} aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}

/** @returns {JSX.Element} Ícono de actividad/gráfico */
export function IconActivity() {
  return <svg {...svgProps} aria-hidden="true"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
}

/** @returns {JSX.Element} Ícono de salud/corazón */
export function IconHealth() {
  return <svg {...svgProps} aria-hidden="true"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>;
}

/** @returns {JSX.Element} Ícono de mente/creatividad */
export function IconMind() {
  return <svg {...svgProps} aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 2c.83 1.07 2.13 2.5 3.5 2.5s2.67-1.43 3.5-2.5"/></svg>;
}

/** @returns {JSX.Element} Ícono de candado/seguridad */
export function IconLock() {
  return <svg {...svgProps} aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
}

/** @returns {JSX.Element} Ícono de ojo/revisión */
export function IconEye() {
  return <svg {...svgProps} aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
}

/** @returns {JSX.Element} Ícono de check/verificación */
export function IconCheck() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12"/>
  </svg>;
}

// ── Mapa de íconos por nombre ──────────────────────────────────────────────────
const iconMap = { user: IconUser, activity: IconActivity, health: IconHealth, mind: IconMind, eye: IconEye, lock: IconLock };

/**
 * Renderiza un ícono según el nombre del paso.
 *
 * @param {Object} props
 * @param {string} props.name - Nombre del ícono (clave del mapa iconMap)
 * @returns {JSX.Element|null} Componente de ícono correspondiente o null si no existe
 */
export function StepIcon({ name }) {
  const Icon = iconMap[name];
  return Icon ? <Icon /> : null;
}
