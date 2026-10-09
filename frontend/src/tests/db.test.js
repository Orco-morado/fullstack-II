import {
  getProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCriticalProducts,
  getCategories,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  authenticate,
  getOrders,
  changeOrderStatus,
  getDBStats,
  resetDB,
} from '../data/db';
import { clearStorage } from './helpers';

describe('db.js - CRUD de la fuente de datos simulada', () => {
  beforeEach(() => {
    clearStorage();
    resetDB();
  });

  it('lee los productos semilla', () => {
    expect(getProducts().length).toBe(7);
    expect(getProductById('VOL-011').nombre).toBe('Cilindro Normal 11 kg');
  });

  it('crea un producto nuevo (Create)', () => {
    const nuevo = createProduct({
      nombre: 'Cilindro de Prueba 11 kg',
      categoria: 'Normal',
      precio: 19990,
      stock: 15,
    });

    expect(nuevo.id).toBeTruthy();
    expect(getProducts().length).toBe(8);
    expect(getProductById(nuevo.id).nombre).toBe('Cilindro de Prueba 11 kg');
  });

  it('actualiza un producto existente (Update)', () => {
    updateProduct('VOL-005', { precio: 12990, stock: 3 });

    expect(getProductById('VOL-005').precio).toBe(12990);
    expect(getProductById('VOL-005').stock).toBe(3);
  });

  it('elimina un producto (Delete)', () => {
    expect(deleteProduct('VOL-005')).toBeTruthy();
    expect(getProductById('VOL-005')).toBeNull();
    expect(getProducts().length).toBe(6);
  });

  it('filtra productos por categoría y por texto (Read)', () => {
    expect(getProductsByCategory('Normal').length).toBe(3);
    expect(searchProducts('catalítico').length).toBe(1);
    expect(searchProducts('zzzzz').length).toBe(0);
  });

  it('lista los productos con stock crítico', () => {
    updateProduct('VOL-011', { stock: 2 });
    const criticos = getCriticalProducts(10);
    const ids = criticos.map((p) => p.id);

    expect(ids.indexOf('VOL-011')).toBeGreaterThan(-1);
    expect(ids.indexOf('VOL-045')).toBeGreaterThan(-1);
  });

  it('hace CRUD de usuarios', () => {
    const u = createUser({
      run: '11111111-1',
      nombre: 'Juan Soto',
      email: 'juan@correo.cl',
      password: 'juan1234',
      rol: 'Cliente',
    });

    expect(getUsers().length).toBe(6);
    updateUser(u.id, { rol: 'Operadora' });
    expect(getUserRol(u.id)).toBe('Operadora');
    expect(deleteUser(u.id)).toBeTruthy();
    expect(getUsers().length).toBe(5);
  });

  it('autentica usuarios y respeta el estado de la cuenta', () => {
    expect(authenticate('admin@gmail.com', 'admin123').ok).toBeTruthy();
    expect(authenticate('admin@gmail.com', 'clave-mala').ok).toBeFalsy();
    expect(authenticate('lucia@gmail.com', 'lucia1234').ok).toBeFalsy();
    expect(authenticate('no-existe@correo.cl', 'x').ok).toBeFalsy();
  });

  it('cambia el estado de un pedido (Update)', () => {
    changeOrderStatus('GC-100003', 'entregado');

    const pedido = getOrders().find((p) => p.id === 'GC-100003');
    expect(pedido.estado).toBe('entregado');
  });

  it('expone estadísticas generales de la base', () => {
    const stats = getDBStats();

    expect(stats.productos).toBe(7);
    expect(stats.categorias).toBe(5);
    expect(stats.usuarios).toBe(5);
    expect(stats.pedidos).toBe(4);
    expect(getCategories().length).toBe(5);
  });
});

function getUserRol(id) {
  const u = getUsers().find((x) => x.id === id);
  return u ? u.rol : null;
}
