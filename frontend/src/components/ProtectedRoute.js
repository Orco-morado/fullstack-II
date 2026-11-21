import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

// Protege rutas: sin sesión redirige a /login; con rol requerido
// y sin permiso redirige a su home según rol.
export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user, homePathFor, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="warning" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (roles && !roles.includes(user.rol)) {
    return <Navigate to={homePathFor(user.rol)} replace />;
  }

  return children;
}
