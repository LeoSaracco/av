// ── Tests para StepsTrack ──────────────────────────────────────────────────────
// Prueba el componente de barra de progreso de 6 pasos

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StepsTrack from '../StepsTrack';

describe('StepsTrack', () => {
  it('renderiza los 6 pasos', () => {
    render(<StepsTrack currentStep={1} totalSteps={6} />);
    expect(screen.getByText('Datos')).toBeInTheDocument();
    expect(screen.getByText('Hábitos')).toBeInTheDocument();
    expect(screen.getByText('Salud')).toBeInTheDocument();
    expect(screen.getByText('Perfil')).toBeInTheDocument();
    expect(screen.getByText('Revisar')).toBeInTheDocument();
    expect(screen.getByText('Cuenta')).toBeInTheDocument();
  });

  it('tiene el rol progressbar con atributos ARIA correctos', () => {
    render(<StepsTrack currentStep={3} totalSteps={6} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '3');
    expect(bar).toHaveAttribute('aria-valuemin', '1');
    expect(bar).toHaveAttribute('aria-valuemax', '6');
    expect(bar).toHaveAttribute('aria-label', 'Paso 3 de 6');
  });

  it('marca el paso actual con aria-current="step"', () => {
    render(<StepsTrack currentStep={2} totalSteps={6} />);
    const labels = screen.getAllByText('Hábitos');
    const dotWrap = labels[0].closest('.step-dot-wrap');
    const dot = dotWrap.querySelector('.step-dot');
    expect(dot).toHaveAttribute('aria-current', 'step');
  });

  it('muestra check en pasos completados', () => {
    render(<StepsTrack currentStep={4} totalSteps={6} />);
    const doneDots = document.querySelectorAll('.step-dot.done');
    expect(doneDots.length).toBe(3);
  });

  it('no marca ningun paso con aria-current si currentStep es mayor que total', () => {
    render(<StepsTrack currentStep={6} totalSteps={6} />);
    const currentSteps = document.querySelectorAll('[aria-current="step"]');
    expect(currentSteps.length).toBe(1);
  });
});
