/**
 * @file StepsTrack.jsx
 * @description Barra de progreso visual para el flujo de onboarding.
 *              Muestra los 6 pasos como puntos conectados, indicando
 *              el paso actual, los completados y los pendientes.
 */
import React from 'react';
import { StepIcon, IconCheck } from './StepIcons';

// ── Definición de pasos ────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Datos', icon: 'user' },
  { id: 2, label: 'Hábitos', icon: 'activity' },
  { id: 3, label: 'Salud', icon: 'health' },
  { id: 4, label: 'Perfil', icon: 'mind' },
  { id: 5, label: 'Revisar', icon: 'eye' },
  { id: 6, label: 'Cuenta', icon: 'lock' },
];

/**
 * Indicador de pasos del onboarding.
 * Renderiza una barra horizontal con puntos que muestran el avance.
 * Usa roles ARIA para accesibilidad (progressbar).
 *
 * @param {Object} props
 * @param {number} props.currentStep - Paso actual (1-6)
 * @param {number} props.totalSteps - Total de pasos del flujo
 * @returns {JSX.Element} Barra de progreso de pasos
 */
export default function StepsTrack({ currentStep, totalSteps }) {
  return (
    <div className="steps-track" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps} aria-label={`Paso ${currentStep} de ${totalSteps}`}>
      {STEPS.map((s, i) => {
        const isActive = currentStep === s.id;
        const isDone = currentStep > s.id;
        const isLast = i === STEPS.length - 1;

        return (
          <React.Fragment key={s.id}>
            <div className="step-dot-wrap">
              <span className={`step-dot-label${isActive ? ' active' : ''}${isDone ? ' done' : ''}`}>
                {s.label}
              </span>
              <span className={`step-dot${isActive ? ' active' : ''}${isDone ? ' done' : ''}`} aria-current={isActive ? 'step' : undefined}>
                {isDone ? <IconCheck /> : <StepIcon name={s.icon} />}
              </span>
            </div>
            {!isLast && <span className={`step-line${isDone ? ' done' : ''}`} aria-hidden="true" />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
