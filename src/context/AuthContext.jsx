import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USERS } from '../data/seed';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('av_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const login = (email, password) => {
    const found = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      localStorage.setItem('av_user', JSON.stringify(found));
      return { ok: true, user: found };
    }
    return { ok: false, error: 'Credenciales incorrectas' };
  };

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

  const logout = () => {
    setUser(null);
    localStorage.removeItem('av_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, loginAsDemo, logout, isCoach: user?.role === 'coach', isClient: user?.role === 'client' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
