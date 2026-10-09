import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import Products from '../pages/Products';
import { renderWithProviders, clearStorage } from './helpers';

const NOMBRES_SEMILLA = [
  'Cilindro Normal 5 kg',
  'Cilindro Normal 11 kg',
  'Cilindro Normal 15 kg',
  'Cilindro Normal 45 kg',
  'Cilindro Catalítico 11 kg',
  'Cilindro Aluminio 15 kg',
  'Carga a Granel (desde 100 litros)',
];

describe('Products - renderizado de listas', () => {
  beforeEach(() => {
    clearStorage();
  });

  it('renderiza todos los elementos del conjunto de datos', () => {
    renderWithProviders(<Products />);

    expect(screen.getAllByText('Ver detalle').length).toBe(7);
    NOMBRES_SEMILLA.forEach((nombre) => {
      expect(screen.getAllByText(nombre).length).toBeGreaterThan(0);
    });
  });

  it('muestra todos las opciones de categoría en el filtro', () => {
    renderWithProviders(<Products />);

    const select = screen.getByLabelText('Filtrar por categoría');
    const opciones = Array.from(select.options).map((o) => o.value);
    expect(opciones.length).toBe(6);
    expect(opciones.indexOf('Industrial')).toBeGreaterThan(-1);
    expect(opciones.indexOf('Catalítico')).toBeGreaterThan(-1);
  });
});

describe('Products - estado y renderizado condicional', () => {
  beforeEach(() => {
    clearStorage();
  });

  it('el estado de búsqueda filtra la lista de productos', () => {
    renderWithProviders(<Products />);

    fireEvent.change(screen.getByLabelText('Buscar productos'), {
      target: { value: 'catalítico' },
    });

    expect(screen.getAllByText('Ver detalle').length).toBe(1);
    expect(screen.getByText('Cilindro Catalítico 11 kg')).toBeTruthy();
  });

  it('muestra el mensaje de "sin resultados" solo cuando el filtro no encuentra nada', () => {
    renderWithProviders(<Products />);

    expect(screen.queryByText('No hay productos que coincidan con los filtros.')).toBeNull();

    fireEvent.change(screen.getByLabelText('Buscar productos'), {
      target: { value: 'producto inexistente zzz' },
    });

    expect(screen.getByText('No hay productos que coincidan con los filtros.')).toBeTruthy();
    expect(screen.queryByText('Ver detalle')).toBeNull();
  });

  it('el botón Limpiar reinicia el estado de búsqueda', () => {
    renderWithProviders(<Products />);

    const input = screen.getByLabelText('Buscar productos');
    fireEvent.change(input, { target: { value: 'aluminio' } });
    expect(screen.getAllByText('Ver detalle').length).toBe(1);

    fireEvent.click(screen.getByText('Limpiar'));
    expect(screen.getAllByText('Ver detalle').length).toBe(7);
    expect(input.value).toBe('');
  });
});
