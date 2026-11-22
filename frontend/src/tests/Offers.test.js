import React from 'react';
import { screen } from '@testing-library/react';
import Offers from '../pages/Offers';
import { estaVigente, formatearVigencia } from '../utils/ofertas';
import { renderWithProviders, clearStorage } from './helpers';

describe('ofertas - reglas de vigencia', () => {
  it('compara la vigencia con la fecha local sin desfase UTC', () => {
    const oferta = { vigencia: '2030-12-31' };

    expect(estaVigente(oferta, new Date(2030, 11, 31))).toBe(true);
    expect(estaVigente(oferta, new Date(2031, 0, 1))).toBe(false);
  });

  it('formatea la vigencia directamente desde el string', () => {
    expect(formatearVigencia('2030-12-31')).toBe('31-12-2030');
  });
});

describe('Offers - renderizado de ofertas vigentes', () => {
  beforeEach(() => {
    clearStorage();
  });

  it('oculta las ofertas vencidas y muestra la vigencia formateada', () => {
    renderWithProviders(<Offers />);

    expect(screen.queryByText('2x1 en Cilindros de 5 kg')).toBeNull();
    expect(screen.getByText('15% dcto. en Cilindro 15 kg')).toBeTruthy();
    expect(screen.getByText('Válido hasta 31-12-2030')).toBeTruthy();
  });
});
