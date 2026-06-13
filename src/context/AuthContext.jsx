/**
 * @file AuthContext.jsx
 * @description Contexto de autenticación de la aplicación.
 *              Provee funciones de login, registro, logout y acceso demo
 *              tanto para coaches como para clientes.
 *              Los datos se persisten en localStorage.
 */
import React, { createContext, useContext, useState } from 'react';
import { MOCK_USERS } from '../data/seed';

const AuthContext = createContext(null);

// ── Utilidades internas ────────────────────────────────────────────────────────

/**
 * Carga los usuarios registrados desde localStorage.
 * @returns {Array} Lista de usuarios registrados
 */
function loadRegisteredUsers() {
  try {
    const stored = localStorage.getItem('av_registered_users');
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

/**
 * Genera un identificador único.
 * @returns {string} ID único basado en timestamp y valor aleatorio
 */
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

/**
 * Proveedor del contexto de autenticación.
 * Envuelve la aplicación y expone el estado de usuario y funciones de auth.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes hijos
 * @returns {JSX.Element} Provider con el contexto de autenticación
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('av_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  /**
   * Obtiene todos los usuarios (mock + registrados).
   * @returns {Array} Lista combinada de usuarios
   */
  const getAllUsers = () => {
    const registered = loadRegisteredUsers();
    return [...MOCK_USERS, ...registered];
  };

  /**
   * Inicia sesión con email y contraseña.
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {{ ok: boolean, user?: Object, error?: string }} Resultado del login
   */
  const login = (email, password) => {
    const allUsers = getAllUsers();
    const found = allUsers.find(u => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      localStorage.setItem('av_user', JSON.stringify(found));
      return { ok: true, user: found };
    }
    return { ok: false, error: 'Credenciales incorrectas' };
  };

  /**
   * Inicia sesión como usuario demo (coach o cliente).
   * @param {'coach'|'client'} role - Rol del usuario demo
   * @param {string} [clientId=null] - ID del cliente específico (opcional)
   * @returns {Object|undefined} Usuario encontrado o undefined
   */
  const loginAsDemo = (role, clientId = null) => {
    let found;
    if (role === 'coach') {
      found = MOCK_USERS.find(u => u.role === 'coach');
    } else {
      found = MOCK_USERS.find(u => u.role === 'client' && (clientId ? u.clientId === clientId : true));
    }
    if (found) {
      setUser(found);
      localStorage.setItem('av_user', JSON.stringify(found));
      return found;
    }
  };

  /**
   * Registra un nuevo usuario cliente.
   * @param {string} name - Nombre completo
   * @param {string} email - Email (debe ser único)
   * @param {string} password - Contraseña
   * @returns {{ ok: boolean, user?: Object, clientId?: string, error?: string }} Resultado del registro
   */
  const registerUser = (name, email, password) => {
    const allUsers = getAllUsers();
    if (allUsers.find(u => u.email === email)) {
      return { ok: false, error: 'Este email ya está registrado' };
    }
    const clientId = uid();
    const newUser = {
      id: clientId,
      role: 'client',
      name,
      email,
      password,
      clientId,
    };
    const registered = loadRegisteredUsers();
    registered.push(newUser);
    localStorage.setItem('av_registered_users', JSON.stringify(registered));
    setUser(newUser);
    localStorage.setItem('av_user', JSON.stringify(newUser));
    return { ok: true, user: newUser, clientId };
  };

  /** Cierra la sesión del usuario actual. */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('av_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, loginAsDemo, registerUser, logout, isCoach: user?.role === 'coach', isClient: user?.role === 'client' }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook para acceder al contexto de autenticación.
 * Debe usarse dentro de un {@link AuthProvider}.
 *
 * @returns {{
 *   user: Object|null,
 *   login: (email: string, password: string) => { ok: boolean, user?: Object, error?: string },
 *   loginAsDemo: (role: string, clientId?: string) => Object|undefined,
 *   registerUser: (name: string, email: string, password: string) => { ok: boolean, user?: Object, clientId?: string, error?: string },
 *   logout: () => void,
 *   isCoach: boolean,
 *   isClient: boolean
 * }} Contexto de autenticación
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
