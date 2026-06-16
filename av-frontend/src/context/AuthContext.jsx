/**
 * @file AuthContext.jsx
 * @description Contexto de autenticación conectado a la API real via JWT.
 *              Usa cookies httpOnly administradas por el backend.
 */
import React, { createContext, useContext, useState } from 'react';
import { apiRegister, apiLogin, apiLogout } from '../api/apiClient';

const AuthContext = createContext(null);

function normalizeUser(data) {
  if (!data) return null;
  const role = data.role || data.roles?.[0] || '';
  return {
    ...data,
    role,
    roles: data.roles || (role ? [`ROLE_${role.replace(/^ROLE_/, '')}`] : []),
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const result = await apiLogin(email, password);
      const normalized = normalizeUser(result);
      setUser(normalized);
      return { ok: true, user: normalized };
    } catch (err) {
      return { ok: false, error: err.message || 'Credenciales incorrectas' };
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (name, email, password) => {
    setLoading(true);
    try {
      const result = await apiRegister(name, email, password);
      const normalized = normalizeUser(result.user || result);
      setUser(normalized);
      return { ok: true, user: normalized, clientId: result.clientId };
    } catch (err) {
      return { ok: false, error: err.message || 'Error al registrar' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try { await apiLogout(); } catch { /* ignore */ }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, login, registerUser, logout, loading,
      isCoach: user?.roles?.includes('ROLE_COACH') || user?.role === 'COACH' || user?.role === 'coach',
      isClient: user?.roles?.includes('ROLE_CLIENT') || user?.role === 'CLIENT' || user?.role === 'client',
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
