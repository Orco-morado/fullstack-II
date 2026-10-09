import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import Cart from '../pages/Cart';
import { renderWithProviders, clearStorage, seedCart } from './helpers';

const ITEM = {
  id: 'VOL-005',
  nombre: 'Cilindro Normal 5 kg',
  precio: 11500,
  imagen: 'cilindro.png',
  cantidad: 2,
};

describe('Cart - renderizado condicional', () => {
  beforeEach(() => {
    clearStorage();
  });

  it('muestra el aviso de carrito vacío solo cuando no hay ítems', () => {
    renderWithProviders(<Cart />);

    expect(screen.getByText('Tu carrito está vacío.')).toBeTruthy();
    expect(screen.queryByText('Ir a pagar')).toBeNull();
  });

  it('renderiza los ítems y el total cuando hay productos', () => {
    seedCart([ITEM]);
    renderWithProviders(<Cart />);

    expect(screen.getByText('Cilindro Normal 5 kg')).toBeTruthy();
    expect(screen.getByText('Ir a pagar')).toBeTruthy();
    expect(screen.queryByText('Tu carrito está vacío.')).toBeNull();
    expect(screen.getAllByText('$ 23.000').length).toBeGreaterThan(0);
  });
});

describe('Cart - eventos sobre el estado del carrito', () => {
  beforeEach(() => {
    clearStorage();
    seedCart([ITEM]);
  });

  it('el botón + aumenta la cantidad del producto', () => {
    renderWithProviders(<Cart />);

    expect(screen.getByDisplayValue('2')).toBeTruthy();

    fireEvent.click(screen.getByText('+'));
    expect(screen.getByDisplayValue('3')).toBeTruthy();
  });

  it('el botón − disminuye la cantidad del producto', () => {
    renderWithProviders(<Cart />);

    fireEvent.click(screen.getByText('−'));
    expect(screen.getByDisplayValue('1')).toBeTruthy();
  });

  it('el botón 🗑 elimina el producto y activa el estado vacío', () => {
    renderWithProviders(<Cart />);

    fireEvent.click(screen.getByText('🗑'));
    expect(screen.getByText('Tu carrito está vacío.')).toBeTruthy();
    expect(screen.queryByText('Cilindro Normal 5 kg')).toBeNull();
  });

  it('"Vaciar carrito" vacía todos los ítems', () => {
    renderWithProviders(<Cart />);

    fireEvent.click(screen.getByText('Vaciar carrito'));
    expect(screen.getByText('Tu carrito está vacío.')).toBeTruthy();
  });
});
