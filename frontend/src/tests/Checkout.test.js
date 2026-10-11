import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { screen, fireEvent, within } from '@testing-library/react';
import Checkout from '../pages/Checkout';
import { renderWithProviders, clearStorage, seedCart } from './helpers';

const ITEM = {
  id: 'VOL-005',
  nombre: 'Cilindro Normal 5 kg',
  precio: 11500,
  imagen: 'cilindro.png',
  cantidad: 2,
};

function Rutas() {
  return (
    <Routes>
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/pago-correcto" element={<div>Pago Correcto</div>} />
      <Route path="/pago-error" element={<div>Pago Error</div>} />
      <Route path="/productos" element={<div>Catálogo</div>} />
    </Routes>
  );
}

function llenarFormulario(container, { email = '' } = {}) {
  fireEvent.change(screen.getByLabelText(/Nombre completo/), {
    target: { value: 'Pedro Muñoz' },
  });
  fireEvent.change(screen.getByLabelText(/Teléfono/), {
    target: { value: '+56 9 4444 4444' },
  });
  if (email) {
    fireEvent.change(screen.getByLabelText(/Correo electrónico/), {
      target: { value: email },
    });
  }
  fireEvent.change(screen.getByLabelText(/Dirección exacta/), {
    target: { value: 'Av. Argentina 123' },
  });
  fireEvent.change(screen.getByLabelText(/^Comuna/), {
    target: { value: 'Chillan' },
  });
  fireEvent.click(within(container).getByRole('checkbox'));
}

describe('Checkout - renderizado condicional', () => {
  beforeEach(() => {
    clearStorage();
  });

  it('muestra el aviso de carrito vacío solo cuando no hay ítems', () => {
    renderWithProviders(<Rutas />, { route: '/checkout' });

    expect(screen.getByText('No tienes productos para pagar.')).toBeTruthy();
    expect(screen.queryByText('Confirmar Pedido')).toBeNull();
  });
});

describe('Checkout - validación y eventos', () => {
  let container;

  beforeEach(() => {
    clearStorage();
    seedCart([ITEM]);
  });

  it('los errores aparecen solo al confirmar un formulario incompleto', () => {
    ({ container } = renderWithProviders(<Rutas />, { route: '/checkout' }));

    expect(screen.queryByText('El nombre es obligatorio')).toBeNull();

    fireEvent.click(screen.getByText('Confirmar Pedido'));

    expect(screen.getByText('El nombre es obligatorio')).toBeTruthy();
    expect(screen.getByText('Debes aceptar los términos')).toBeTruthy();
    expect(screen.queryByText('Pago Correcto')).toBeNull();
  });

  it('al confirmar con datos válidos crea el pedido, vacía el carrito y navega al pago correcto', () => {
    ({ container } = renderWithProviders(<Rutas />, { route: '/checkout' }));
    llenarFormulario(container);

    fireEvent.click(screen.getByText('Confirmar Pedido'));

    expect(screen.getByText('Pago Correcto')).toBeTruthy();
    expect(localStorage.getItem('gasLaChispaCart')).toBe('[]');
  });

  it('simula el error de pasarela con un correo que contiene "error"', () => {
    ({ container } = renderWithProviders(<Rutas />, { route: '/checkout' }));
    llenarFormulario(container, { email: 'error@correo.cl' });

    fireEvent.click(screen.getByText('Confirmar Pedido'));

    expect(screen.getByText('Pago Error')).toBeTruthy();
  });
});
