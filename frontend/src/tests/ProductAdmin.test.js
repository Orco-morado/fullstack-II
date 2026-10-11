import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { screen, fireEvent } from '@testing-library/react';
import ProductNew from '../pages/admin/ProductNew';
import ProductEdit from '../pages/admin/ProductEdit';
import { renderWithProviders, clearStorage } from './helpers';

const ADMIN = {
  id: 'U-001',
  nombre: 'Ana García',
  email: 'admin@gmail.com',
  rol: 'Administrador',
  estado: 'activo',
};

function RutasProducto() {
  return (
    <Routes>
      <Route path="/admin/productos/nuevo" element={<ProductNew />} />
      <Route path="/admin/productos/:id/editar" element={<ProductEdit />} />
      <Route path="/admin/productos" element={<div data-testid="productos-list">Productos</div>} />
    </Routes>
  );
}

describe('ProductNew - CRUD Create producto', () => {
  beforeEach(() => {
    clearStorage();
  });

  it('renderiza el formulario con los campos requeridos', () => {
    renderWithProviders(<RutasProducto />, { route: '/admin/productos/nuevo', session: ADMIN });

    expect(screen.getByRole('heading', { name: /Producto nuevo/ })).toBeTruthy();
    expect(screen.getByPlaceholderText('VOL-050')).toBeTruthy();
    expect(screen.getAllByRole('textbox').length).toBeGreaterThanOrEqual(4);
    expect(screen.getAllByRole('spinbutton').length).toBeGreaterThanOrEqual(3);
    expect(screen.getAllByRole('combobox').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: /Guardar producto/ })).toBeTruthy();
  });

  it('muestra errores al enviar el formulario vacío', () => {
    renderWithProviders(<RutasProducto />, { route: '/admin/productos/nuevo', session: ADMIN });

    fireEvent.click(screen.getByRole('button', { name: /Guardar producto/ }));

    expect(screen.getByText('Nombre requerido')).toBeTruthy();
    expect(screen.getByText('Precio inválido')).toBeTruthy();
    expect(screen.getByText('Stock inválido')).toBeTruthy();
  });

  it('valida el formato del código (solo letras, números y guiones)', () => {
    renderWithProviders(<RutasProducto />, { route: '/admin/productos/nuevo', session: ADMIN });

    fireEvent.change(screen.getByPlaceholderText('VOL-050'), { target: { value: 'INVALIDO@' } });
    fireEvent.click(screen.getByRole('button', { name: /Guardar producto/ }));

    expect(screen.getByText('Solo letras, números y guiones')).toBeTruthy();
  });

  it('llena un formulario válido y no muestra errores', () => {
    renderWithProviders(<RutasProducto />, { route: '/admin/productos/nuevo', session: ADMIN });

    const inputs = screen.getAllByRole('textbox');
    const numbers = screen.getAllByRole('spinbutton');

    fireEvent.change(inputs[1], { target: { value: 'Producto Test' } });
    fireEvent.change(numbers[1], { target: { value: '15000' } });
    fireEvent.change(numbers[2], { target: { value: '20' } });

    fireEvent.click(screen.getByRole('button', { name: /Guardar producto/ }));

    expect(screen.queryByText('Nombre requerido')).toBeNull();
    expect(screen.queryByText('Precio inválido')).toBeNull();
    expect(screen.queryByText('Stock inválido')).toBeNull();
  });

  it('genera código automático cuando se deja vacío', () => {
    renderWithProviders(<RutasProducto />, { route: '/admin/productos/nuevo', session: ADMIN });

    const inputs = screen.getAllByRole('textbox');
    const numbers = screen.getAllByRole('spinbutton');

    fireEvent.change(inputs[1], { target: { value: 'Sin Codigo' } });
    fireEvent.change(numbers[1], { target: { value: '10000' } });
    fireEvent.change(numbers[2], { target: { value: '5' } });

    fireEvent.click(screen.getByRole('button', { name: /Guardar producto/ }));

    expect(screen.queryByText('Solo letras, números y guiones')).toBeNull();
  });

  it('limpia el error de nombre al corregirlo', () => {
    renderWithProviders(<RutasProducto />, { route: '/admin/productos/nuevo', session: ADMIN });

    fireEvent.click(screen.getByRole('button', { name: /Guardar producto/ }));
    expect(screen.getByText('Nombre requerido')).toBeTruthy();

    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[1], { target: { value: 'Ahora sí' } });
    fireEvent.click(screen.getByRole('button', { name: /Guardar producto/ }));

    expect(screen.queryByText('Nombre requerido')).toBeNull();
  });
});

describe('ProductEdit - CRUD Update producto', () => {
  beforeEach(() => {
    clearStorage();
  });

  it('muestra "Producto no encontrado" si el ID no existe', () => {
    renderWithProviders(<RutasProducto />, { route: '/admin/productos/NO-EXISTE/editar', session: ADMIN });

    expect(screen.getByText(/Producto no encontrado/)).toBeTruthy();
    expect(screen.getByRole('button', { name: /Volver/ })).toBeTruthy();
  });

  it('carga los datos del producto existente en el formulario', () => {
    renderWithProviders(<RutasProducto />, { route: '/admin/productos/VOL-011/editar', session: ADMIN });

    expect(screen.getByRole('heading', { name: /Editar producto/ })).toBeTruthy();
    expect(screen.getByText(/Código: VOL-011/)).toBeTruthy();

    const inputs = screen.getAllByRole('textbox');
    const numbers = screen.getAllByRole('spinbutton');
    expect(inputs[0].value).toBe('Cilindro Normal 11 kg');
    expect(Number(numbers[1].value)).toBe(20000);
    expect(Number(numbers[2].value)).toBe(85);
  });

  it('permite editar el nombre y guardar sin errores', () => {
    renderWithProviders(<RutasProducto />, { route: '/admin/productos/VOL-011/editar', session: ADMIN });

    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'Cilindro Editado' } });

    fireEvent.click(screen.getByRole('button', { name: /Guardar cambios/ }));

    expect(screen.queryByText('Nombre requerido')).toBeNull();
  });

  it('valida el nombre obligatorio al editar', () => {
    renderWithProviders(<RutasProducto />, { route: '/admin/productos/VOL-011/editar', session: ADMIN });

    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /Guardar cambios/ }));

    expect(screen.getByText('Nombre requerido')).toBeTruthy();
  });

  it('permite alternar la visibilidad con el switch', () => {
    renderWithProviders(<RutasProducto />, { route: '/admin/productos/VOL-011/editar', session: ADMIN });

    const switchInput = screen.getByRole('checkbox', { name: /Visible en tienda/ });
    expect(switchInput.checked).toBe(true);

    fireEvent.click(switchInput);
    expect(switchInput.checked).toBe(false);
  });

  it('permite cancelar y volver a la lista', () => {
    renderWithProviders(<RutasProducto />, { route: '/admin/productos/VOL-011/editar', session: ADMIN });

    fireEvent.click(screen.getByRole('button', { name: /Cancelar/ }));
    expect(screen.getByTestId('productos-list')).toBeTruthy();
  });
});