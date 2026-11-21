import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authenticate as dbAuthenticate, updateUser as dbUpdateUser } from '../data/db';
import { USE_LOCAL, api, getToken, setToken, clearToken, TOKEN_KEY } from '../api';

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

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}

function sessionArea() {
  return sessionStorage.getItem(SESSION_KEY) ? sessionStorage : localStorage;
}

function persistSession(session, remember) {
  const storage = remember === true ? localStorage : remember === false ? sessionStorage : sessionArea();
  const other = storage === localStorage ? sessionStorage : localStorage;
  storage.setItem(SESSION_KEY, JSON.stringify(session));
  other.removeItem(SESSION_KEY);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readSession());
  const [initializing, setInitializing] = useState(!USE_LOCAL);

  useEffect(() => {
    if (USE_LOCAL) {
      setInitializing(false);
      return;
    }

    if (!getToken()) {
      if (readSession()) {
        clearSession();
        setUser(null);
      }
      setInitializing(false);
      return;
    }

    let active = true;
    const remember = !!localStorage.getItem(TOKEN_KEY);
    api.post('/auth/refresh')
      .then((res) => {
        if (!active) return;
        setToken(res.token, remember);
        setUser(res.usuario);
        persistSession(res.usuario, remember);
      })
      .catch(() => {
        if (!active) return;
        clearToken();
        clearSession();
        setUser(null);
      })
      .finally(() => {
        if (active) setInitializing(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback((email, password, remember = false) => {
    if (USE_LOCAL) {
      const result = dbAuthenticate(email, password);
      if (!result.ok) return result;

      const session = result.user;
      setUser(session);
      persistSession(session, remember);
      return { ok: true, user: session };
    }

    return api
      .post('/auth/login', { email, password }, { auth: false })
      .then((res) => {
        const session = res.usuario;
        setToken(res.token, remember);
        setUser(session);
        persistSession(session, remember);
        setInitializing(false);
        return { ok: true, user: session };
      })
      .catch((err) => ({ ok: false, error: err.message }));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setInitializing(false);
    clearSession();
    clearToken();
  }, []);

  useEffect(() => {
    const onExpired = () => logout();
    window.addEventListener('auth:expired', onExpired);
    return () => window.removeEventListener('auth:expired', onExpired);
  }, [logout]);

  const updateUser = useCallback(
    (changes) => {
      if (!user?.id) return { ok: false, error: 'Sin sesión activa.' };

      if (USE_LOCAL) {
        const updated = dbUpdateUser(user.id, changes);
        if (!updated) return { ok: false, error: 'Usuario no encontrado.' };
        const session = { ...updated, password: undefined };
        setUser(session);
        persistSession(session);
        return { ok: true, user: session };
      }

      const { password, ...perfil } = changes;
      return api
        .put('/auth/me', perfil)
        .then((updated) => {
          const session = { ...updated, password: undefined };
          setUser(session);
          persistSession(session);
          return { ok: true, user: session };
        })
        .catch((err) => ({ ok: false, error: err.message }));
    },
    [user]
  );

  const changePassword = useCallback(
    (actual, nueva) => {
      if (!user?.id) return { ok: false, error: 'Sin sesión activa.' };

      if (USE_LOCAL) {
        const result = dbAuthenticate(user.email, actual);
        if (!result.ok) return { ok: false, error: 'La contraseña actual no coincide.' };
        const updated = dbUpdateUser(user.id, { password: nueva });
        if (!updated) return { ok: false, error: 'Usuario no encontrado.' };
        return { ok: true };
      }

      return api
        .put('/auth/password', { actual, nueva })
        .then(() => ({ ok: true }))
        .catch((err) => ({ ok: false, error: err.message }));
    },
    [user]
  );

  useEffect(() => {
    const onStorage = () => setUser(readSession());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const homePathFor = (rol) => {
    switch (rol) {
      case 'Administrador':
      case 'Operadora':
        return '/admin';
      case 'Vendedor':
        return '/vendedor';
      case 'Repartidor':
        return '/repartidor';
      default:
        return '/';
    }
  };

  const value = {
    user,
    initializing,
    isAuthenticated: !!user,
    isAdmin: user?.rol === 'Administrador',
    isOperadora: user?.rol === 'Operadora',
    isVendedor: user?.rol === 'Vendedor',
    isRepartidor: user?.rol === 'Repartidor',
    isCliente: user?.rol === 'Cliente',
    login,
    logout,
    updateUser,
    changePassword,
    homePathFor,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
