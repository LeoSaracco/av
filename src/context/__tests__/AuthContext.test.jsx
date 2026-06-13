// ── Tests para AuthContext ─────────────────────────────────────────────────────
// Prueba registerUser, login, logout, demo access

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import React from 'react';

// Storage mock para aislar localStorage
const storage = {};
beforeEach(() => {
  Object.keys(storage).forEach(k => delete storage[k]);
  vi.stubGlobal('localStorage', {
    getItem: vi.fn((key) => storage[key] || null),
    setItem: vi.fn((key, value) => { storage[key] = value; }),
    removeItem: vi.fn((key) => { delete storage[key]; }),
  });
});

function wrapper({ children }) {
  return React.createElement(AuthProvider, null, children);
}

describe('AuthContext — registerUser', () => {
  it('registra un usuario nuevo correctamente', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    let registerResult;
    act(() => {
      registerResult = result.current.registerUser('Juan Perez', 'juan@test.com', 'abc123');
    });

    expect(registerResult.ok).toBe(true);
    expect(registerResult.user.name).toBe('Juan Perez');
    expect(registerResult.user.email).toBe('juan@test.com');
    expect(registerResult.user.role).toBe('client');
    expect(registerResult.clientId).toBeDefined();
  });

  it('inicia sesion automaticamente al registrarse', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.registerUser('Maria', 'maria@test.com', 'pass123');
    });

    expect(result.current.user).not.toBeNull();
    expect(result.current.user.name).toBe('Maria');
    expect(result.current.isClient).toBe(true);
  });

  it('rechaza emails duplicados', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.registerUser('User1', 'dup@test.com', 'pass1');
    });

    let secondResult;
    act(() => {
      secondResult = result.current.registerUser('User2', 'dup@test.com', 'pass2');
    });

    expect(secondResult.ok).toBe(false);
    expect(secondResult.error).toContain('ya está registrado');
  });

  it('persiste usuarios registrados en localStorage', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.registerUser('Carlos', 'carlos@test.com', 'clave123');
    });

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'av_registered_users',
      expect.any(String)
    );
  });
});

describe('AuthContext — login', () => {
  it('loguea con credenciales registradas', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.registerUser('Ana', 'ana@test.com', 'clave456');
    });
    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();

    let loginResult;
    act(() => {
      loginResult = result.current.login('ana@test.com', 'clave456');
    });

    expect(loginResult.ok).toBe(true);
    expect(result.current.user.email).toBe('ana@test.com');
  });

  it('rechaza credenciales incorrectas', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    let loginResult;
    act(() => {
      loginResult = result.current.login('noexiste@test.com', 'mal');
    });

    expect(loginResult.ok).toBe(false);
    expect(loginResult.error).toBe('Credenciales incorrectas');
    expect(result.current.user).toBeNull();
  });
});

describe('AuthContext — loginAsDemo', () => {
  it('loguea como coach demo', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    let user;
    act(() => {
      user = result.current.loginAsDemo('coach');
    });

    expect(user).not.toBeNull();
    expect(user.role).toBe('coach');
    expect(result.current.isCoach).toBe(true);
  });

  it('loguea como cliente demo especifico', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    let user;
    act(() => {
      user = result.current.loginAsDemo('client', 'c1');
    });

    expect(user).not.toBeNull();
    expect(user.role).toBe('client');
    expect(user.name).toBe('Martina Gómez');
  });
});

describe('AuthContext — logout', () => {
  it('limpia el usuario y localStorage', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.registerUser('Test', 'test@test.com', 'test123');
    });
    expect(result.current.user).not.toBeNull();

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(localStorage.removeItem).toHaveBeenCalledWith('av_user');
  });
});
