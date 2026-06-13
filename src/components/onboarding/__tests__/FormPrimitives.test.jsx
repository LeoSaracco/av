// ── Tests para FormPrimitives ──────────────────────────────────────────────────
// Prueba FieldError, FormGroup, RadioGroup, ToggleGroup

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FieldError, FormGroup, RadioGroup, ToggleGroup } from '../FormPrimitives';

describe('FieldError', () => {
  it('renderiza el mensaje de error cuando existe', () => {
    render(<FieldError msg="Campo requerido" id="err-test" />);
    const el = screen.getByRole('alert');
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('Campo requerido');
    expect(el).toHaveAttribute('id', 'err-test');
  });

  it('no renderiza nada si no hay mensaje', () => {
    const { container } = render(<FieldError msg="" />);
    expect(container.firstChild).toBeNull();
  });

  it('no renderiza si msg es null', () => {
    const { container } = render(<FieldError msg={null} />);
    expect(container.firstChild).toBeNull();
  });
});

describe('FormGroup', () => {
  it('renderiza label con htmlFor correcto', () => {
    render(
      <FormGroup label="Nombre" htmlFor="input-name">
        <input id="input-name" />
      </FormGroup>
    );
    const label = screen.getByText('Nombre');
    expect(label).toHaveAttribute('for', 'input-name');
  });

  it('muestra el error cuando se pasa', () => {
    render(
      <FormGroup label="Email" htmlFor="email" error="Email invalido" errorId="err-email">
        <input id="email" />
      </FormGroup>
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Email invalido');
  });
});

describe('RadioGroup', () => {
  const options = [
    { value: 'a', title: 'Opcion A' },
    { value: 'b', title: 'Opcion B', desc: 'Descripcion de B' },
  ];

  it('renderiza todas las opciones', () => {
    render(<RadioGroup name="test" value="" onChange={vi.fn()} options={options} />);
    expect(screen.getByText('Opcion A')).toBeInTheDocument();
    expect(screen.getByText('Opcion B')).toBeInTheDocument();
    expect(screen.getByText('Descripcion de B')).toBeInTheDocument();
  });

  it('llama a onChange al clickear una opcion', () => {
    const onChange = vi.fn();
    render(<RadioGroup name="test" value="" onChange={onChange} options={options} />);
    fireEvent.click(screen.getByText('Opcion A'));
    expect(onChange).toHaveBeenCalledWith('a');
  });

  it('marca selected la opcion activa', () => {
    render(<RadioGroup name="test" value="b" onChange={vi.fn()} options={options} />);
    const btnB = screen.getByText('Opcion B').closest('button');
    expect(btnB).toHaveClass('selected');
  });

  it('usa aria-checked correctamente', () => {
    render(<RadioGroup name="test" value="a" onChange={vi.fn()} options={options} />);
    expect(screen.getByText('Opcion A').closest('button')).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByText('Opcion B').closest('button')).toHaveAttribute('aria-checked', 'false');
  });
});

describe('ToggleGroup', () => {
  const options = [
    { value: 'si', label: 'Si' },
    { value: 'no', label: 'No' },
  ];

  it('renderiza las opciones', () => {
    render(<ToggleGroup name="test" value="" onChange={vi.fn()} options={options} />);
    expect(screen.getByText('Si')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('llama a onChange al clickear', () => {
    const onChange = vi.fn();
    render(<ToggleGroup name="test" value="" onChange={onChange} options={options} />);
    fireEvent.click(screen.getByText('No'));
    expect(onChange).toHaveBeenCalledWith('no');
  });

  it('agrega clase active a la opcion seleccionada', () => {
    render(<ToggleGroup name="test" value="si" onChange={vi.fn()} options={options} />);
    expect(screen.getByText('Si').closest('button')).toHaveClass('active');
    expect(screen.getByText('No').closest('button')).not.toHaveClass('active');
  });
});
