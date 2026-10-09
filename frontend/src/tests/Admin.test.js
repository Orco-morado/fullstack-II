import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { screen, fireEvent } from '@testing-library/react';
import Dashboard from '../pages/admin/Dashboard';
import ProductsAdmin from '../pages/admin/Products';
import Users from '../pages/admin/Users';
import { renderWithProviders, clearStorage } from './helpers';

const ADMIN = {
  id: 'U-001',
  nombre: 'Ana García',
  email: 'admin@gmail.com',
  rol: 'Administrador',
  estado: 'activo',
};

function Rutas() {
  return (
    <Routes>
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/admin/productos" element={<ProductsAdmin />} />
      <Route path="/admin/usuarios" element={<Users />} />
    </Routes>
  );
}

describe('Dashboard - renderizado de KPIs y accesos', () => {
  beforeEach(() => {
    clearStorage();
  });

  it('renderiza los indicadores y el saludo del usuario en sesión', () => {
    renderWithProviders(<Rutas />, { route: '/admin', session: ADMIN });

    expect(screen.getByText('Dashboard')).toBeTruthy();
    expect(screen.getByText(/Hola Ana García/)).toBeTruthy();
    expect(screen.getByText('Pedidos totales')).toBeTruthy();
    expect(screen.getByText('Ventas entregadas')).toBeTruthy();
    expect(screen.getByText('Productos con stock bajo')).toBeTruthy();
  });

  it('lista los accesos rápidos del panel', () => {
    renderWithProviders(<Rutas />, { route: '/admin', session: ADMIN });

    expect(screen.getByText('📋 Órdenes')).toBeTruthy();
    expect(screen.getByText('📦 Productos')).toBeTruthy();
    expect(screen.getByText('👥 Usuarios')).toBeTruthy();
    expect(screen.getByText('📊 Reportes')).toBeTruthy();
    expect(screen.getByText('🏷️ Categoría nueva')).toBeTruthy();
  });
});

describe('Productos admin - listas y renderizado condicional', () => {
  beforeEach(() => {
    clearStorage();
  });

  it('renderiza la lista completa de productos del catálogo', () => {
    renderWithProviders(<Rutas />, { route: '/admin/productos', session: ADMIN });

    expect(screen.getByText('Cilindro Normal 11 kg')).toBeTruthy();
    expect(screen.getByText('Cilindro Aluminio 15 kg')).toBeTruthy();
    expect(screen.getByText(/Lista \(7\)/)).toBeTruthy();
  });

  it('filtra la lista con la búsqueda de productos', () => {
    renderWithProviders(<Rutas />, { route: '/admin/productos', session: ADMIN });

    fireEvent.change(screen.getByPlaceholderText('🔍 Buscar por nombre o código...'), {
      target: { value: 'aluminio' },
    });

    expect(screen.getByText('Cilindro Aluminio 15 kg')).toBeTruthy();
    expect(screen.queryByText('Cilindro Normal 11 kg')).toBeNull();
  });

  it('muestra la pestaña de stock crítico con los productos bajo mínimo', () => {
    renderWithProviders(<Rutas />, { route: '/admin/productos', session: ADMIN });

    fireEvent.click(screen.getByText(/Críticos/));

    expect(screen.getByText('Reponer stock')).toBeTruthy();
    expect(screen.getAllByText('Cilindro Normal 45 kg').length).toBeGreaterThan(0);
  });
});

describe('Usuarios admin - listas y filtros', () => {
  beforeEach(() => {
    clearStorage();
  });

  it('renderiza todos los usuarios registrados', () => {
    renderWithProviders(<Rutas />, { route: '/admin/usuarios', session: ADMIN });

    expect(screen.getByText(/Lista \(5\)/)).toBeTruthy();
    expect(screen.getAllByText('Ana García').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Pedro Muñoz').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Lucía Herrera').length).toBeGreaterThan(0);
  });

  it('filtra usuarios por búsqueda', () => {
    renderWithProviders(<Rutas />, { route: '/admin/usuarios', session: ADMIN });

    fireEvent.change(screen.getByPlaceholderText('🔍 Buscar por nombre, email o RUN...'), {
      target: { value: 'repartidor@gmail' },
    });

    expect(screen.getAllByText('Carlos Rojas').length).toBeGreaterThan(0);
    expect(screen.queryByText('María López')).toBeNull();
  });
});
