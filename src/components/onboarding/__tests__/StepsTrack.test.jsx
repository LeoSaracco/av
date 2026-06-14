// ── Tests para StepsTrack ──────────────────────────────────────────────────────
// Prueba el componente de barra de progreso de 6 pasos

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { I18nProvider } from '../../../i18n/index';
import StepsTrack from '../StepsTrack';

function renderWithI18n(ui) {
  localStorage.setItem('av_lang', 'es');
  return render(<I18nProvider>{ui}</I18nProvider>);
}

describe('StepsTrack', () => {
  it('renderiza los 6 pasos', () => {
    renderWithI18n(<StepsTrack currentStep={1} totalSteps={6} />);
    expect(screen.getByText('Datos')).toBeInTheDocument();
    expect(screen.getByText('Hábitos')).toBeInTheDocument();
    expect(screen.getByText('Salud')).toBeInTheDocument();
    expect(screen.getByText('Perfil')).toBeInTheDocument();
    expect(screen.getByText('Revisar')).toBeInTheDocument();
    expect(screen.getByText('Cuenta')).toBeInTheDocument();
  });

  it('tiene el rol progressbar con atributos ARIA correctos', () => {
    renderWithI18n(<StepsTrack currentStep={3} totalSteps={6} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '3');
    expect(bar).toHaveAttribute('aria-valuemin', '1');
    expect(bar).toHaveAttribute('aria-valuemax', '6');
  });

  it('marca el paso actual con aria-current="step"', () => {
    renderWithI18n(<StepsTrack currentStep={2} totalSteps={6} />);
    const labels = screen.getAllByText('Hábitos');
    const dotWrap = labels[0].closest('.step-dot-wrap');
    const dot = dotWrap.querySelector('.step-dot');
    expect(dot).toHaveAttribute('aria-current', 'step');
  });

  it('muestra check en pasos completados', () => {
    renderWithI18n(<StepsTrack currentStep={4} totalSteps={6} />);
    const doneDots = document.querySelectorAll('.step-dot.done');
    expect(doneDots.length).toBe(3);
  });

  it('no duplica aria-current con currentStep mayor que totalSteps', () => {
    renderWithI18n(<StepsTrack currentStep={6} totalSteps={6} />);
    const currentSteps = document.querySelectorAll('[aria-current="step"]');
    expect(currentSteps.length).toBe(1);
  });
});
