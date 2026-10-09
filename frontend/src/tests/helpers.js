import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { DataProvider } from '../context/DataContext';

export const KEYS = {
  db: 'gasLaChispaDB',
  cart: 'gasLaChispaCart',
  session: 'gasLaChispaSession',
};

export function clearStorage() {
  localStorage.removeItem(KEYS.db);
  localStorage.removeItem(KEYS.cart);
  localStorage.removeItem(KEYS.session);
  sessionStorage.removeItem(KEYS.session);
}

export function seedSession(session) {
  localStorage.setItem(KEYS.session, JSON.stringify(session));
}

export function seedCart(items) {
  localStorage.setItem(KEYS.cart, JSON.stringify(items));
}

export function renderWithProviders(ui, options = {}) {
  const { route = '/', session = null } = options;
  if (session) seedSession(session);

  return render(
    <AuthProvider>
      <CartProvider>
        <DataProvider>
          <MemoryRouter initialEntries={[route]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            {ui}
          </MemoryRouter>
        </DataProvider>
      </CartProvider>
    </AuthProvider>
  );
}
