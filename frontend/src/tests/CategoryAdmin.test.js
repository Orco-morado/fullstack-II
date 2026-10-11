import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { screen, fireEvent } from '@testing-library/react';
import CategoryNew from '../pages/admin/CategoryNew';
import { renderWithProviders, clearStorage } from './helpers';

const ADMIN = {
  id: 'U-001',
  nombre: 'Ana García',
  email: 'admin@gmail.com',
  rol: 'Administrador',
  estado: 'activo',
};

function RutasCategoria() {
  return (
    <Routes>
      <Route path="/admin/categoria-nueva" element={<CategoryNew />} />
      <Route path="/admin" element={<div data-testid="admin-panel">Panel</div>} />
    </Routes>
  );
}

describe('CategoryNew - CRUD Create categoría', () => {
  beforeEach(() => {
    clearStorage();
  })

  it('renderiza el formulario de nueva categoría', () => {
    renderWithProviders(<RutasCategoria />, { route: '/admin/categoria-nueva', session: ADMIN });

    expect(screen.getByRole('heading', { name: /Nueva categoría/ })).toBeTruthy()
    expect(screen.getByPlaceholderText('Ej: Residencial')).toBeTruthy()
    expect(screen.getAllByRole('textbox').length).toBeGreaterThanOrEqual(2)
    expect(screen.getByRole('button', { name: /Crear categoría/ })).toBeTruthy()
    expect(screen.getByText(/Cancelar/)).toBeTruthy()
  })

  it('muestra categorías existentes', () => {
    renderWithProviders(<RutasCategoria />, { route: '/admin/categoria-nueva', session: ADMIN })

    expect(screen.getByText(/Categorías existentes/)).toBeTruthy()
    expect(screen.getByText(/Normal/)).toBeTruthy()
  })

  it('valida que el nombre sea obligatorio', () => {
    renderWithProviders(<RutasCategoria />, { route: '/admin/categoria-nueva', session: ADMIN })

    fireEvent.click(screen.getByRole('button', { name: /Crear categoría/ }))

    expect(screen.getByText(/El nombre es obligatorio/)).toBeTruthy()
  })

  it('valida que no exista una categoría con el mismo nombre (case-insensitive)', () => {
    renderWithProviders(<RutasCategoria />, { route: '/admin/categoria-nueva', session: ADMIN })

    fireEvent.change(screen.getByPlaceholderText('Ej: Residencial'), { target: { value: '  normal  ' } })
    fireEvent.click(screen.getByRole('button', { name: /Crear categoría/ }))

    expect(screen.getByText(/Ya existe una categoría con ese nombre/)).toBeTruthy()
  })

  it('llenar formulario válido no lanza error', () => {
    renderWithProviders(<RutasCategoria />, { route: '/admin/categoria-nueva', session: ADMIN })

    fireEvent.change(screen.getByPlaceholderText('Ej: Residencial'), { target: { value: 'Nueva Categoría' } })
    fireEvent.change(screen.getAllByRole('textbox')[1], { target: { value: 'Descripción de prueba' } })

    fireEvent.click(screen.getByRole('button', { name: /Crear categoría/ }))

    expect(screen.queryByText(/El nombre es obligatorio/)).toBeNull()
    expect(screen.queryByText(/Ya existe una categoría con ese nombre/)).toBeNull()
  })

  it('limpia el formulario después de crear exitosamente', () => {
    renderWithProviders(<RutasCategoria />, { route: '/admin/categoria-nueva', session: ADMIN })

    fireEvent.change(screen.getByPlaceholderText('Ej: Residencial'), { target: { value: 'Otra Categoría' } })
    fireEvent.change(screen.getAllByRole('textbox')[1], { target: { value: 'Desc' } })
    fireEvent.click(screen.getByRole('button', { name: /Crear categoría/ }))

    expect(screen.getByPlaceholderText('Ej: Residencial').value).toBe('')
    expect(screen.getAllByRole('textbox')[1].value).toBe('')
  })

  it('limpia error al corregir el nombre', () => {
    renderWithProviders(<RutasCategoria />, { route: '/admin/categoria-nueva', session: ADMIN })

    fireEvent.click(screen.getByRole('button', { name: /Crear categoría/ }))
    expect(screen.getByText(/El nombre es obligatorio/)).toBeTruthy()

    fireEvent.change(screen.getByPlaceholderText('Ej: Residencial'), { target: { value: 'Válida' } })
    fireEvent.click(screen.getByRole('button', { name: /Crear categoría/ }))

    expect(screen.queryByText(/El nombre es obligatorio/)).toBeNull()
  })

  it('respeta maxLength en nombre (50) y descripción (200)', () => {
    renderWithProviders(<RutasCategoria />, { route: '/admin/categoria-nueva', session: ADMIN })

    const nombreInput = screen.getByPlaceholderText('Ej: Residencial')
    const descInput = screen.getAllByRole('textbox')[1]

    // Verificar que el input tiene maxLength=50
    expect(nombreInput.getAttribute('maxlength')).toBe('50')
    expect(descInput.getAttribute('maxlength')).toBe('200')
  })

  it('permite cancelar y volver al panel', () => {
    renderWithProviders(<RutasCategoria />, { route: '/admin/categoria-nueva', session: ADMIN })

    fireEvent.click(screen.getByText(/Cancelar/))
    expect(screen.getByTestId('admin-panel')).toBeTruthy()
  })
})