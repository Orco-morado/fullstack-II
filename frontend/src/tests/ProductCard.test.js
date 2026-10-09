import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import ProductCard, { estadoStock } from '../components/ProductCard';
import { renderWithProviders, clearStorage } from './helpers';

const producto = {
  id: 'VOL-011',
  nombre: 'Cilindro Normal 11 kg',
  categoria: 'Normal',
  peso: 11,
  precio: 20000,
  stock: 85,
  imagen: 'cilindro.png',
  descripcion: 'El clásico para hogar',
  activo: true,
};

describe('ProductCard - renderizado y props', () => {
  beforeEach(() => {
    clearStorage();
  });

  it('renderiza las props que recibe (nombre, código, precio y categoría)', () => {
    renderWithProviders(<ProductCard product={producto} />);

    expect(screen.getByText('Cilindro Normal 11 kg')).toBeTruthy();
    expect(screen.getByText('Código: VOL-011')).toBeTruthy();
    expect(screen.getByText('$ 20.000')).toBeTruthy();
    expect(screen.getByText('Normal')).toBeTruthy();
  });

  it('recibe y ejecuta la función onClick enviada por props', () => {
    let llamadas = 0;
    let productoRecibido = null;
    const onAdd = (p) => {
      llamadas += 1;
      productoRecibido = p;
    };

    renderWithProviders(<ProductCard product={producto} onAdd={onAdd} />);
    fireEvent.click(screen.getByText('Añadir al carrito'));

    expect(llamadas).toBe(1);
    expect(productoRecibido).toEqual(producto);
  });

  it('renderiza condicionalmente: sin botón de añadir si el stock es 0', () => {
    const sinStock = { ...producto, id: 'VOL-000', stock: 0 };

    renderWithProviders(<ProductCard product={sinStock} />);

    expect(screen.queryByText('Añadir al carrito')).toBeNull();
    expect(screen.getByText('Stock crítico')).toBeTruthy();
    expect(screen.getByText('Ver detalle')).toBeTruthy();
  });
});

describe('estadoStock - lógica de clasificación de stock', () => {
  it('clasifica el stock en crítico, bajo y ok', () => {
    expect(estadoStock(0)).toBe('critico');
    expect(estadoStock(-3)).toBe('critico');
    expect(estadoStock(5)).toBe('bajo');
    expect(estadoStock(9)).toBe('bajo');
    expect(estadoStock(10)).toBe('ok');
    expect(estadoStock(120)).toBe('ok');
  });
});
