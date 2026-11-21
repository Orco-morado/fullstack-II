import React from 'react';
import { screen, fireEvent, within } from '@testing-library/react';
import Orders from '../pages/admin/Orders';
import { renderWithProviders, clearStorage } from './helpers';

const VENDEDOR = {
  id: 'U-006',
  nombre: 'Valentina Soto',
  email: 'vendedor@gmail.com',
  rol: 'Vendedor',
  estado: 'activo',
};

describe('Orders - modo solo lectura para Vendedor', () => {
  beforeEach(() => {
    clearStorage();
  });

  it('oculta crear, asignar y avanzar pedidos', () => {
    renderWithProviders(<Orders readOnly />, { session: VENDEDOR });

    expect(screen.getByText(/Pedidos/)).toBeTruthy();
    expect(screen.getByText('Solo lectura')).toBeTruthy();
    expect(screen.queryByText('+ Nuevo Pedido')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Asignar' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Iniciar ruta' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Entregado' })).toBeNull();
  });

  it('muestra el detalle de un pedido', () => {
    renderWithProviders(<Orders readOnly />, { session: VENDEDOR });

    fireEvent.click(screen.getAllByRole('button', { name: 'Ver' })[0]);

    const modal = screen.getByRole('dialog');
    expect(within(modal).getByText(/Detalle del pedido GC-100001/)).toBeTruthy();
    expect(within(modal).getByText(/Av. Argentina 123/)).toBeTruthy();
    expect(within(modal).getByText(/Cilindro Normal 11 kg/)).toBeTruthy();
  });
});
