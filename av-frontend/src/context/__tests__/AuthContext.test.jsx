// ── Tests para AuthContext (API real) ────────────────────────────────────────

import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import React from 'react';

// Mock apiClient
vi.mock('../../api/apiClient', () => ({
  apiRegister: vi.fn(),
  apiLogin: vi.fn(),
  apiLogout: vi.fn(),
  apiCompletePlanContract: vi.fn(),
}));

import * as api from '../../api/apiClient';

function wrapper({ children }) {
  return React.createElement(AuthProvider, null, children);
}

describe('AuthContext — registerUser', () => {
  it('registra un usuario via API', async () => {
    api.apiRegister.mockResolvedValueOnce({ user: { name: 'Juan', email: 'juan@test.com', roles: ['ROLE_CLIENT'] }, ok: true, clientId: 'id123' });

    const { result } = renderHook(() => useAuth(), { wrapper });

    let registerResult;
    await act(async () => {
      registerResult = await result.current.registerUser('Juan', 'juan@test.com', 'abc123');
    });

    expect(registerResult.ok).toBe(true);
    expect(registerResult.user.name).toBe('Juan');
  });

  it('establece el usuario tras registro exitoso', async () => {
    api.apiRegister.mockResolvedValueOnce({ user: { name: 'Maria', email: 'maria@test.com', roles: ['ROLE_CLIENT'] }, ok: true });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.registerUser('Maria', 'maria@test.com', 'pass123');
    });

    expect(result.current.user).not.toBeNull();
    expect(result.current.user.name).toBe('Maria');
  });

  it('rechaza registro cuando API falla', async () => {
    api.apiRegister.mockRejectedValueOnce(new Error('Email ya registrado'));

    const { result } = renderHook(() => useAuth(), { wrapper });

    let secondResult;
    await act(async () => {
      secondResult = await result.current.registerUser('X', 'dup@test.com', 'pass');
    });

    expect(secondResult.ok).toBe(false);
    expect(secondResult.error).toContain('Email ya registrado');
  });
});

describe('AuthContext — login', () => {
  it('loguea via API correctamente', async () => {
    api.apiLogin.mockResolvedValueOnce({ name: 'Ana', email: 'ana@test.com', roles: ['ROLE_CLIENT'] });

    const { result } = renderHook(() => useAuth(), { wrapper });

    let loginResult;
    await act(async () => {
      loginResult = await result.current.login('ana@test.com', 'clave456');
    });

    expect(loginResult.ok).toBe(true);
    expect(result.current.user.email).toBe('ana@test.com');
  });

  it('rechaza credenciales incorrectas via API', async () => {
    api.apiLogin.mockRejectedValueOnce(new Error('Credenciales incorrectas'));

    const { result } = renderHook(() => useAuth(), { wrapper });

    let loginResult;
    await act(async () => {
      loginResult = await result.current.login('noexiste@test.com', 'mal');
    });

    expect(loginResult.ok).toBe(false);
    expect(result.current.user).toBeNull();
  });
});

describe('AuthContext — isCoach / isClient', () => {
  it('detecta rol coach', async () => {
    api.apiLogin.mockResolvedValueOnce({ name: 'Adrian', email: 'adrian@av.com', roles: ['ROLE_COACH'] });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('adrian@av.com', 'coach123');
    });

    expect(result.current.isCoach).toBe(true);
  });

  it('detecta rol client', async () => {
    api.apiLogin.mockResolvedValueOnce({ name: 'Martina', email: 'martina@gmail.com', roles: ['ROLE_CLIENT'] });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('martina@gmail.com', '1234');
    });

    expect(result.current.isClient).toBe(true);
  });
});

describe('AuthContext completePlanContract', () => {
  it('completa contratacion y establece usuario', async () => {
    api.apiCompletePlanContract.mockResolvedValueOnce({
      contractId: 'contract-1',
      onboardingId: 'onboarding-1',
      user: { name: 'Laura', email: 'laura@test.com', role: 'CLIENT', clientId: 'client-1' },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    let completeResult;
    await act(async () => {
      completeResult = await result.current.completePlanContract('contract-1', {
        name: 'Laura',
        email: 'laura@test.com',
        password: 'abc123',
      });
    });

    expect(completeResult.ok).toBe(true);
    expect(result.current.user.email).toBe('laura@test.com');
    expect(result.current.isClient).toBe(true);
  });
});

describe('AuthContext — logout', () => {
  it('limpia el usuario al hacer logout', async () => {
    api.apiRegister.mockResolvedValueOnce({ user: { name: 'Test', email: 'test@test.com', roles: ['ROLE_CLIENT'] }, ok: true });
    api.apiLogout.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.registerUser('Test', 'test@test.com', 'test123');
    });
    expect(result.current.user).not.toBeNull();

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
  });
});
