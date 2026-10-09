import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import Contact from '../pages/Contact';
import { renderWithProviders, clearStorage } from './helpers';

describe('Contact - estado del formulario', () => {
  beforeEach(() => {
    clearStorage();
  });

  it('el estado del formulario cambia cuando el usuario escribe', () => {
    renderWithProviders(<Contact />);

    const nombre = screen.getByLabelText('Nombre completo');
    fireEvent.change(nombre, { target: { value: 'María Pérez' } });
    expect(nombre.value).toBe('María Pérez');

    const mensaje = screen.getByLabelText('Describe tu problema o consulta');
    fireEvent.change(mensaje, { target: { value: 'Hola' } });
    expect(mensaje.value).toBe('Hola');
    expect(screen.getByText('4/500 caracteres')).toBeTruthy();
  });
});

describe('Contact - renderizado condicional de errores', () => {
  beforeEach(() => {
    clearStorage();
  });

  it('los mensajes de error no se muestran mientras el formulario es válido/vacío', () => {
    renderWithProviders(<Contact />);

    expect(screen.queryByText('Ingresa tu nombre')).toBeNull();
    expect(screen.queryByText('Correo inválido')).toBeNull();
    expect(screen.queryByText('Escribe tu consulta')).toBeNull();
    expect(
      screen.queryByText('✓ Mensaje enviado. Te responderemos a la brevedad.')
    ).toBeNull();
  });

  it('los mensajes de error aparecen solo al enviar el formulario inválido', () => {
    renderWithProviders(<Contact />);

    fireEvent.click(screen.getByText('Enviar Mensaje'));

    expect(screen.getByText('Ingresa tu nombre')).toBeTruthy();
    expect(screen.getByText('Correo inválido')).toBeTruthy();
    expect(screen.getByText('Escribe tu consulta')).toBeTruthy();
    expect(
      screen.queryByText('✓ Mensaje enviado. Te responderemos a la brevedad.')
    ).toBeNull();
  });
});

describe('Contact - eventos de envío', () => {
  beforeEach(() => {
    clearStorage();
  });

  it('al enviar datos válidos se muestra la confirmación y se limpia el formulario', () => {
    renderWithProviders(<Contact />);

    fireEvent.change(screen.getByLabelText('Nombre completo'), {
      target: { value: 'María Pérez' },
    });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), {
      target: { value: 'maria@correo.cl' },
    });
    fireEvent.change(screen.getByLabelText('Describe tu problema o consulta'), {
      target: { value: 'Necesito recargar mi cilindro.' },
    });
    fireEvent.click(screen.getByText('Enviar Mensaje'));

    expect(
      screen.getByText('✓ Mensaje enviado. Te responderemos a la brevedad.')
    ).toBeTruthy();
    expect(screen.queryByText('Ingresa tu nombre')).toBeNull();
    expect(screen.getByText('0/500 caracteres')).toBeTruthy();
  });
});
