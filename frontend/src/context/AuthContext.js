import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authenticate as dbAuthenticate, updateUser as dbUpdateUser } from '../data/db';

const SESSION_KEY = 'gasLaChispaSession';
const AuthContext = createContext(null);

function readSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readSession());

  const login = useCallback((email, password, remember = false) => {
    const result = dbAuthenticate(email, password);
    if (!result.ok) return result;

    const session = result.user;
    setUser(session);
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(SESSION_KEY, JSON.stringify(session));
    return { ok: true, user: session };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  }, []);

  const updateUser = useCallback(
    (changes) => {
      if (!user?.id) return { ok: false, error: 'Sin sesión activa.' };
      const updated = dbUpdateUser(user.id, changes);
      if (!updated) return { ok: false, error: 'Usuario no encontrado.' };
      const session = { ...updated, password: undefined };
      setUser(session);
      const raw = JSON.stringify(session);
      const storage = sessionStorage.getItem(SESSION_KEY) ? sessionStorage : localStorage;
      storage.setItem(SESSION_KEY, raw);
      return { ok: true, user: session };
    },
    [user]
  );

  useEffect(() => {
    // sincroniza entre pestañas
    const onStorage = () => setUser(readSession());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const homePathFor = (rol) => {
    switch (rol) {
      case 'Administrador':
      case 'Operadora':
        return '/admin';
      case 'Repartidor':
        return '/repartidor';
      default:
        return '/';
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.rol === 'Administrador',
    isOperadora: user?.rol === 'Operadora',
    isRepartidor: user?.rol === 'Repartidor',
    isCliente: user?.rol === 'Cliente',
    login,
    logout,
    updateUser,
    homePathFor,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
