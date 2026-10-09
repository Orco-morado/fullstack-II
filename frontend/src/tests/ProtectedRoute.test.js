import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { screen } from '@testing-library/react';
import ProtectedRoute from '../components/ProtectedRoute';
import { renderWithProviders, clearStorage } from './helpers';

function Rutas() {
  return (
    <Routes>
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['Administrador']}>
            <div>Panel Admin</div>
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<div>Formulario de login</div>} />
      <Route path="/" element={<div>Inicio tienda</div>} />
    </Routes>
  );
}

const ADMIN = {
  id: 'U-001',
  nombre: 'Ana García',
  email: 'admin@gmail.com',
  rol: 'Administrador',
  estado: 'activo',
};

const CLIENTE = {
  id: 'U-004',
  nombre: 'Pedro Muñoz',
  email: 'cliente@gmail.com',
  rol: 'Cliente',
  estado: 'activo',
};

describe('ProtectedRoute - renderizado condicional según sesión y rol', () => {
  beforeEach(() => {
    clearStorage();
  });

  it('sin sesión redirige al login y no renderiza la ruta protegida', () => {
    renderWithProviders(<Rutas />, { route: '/admin' });

    expect(screen.getByText('Formulario de login')).toBeTruthy();
    expect(screen.queryByText('Panel Admin')).toBeNull();
  });

  it('con sesión y rol permitido renderiza la ruta protegida', () => {
    renderWithProviders(<Rutas />, { route: '/admin', session: ADMIN });

    expect(screen.getByText('Panel Admin')).toBeTruthy();
    expect(screen.queryByText('Formulario de login')).toBeNull();
  });

  it('con sesión pero rol no permitido redirige al home del usuario', () => {
    renderWithProviders(<Rutas />, { route: '/admin', session: CLIENTE });

    expect(screen.getByText('Inicio tienda')).toBeTruthy();
    expect(screen.queryByText('Panel Admin')).toBeNull();
  });
});
