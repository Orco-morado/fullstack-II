import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { clearStorage } from './tests/helpers';

describe('App - integración general', () => {
  beforeEach(() => {
    clearStorage();
    // BrowserRouter usa window.location: en Karma la página es /context.html
    window.history.replaceState({}, '', '/');
  });

  it('renderiza la aplicación con navegación y página de inicio', () => {
    render(<App />);

    expect(screen.getAllByText(/Gas La Chispa/).length).toBeGreaterThan(0);
    expect(screen.getByText('Tu Gas a Domicilio Rápido y Seguro')).toBeTruthy();
    expect(screen.getByText('Ver Productos')).toBeTruthy();
    expect(screen.getAllByText('Ver detalle').length).toBe(4);
  });
});
