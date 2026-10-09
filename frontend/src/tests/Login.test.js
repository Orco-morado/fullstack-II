import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { screen, fireEvent } from '@testing-library/react';
import Login from '../pages/Login';
import { renderWithProviders, clearStorage } from './helpers';

function Rutas() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<div>Vista Admin</div>} />
      <Route path="/" element={<div>Vista Tienda</div>} />
    </Routes>
  );
}

describe('Login - estado del formulario', () => {
  beforeEach(() => {
    clearStorage();
  });

  it('el estado cambia cuando el usuario escribe correo y contraseña', () => {
    renderWithProviders(<Rutas />, { route: '/login' });

    const correo = screen.getByPlaceholderText('tu@email.com');
    const clave = screen.getByPlaceholderText('Tu contraseña');

    fireEvent.change(correo, { target: { value: 'admin@gmail.com' } });
    fireEvent.change(clave, { target: { value: 'admin123' } });

    expect(correo.value).toBe('admin@gmail.com');
    expect(clave.value).toBe('admin123');
  });
});

describe('Login - renderizado condicional de errores', () => {
  beforeEach(() => {
    clearStorage();
  });

  it('no muestra errores mientras el formulario está vacío', () => {
    renderWithProviders(<Rutas />, { route: '/login' });

    expect(screen.queryByText('El correo es requerido.')).toBeNull();
    expect(screen.queryByText('La contraseña es requerida.')).toBeNull();
    expect(screen.queryByText('Credenciales inválidas.')).toBeNull();
  });

  it('muestra errores de validación al enviar el formulario vacío', () => {
    renderWithProviders(<Rutas />, { route: '/login' });

    fireEvent.click(screen.getByText('Ingresar'));

    expect(screen.getByText('El correo es requerido.')).toBeTruthy();
    expect(screen.getByText('La contraseña es requerida.')).toBeTruthy();
  });

  it('muestra error de credenciales cuando la contraseña es incorrecta', () => {
    renderWithProviders(<Rutas />, { route: '/login' });

    fireEvent.change(screen.getByPlaceholderText('tu@email.com'), {
      target: { value: 'admin@gmail.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Tu contraseña'), {
      target: { value: 'clave-mala' },
    });
    fireEvent.click(screen.getByText('Ingresar'));

    expect(screen.getByText('Credenciales inválidas.')).toBeTruthy();
    expect(screen.queryByText('Vista Admin')).toBeNull();
  });
});

describe('Login - eventos de sesión', () => {
  beforeEach(() => {
    clearStorage();
  });

  it('con credenciales válidas inicia sesión y redirige al panel del rol', () => {
    renderWithProviders(<Rutas />, { route: '/login' });

    fireEvent.change(screen.getByPlaceholderText('tu@email.com'), {
      target: { value: 'admin@gmail.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Tu contraseña'), {
      target: { value: 'admin123' },
    });
    fireEvent.click(screen.getByText('Ingresar'));

    expect(screen.getByText('Vista Admin')).toBeTruthy();
    expect(screen.queryByText('Inicio de Sesión')).toBeNull();
  });

  it('un cliente válido redirige a la tienda', () => {
    renderWithProviders(<Rutas />, { route: '/login' });

    fireEvent.change(screen.getByPlaceholderText('tu@email.com'), {
      target: { value: 'cliente@gmail.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Tu contraseña'), {
      target: { value: 'cliente123' },
    });
    fireEvent.click(screen.getByText('Ingresar'));

    expect(screen.getByText('Vista Tienda')).toBeTruthy();
  });
});
