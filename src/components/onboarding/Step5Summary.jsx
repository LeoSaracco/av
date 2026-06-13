/**
 * @file Step5Summary.jsx
 * @description Paso 5 del onboarding: pantalla de resumen y revisión de todos
 *              los datos ingresados, agrupados por sección, con opción de
 *              volver a editar cada una antes de la confirmación final.
 */
import React from 'react';

// ── Revisión y confirmación de datos ───────────────────────────────────────────
const LABELS = {
  step1_name: 'Nombre y apellido',
  step1_email: 'Correo electrónico',
  step1_whatsapp: 'WhatsApp',
  step1_age: 'Edad',
  step1_height: 'Altura',
  step1_weight: 'Peso',
  step1_sex: 'Sexo',
  step2_activity: 'Tipo de actividad',
  step2_steps: 'Pasos diarios',
  step2_sleep: 'Horas de sueño',
  step3_pathology: 'Patología preexistente',
  step3_pathology_desc: 'Descripción de patología',
  step3_medical: 'Apto médico',
  step3_level: 'Nivel físico',
  step3_commitment: 'Compromiso 90/90',
  step3_frequency: 'Frecuencia semanal',
  step4_body: 'Relación con el espejo',
  step4_purpose: 'Propósito no estético',
  step4_complexes: 'Complejos corporales',
  step4_injuries: 'Lesiones',
  step4_city: 'Ciudad',
  step4_community: 'Conectar con comunidad',
};

const ACTIVITY_MAP = {
  sedentaria: 'Sedentaria',
  poco_activa: 'Poco activa',
  activa: 'Activa',
  muy_activa: 'Muy activa',
};

const STEPS_MAP = {
  menos_5000: 'Menos de 5.000',
  '5000_8000': 'Entre 5.000 y 8.000',
  mas_10000: 'Más de 10.000',
};

const LEVEL_MAP = {
  principiante: 'Principiante',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
};

// ── Secciones del resumen ──────────────────────────────────────────────────────
const SECTIONS = [
  {
    title: 'Datos personales',
    goToStep: 1,
    fields: ['step1_name', 'step1_email', 'step1_whatsapp', 'step1_age', 'step1_height', 'step1_weight', 'step1_sex'],
  },
  {
    title: 'Actividad y hábitos',
    goToStep: 2,
    fields: ['step2_activity', 'step2_steps', 'step2_sleep'],
  },
  {
    title: 'Salud y aptitud',
    goToStep: 3,
    fields: ['step3_pathology', 'step3_pathology_desc', 'step3_medical', 'step3_level', 'step3_commitment', 'step3_frequency'],
  },
  {
    title: 'Perfil y motivación',
    goToStep: 4,
    fields: ['step4_body', 'step4_purpose', 'step4_complexes', 'step4_injuries', 'step4_city', 'step4_community'],
  },
];

/**
 * Formatea un valor crudo del formulario para su presentación en el resumen.
 * Aplica unidades (cm, kg, años, horas), mapea claves a etiquetas legibles
 * y convierte valores booleanos (si/no) a texto.
 *
 * @param {string} field - Clave del campo (ej: 'step1_age')
 * @param {string|null} value - Valor crudo del campo
 * @returns {string|null} Valor formateado para mostrar, o null si está vacío
 */
function formatValue(field, value) {
  if (value == null || value === '') return null;

  switch (field) {
    case 'step1_age': return `${value} años`;
    case 'step1_height': return `${value} cm`;
    case 'step1_weight': return `${value} kg`;
    case 'step2_activity': return ACTIVITY_MAP[value] || value;
    case 'step2_steps': return STEPS_MAP[value] || value;
    case 'step2_sleep': return `${value} horas`;
    case 'step3_pathology': return value === 'si' ? 'Sí' : 'No';
    case 'step3_medical': return value === 'si' ? 'Sí' : 'No';
    case 'step3_level': return LEVEL_MAP[value] || value;
    case 'step3_commitment': return value === 'si' ? 'Sí, me comprometo' : value ? 'No' : null;
    case 'step3_frequency': return value ? `${value} veces por semana` : null;
    case 'step4_community': return value === 'si' ? 'Sí' : value === 'no' ? 'No' : null;
    default: return String(value);
  }
}

/**
 * Determina si un campo debe mostrarse en el resumen.
 * Oculta campos vacíos y campos condicionales que no aplican
 * (ej: descripción de patología si no hay patología).
 *
 * @param {string} field - Clave del campo
 * @param {string|null} value - Valor del campo
 * @param {Object} form - Estado completo del formulario
 * @returns {boolean} true si el campo debe mostrarse
 */
function shouldShow(field, value, form) {
  if (value == null || value === '') return false;
  if (field === 'step3_pathology_desc' && form.step3_pathology !== 'si') return false;
  if (field === 'step3_commitment' && !value) return false;
  return true;
}

/**
 * Componente principal del paso 5 — Resumen y revisión.
 * Muestra todos los datos del formulario agrupados por sección,
 * con botones para volver a editar cada paso.
 *
 * @param {Object} props
 * @param {Object} props.form - Estado completo del formulario con todos los valores
 * @param {(step: number) => void} props.onGoToStep - Callback para navegar a un paso específico
 * @returns {JSX.Element} Pantalla de resumen
 */
export default function Step5Summary({ form, onGoToStep }) {
  return (
    <div className="summary-container">
      <p className="summary-intro">
        Revisá que todos los datos sean correctos. Si necesitás ajustar algo, podés editar cada sección.
      </p>

      {SECTIONS.map((section) => {
        const visibleFields = section.fields.filter(f => shouldShow(f, form[f], form));
        if (visibleFields.length === 0) return null;

        return (
          <div key={section.title} className="summary-section">
            <div className="summary-section-header">
              <h4 className="summary-section-title">{section.title}</h4>
              <button type="button" className="btn btn-sm btn-ghost" onClick={() => onGoToStep(section.goToStep)}>
                Editar
              </button>
            </div>
            <div className="summary-section-body">
              {visibleFields.map(field => {
                const value = formatValue(field, form[field]);
                if (!value) return null;
                return (
                  <div key={field} className="summary-row">
                    <span className="summary-label">{LABELS[field]}</span>
                    <span className="summary-value">{value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
