import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protege rutas: sin sesión redirige a /login; con rol requerido
// y sin permiso redirige a su home según rol.
export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user, homePathFor } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (roles && !roles.includes(user.rol)) {
    return <Navigate to={homePathFor(user.rol)} replace />;
  }

  return children;
}
