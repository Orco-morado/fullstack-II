import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { screen, fireEvent } from '@testing-library/react';
import UserNew from '../pages/admin/UserNew';
import UserEdit from '../pages/admin/UserEdit';
import { renderWithProviders, clearStorage } from './helpers';

const ADMIN = {
  id: 'U-001',
  nombre: 'Ana García',
  email: 'admin@gmail.com',
  rol: 'Administrador',
  estado: 'activo',
};

function RutasUsuario() {
  return (
    <Routes>
      <Route path="/admin/usuarios/nuevo" element={<UserNew />} />
      <Route path="/admin/usuarios/:id/editar" element={<UserEdit />} />
      <Route path="/admin/usuarios" element={<div data-testid="usuarios-list">Usuarios</div>} />
    </Routes>
  );
}

function getSelects() {
  return screen.getAllByRole('combobox');
}

function getPasswordInput() {
  return screen.getByLabelText('Contraseña');
}

describe('UserNew - CRUD Create usuario', () => {
  beforeEach(() => {
    clearStorage();
  });

  it('renderiza el formulario con campos obligatorios', () => {
    renderWithProviders(<RutasUsuario />, { route: '/admin/usuarios/nuevo', session: ADMIN });

    expect(screen.getByRole('heading', { name: /Usuario nuevo/ })).toBeTruthy();
    expect(screen.getAllByRole('textbox').length).toBeGreaterThanOrEqual(5);
    expect(screen.getAllByRole('combobox').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByRole('button', { name: /Crear usuario/ })).toBeTruthy();
  });

  it('valida RUN con formato inválido', () => {
    renderWithProviders(<RutasUsuario />, { route: '/admin/usuarios/nuevo', session: ADMIN });

    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'abc' } });
    fireEvent.click(screen.getByRole('button', { name: /Crear usuario/ }));

    expect(screen.getByText(/RUN inválido/)).toBeTruthy();
  })

  it('valida RUN con formato correcto (7-8 dígitos + k opcional)', () => {
    renderWithProviders(<RutasUsuario />, { route: '/admin/usuarios/nuevo', session: ADMIN });

    const inputs = screen.getAllByRole('textbox');
    const selects = getSelects();

    fireEvent.change(inputs[0], { target: { value: '19011022k' } });
    fireEvent.change(inputs[1], { target: { value: 'Juan Pérez' } });
    fireEvent.change(inputs[2], { target: { value: 'juan@test.cl' } });
    fireEvent.change(getPasswordInput(), { target: { value: '1234' } });
    fireEvent.change(selects[0], { target: { value: 'Cliente' } });
    fireEvent.change(selects[1], { target: { value: 'Chillan' } });
    fireEvent.change(inputs[4], { target: { value: 'Calle Falsa 123' } });

    fireEvent.click(screen.getByRole('button', { name: /Crear usuario/ }));

    expect(screen.queryByText(/RUN inválido/)).toBeNull();
  })

  it('valida email con formato inválido', () => {
    renderWithProviders(<RutasUsuario />, { route: '/admin/usuarios/nuevo', session: ADMIN });

    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[2], { target: { value: 'no-es-email' } });
    fireEvent.click(screen.getByRole('button', { name: /Crear usuario/ }));

    expect(screen.getByText(/Correo inválido/)).toBeTruthy();
  })

  it('valida contraseña entre 4 y 10 caracteres', () => {
    renderWithProviders(<RutasUsuario />, { route: '/admin/usuarios/nuevo', session: ADMIN });

    const passwordInput = getPasswordInput();
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /Crear usuario/ }));

    expect(screen.getByText(/Entre 4 y 10 caracteres/)).toBeTruthy();

    fireEvent.change(passwordInput, { target: { value: '12345678901' } });
    fireEvent.click(screen.getByRole('button', { name: /Crear usuario/ }));

    expect(screen.getByText(/Entre 4 y 10 caracteres/)).toBeTruthy();

    fireEvent.change(passwordInput, { target: { value: '12345' } });
    fireEvent.click(screen.getByRole('button', { name: /Crear usuario/ }));

    expect(screen.queryByText(/Entre 4 y 10 caracteres/)).toBeNull();
  })

  it('llenar formulario válido no lanza error', () => {
    renderWithProviders(<RutasUsuario />, { route: '/admin/usuarios/nuevo', session: ADMIN });

    const inputs = screen.getAllByRole('textbox');
    const selects = getSelects();
    const passwordInput = getPasswordInput();

    fireEvent.change(inputs[0], { target: { value: '11222333k' } });
    fireEvent.change(inputs[1], { target: { value: 'Nuevo Usuario' } });
    fireEvent.change(inputs[2], { target: { value: 'nuevo@test.cl' } });
    fireEvent.change(passwordInput, { target: { value: 'pass123' } });
    fireEvent.change(inputs[3], { target: { value: '+56912345678' } });
    fireEvent.change(selects[0], { target: { value: 'Cliente' } });
    fireEvent.change(selects[1], { target: { value: 'Chillan' } });
    fireEvent.change(inputs[4], { target: { value: 'Calle Falsa 123' } });

    fireEvent.click(screen.getByRole('button', { name: /Crear usuario/ }));

    expect(screen.queryByText(/RUN inválido/)).toBeNull();
    expect(screen.queryByText(/Correo inválido/)).toBeNull();
    expect(screen.queryByText(/Entre 4 y 10 caracteres/)).toBeNull();
  })

  it('muestra roles disponibles: Administrador, Operadora, Repartidor, Cliente', () => {
    renderWithProviders(<RutasUsuario />, { route: '/admin/usuarios/nuevo', session: ADMIN });

    const rolSelect = getSelects()[0];
    expect(rolSelect.value).toBe('Cliente');
    fireEvent.change(rolSelect, { target: { value: 'Administrador' } });
    expect(rolSelect.value).toBe('Administrador');
    fireEvent.change(rolSelect, { target: { value: 'Repartidor' } });
    expect(rolSelect.value).toBe('Repartidor');
  })

  it('limpia errores al corregir campos', () => {
    renderWithProviders(<RutasUsuario />, { route: '/admin/usuarios/nuevo', session: ADMIN });

    fireEvent.click(screen.getByRole('button', { name: /Crear usuario/ }));
    expect(screen.getByText(/RUN inválido/)).toBeTruthy();

    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: '19011022k' } });
    fireEvent.click(screen.getByRole('button', { name: /Crear usuario/ }));
    expect(screen.queryByText(/RUN inválido/)).toBeNull();
  })
});

describe('UserEdit - CRUD Update usuario', () => {
  beforeEach(() => {
    clearStorage();
  })

  it('renderiza "Usuario no encontrado" si el ID no existe', () => {
    renderWithProviders(<RutasUsuario />, { route: '/admin/usuarios/NO-EXISTE/editar', session: ADMIN });

    expect(screen.getByText(/Usuario no encontrado/)).toBeTruthy();
    expect(screen.getByText(/Volver/)).toBeTruthy();
  })

  it('carga los datos del usuario existente en el formulario', () => {
    renderWithProviders(<RutasUsuario />, { route: '/admin/usuarios/U-002/editar', session: ADMIN });

    expect(screen.getByRole('heading', { name: /Editar usuario/ })).toBeTruthy();
    const inputs = screen.getAllByRole('textbox');
    expect(inputs[0].value).toBe('María López');
    expect(inputs[1].value).toBe('operadora@gmail.com');
    expect(getSelects()[0].value).toBe('Operadora');
    expect(getSelects()[1].value).toBe('activo');
  })

  it('permite editar nombre, email y teléfono', () => {
    renderWithProviders(<RutasUsuario />, { route: '/admin/usuarios/U-002/editar', session: ADMIN });

    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'Pedro Editado' } });
    fireEvent.change(inputs[1], { target: { value: 'pedro.edit@test.cl' } });
    fireEvent.change(inputs[2], { target: { value: '+56987654321' } });

    fireEvent.click(screen.getByRole('button', { name: /Guardar cambios/ }));

    expect(screen.queryByText(/Correo inválido/)).toBeNull();
  })

  it('permite cambiar rol y estado', () => {
    renderWithProviders(<RutasUsuario />, { route: '/admin/usuarios/U-002/editar', session: ADMIN });

    const selects = getSelects();
    fireEvent.change(selects[0], { target: { value: 'Repartidor' } });
    fireEvent.change(selects[1], { target: { value: 'inactivo' } });

    fireEvent.click(screen.getByRole('button', { name: /Guardar cambios/ }));

    expect(screen.queryByText(/Correo inválido/)).toBeNull();
  })

  it('valida email al editar', () => {
    renderWithProviders(<RutasUsuario />, { route: '/admin/usuarios/U-002/editar', session: ADMIN });

    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[1], { target: { value: 'email-invalido' } });
    fireEvent.click(screen.getByRole('button', { name: /Guardar cambios/ }));

    expect(screen.getByText(/Correo inválido/)).toBeTruthy();
  })

  it('permite cambiar contraseña opcionalmente', () => {
    renderWithProviders(<RutasUsuario />, { route: '/admin/usuarios/U-002/editar', session: ADMIN });

    const passInput = screen.getByPlaceholderText(/Dejar en blanco para no cambiar/);
    expect(passInput.value).toBe('');

    fireEvent.change(passInput, { target: { value: 'nueva123' } });
    expect(passInput.value).toBe('nueva123');

    fireEvent.click(screen.getByRole('button', { name: /Guardar cambios/ }));
    expect(screen.queryByText(/Entre 4 y 10 caracteres/)).toBeNull();
  })

  it('valida longitud de nueva contraseña si se ingresa', () => {
    renderWithProviders(<RutasUsuario />, { route: '/admin/usuarios/U-002/editar', session: ADMIN });

    const passInput = screen.getByPlaceholderText(/Dejar en blanco para no cambiar/);
    fireEvent.change(passInput, { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /Guardar cambios/ }));

    expect(screen.getByText(/Entre 4 y 10 caracteres/)).toBeTruthy();
  })

  it('permite cancelar y volver a la lista', () => {
    renderWithProviders(<RutasUsuario />, { route: '/admin/usuarios/U-002/editar', session: ADMIN });

    fireEvent.click(screen.getByText(/Cancelar/));
    expect(screen.getByTestId('usuarios-list')).toBeTruthy();
  })
})