import React from 'react';
import { screen } from '@testing-library/react';
import Reports from '../pages/admin/Reports';
import { renderWithProviders, clearStorage } from './helpers';

describe('Reports - estados y categorías', () => {
  beforeEach(() => {
    clearStorage();
  });

  it('muestra recibido y no pendiente', () => {
    renderWithProviders(<Reports />);

    expect(screen.getByText('recibido')).toBeTruthy();
    expect(screen.queryByText('pendiente')).toBeNull();
  });

  it('agrupa las ventas por la categoría del producto', () => {
    renderWithProviders(<Reports />);

    expect(screen.getByText('Normal')).toBeTruthy();
    expect(screen.queryByText('General')).toBeNull();
  });
});
