import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { screen } from '@testing-library/react';
import VendedorPanel from '../pages/vendedor/Panel';
import Navigation from '../components/Navigation';
import ProtectedRoute from '../components/ProtectedRoute';
import { renderWithProviders, clearStorage } from './helpers';

const VENDEDOR = {
  id: 'U-006',
  nombre: 'Valentina Soto',
  email: 'vendedor@gmail.com',
  rol: 'Vendedor',
  estado: 'activo',
};

const CLIENTE = {
  id: 'U-004',
  nombre: 'Pedro Muñoz',
  email: 'cliente@gmail.com',
  rol: 'Cliente',
  estado: 'activo',
};

function RutasPanel() {
  return (
    <Routes>
      <Route path="/vendedor" element={<VendedorPanel />} />
    </Routes>
  );
}

function RutasProtegidas() {
  return (
    <Routes>
      <Route
        path="/vendedor"
        element={
          <ProtectedRoute roles={['Vendedor']}>
            <div>Panel Vendedor</div>
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<div>Inicio tienda</div>} />
    </Routes>
  );
}

describe('Vendedor - panel de solo lectura', () => {
  beforeEach(() => {
    clearStorage();
  });

  it('muestra las métricas y los pedidos', () => {
    renderWithProviders(<RutasPanel />, { route: '/vendedor', session: VENDEDOR });

    expect(screen.getByText(/Panel de ventas/)).toBeTruthy();
    expect(screen.getByText(/Valentina Soto/)).toBeTruthy();
    expect(screen.getByText('Pedidos totales')).toBeTruthy();
    expect(screen.getByText('Ventas entregadas')).toBeTruthy();
    expect(screen.getAllByText('GC-100001').length).toBeGreaterThan(0);
  });

  it('la navegación muestra su panel y oculta el carrito', () => {
    renderWithProviders(<Navigation />, { session: VENDEDOR });

    expect(screen.getByText('Panel de ventas')).toBeTruthy();
    expect(screen.queryByText(/Cart/)).toBeNull();
  });

  it('ProtectedRoute permite al vendedor', () => {
    renderWithProviders(<RutasProtegidas />, { route: '/vendedor', session: VENDEDOR });

    expect(screen.getByText('Panel Vendedor')).toBeTruthy();
  });

  it('ProtectedRoute redirige al cliente a su home', () => {
    renderWithProviders(<RutasProtegidas />, { route: '/vendedor', session: CLIENTE });

    expect(screen.getByText('Inicio tienda')).toBeTruthy();
    expect(screen.queryByText('Panel Vendedor')).toBeNull();
  });
});
