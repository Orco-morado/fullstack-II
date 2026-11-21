import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as db from '../data/db';
import { USE_LOCAL, api } from '../api';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const canSeeUsers = isAuthenticated && ['Administrador', 'Operadora'].includes(user?.rol);

  const [productos, setProductos] = useState(() => (USE_LOCAL ? db.getProducts() : []));
  const [categorias, setCategorias] = useState(() => (USE_LOCAL ? db.getCategories() : []));
  const [usuarios, setUsuarios] = useState(() => (USE_LOCAL ? db.getUsers() : []));
  const [pedidos, setPedidos] = useState(() => (USE_LOCAL ? db.getOrders() : []));
  const [ofertas, setOfertas] = useState(() => (USE_LOCAL ? db.getOffers() : []));
  const [blogs, setBlogs] = useState(() => (USE_LOCAL ? db.getPosts() : []));
  const [loading, setLoading] = useState(!USE_LOCAL);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (USE_LOCAL) {
      setProductos(db.getProducts());
      setCategorias(db.getCategories());
      setUsuarios(db.getUsers());
      setPedidos(db.getOrders());
      setOfertas(db.getOffers());
      setBlogs(db.getPosts());
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [prods, cats, offers, posts] = await Promise.all([
        api.get('/productos'),
        api.get('/categorias'),
        api.get('/ofertas'),
        api.get('/blogs'),
      ]);

      setProductos(prods);
      setCategorias(cats);
      setOfertas(offers);
      setBlogs(posts);

      if (isAuthenticated) {
        setPedidos(await api.get('/pedidos'));
      } else {
        setPedidos([]);
      }

      if (canSeeUsers) {
        setUsuarios(await api.get('/usuarios'));
      } else {
        setUsuarios([]);
      }
    } catch (err) {
      setError(err.message);
      console.warn('No se pudieron cargar los datos desde la API:', err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, canSeeUsers]);

  useEffect(() => {
    if (!USE_LOCAL) refresh();
  }, [refresh]);

  const mutar = (localFn, apiCall) => {
    if (USE_LOCAL) {
      const result = localFn();
      refresh();
      return result;
    }
    return apiCall().then((result) => {
      refresh();
      return result;
    });
  };

  const stats = USE_LOCAL
    ? db.getDBStats()
    : {
        productos: productos.length,
        categorias: categorias.length,
        usuarios: usuarios.length,
        pedidos: pedidos.length,
        ofertas: ofertas.length,
        blogs: blogs.length,
        ventasTotales: pedidos
          .filter((p) => p.estado === 'entregado')
          .reduce((acc, p) => acc + p.total, 0),
        pedidosPendientes: pedidos.filter((p) => p.estado === 'recibido').length,
        productosCriticos: productos.filter((p) => p.stock < 10).length,
      };

  const value = {
    productos,
    categorias,
    usuarios,
    pedidos,
    ofertas,
    blogs,
    stats,
    loading,
    error,
    refresh,

    crearProducto: (data) =>
      mutar(() => db.createProduct(data), () => api.post('/productos', data)),
    actualizarProducto: (id, changes) =>
      mutar(() => db.updateProduct(id, changes), () => api.put(`/productos/${id}`, changes)),
    eliminarProducto: (id) =>
      mutar(() => db.deleteProduct(id), () => api.remove(`/productos/${id}`)),

    crearCategoria: (data) =>
      mutar(() => db.createCategory(data), () => api.post('/categorias', data)),
    actualizarCategoria: (id, changes) =>
      mutar(() => db.updateCategory(id, changes), () => api.put(`/categorias/${id}`, changes)),
    eliminarCategoria: (id) =>
      mutar(() => db.deleteCategory(id), () => api.remove(`/categorias/${id}`)),

    crearUsuario: (data) =>
      mutar(() => db.createUser(data), () => api.post('/usuarios', data)),
    registrarUsuario: (data) => {
      if (USE_LOCAL) {
        const nuevo = db.createUser(data);
        refresh();
        return nuevo;
      }
      return api.post('/auth/registro', data, { auth: false });
    },
    actualizarUsuario: (id, changes) =>
      mutar(() => db.updateUser(id, changes), () => api.put(`/usuarios/${id}`, changes)),
    eliminarUsuario: (id) =>
      mutar(() => db.deleteUser(id), () => api.remove(`/usuarios/${id}`)),

    crearPedido: (data) =>
      mutar(() => db.createOrder(data), () => api.post('/pedidos', data)),
    actualizarPedido: (id, changes) =>
      mutar(() => db.updateOrder(id, changes), () => api.put(`/pedidos/${id}`, changes)),
    asignarPedido: (id, repartidor) =>
      mutar(
        () => db.assignOrder(id, repartidor),
        () => api.put(`/pedidos/${id}`, { repartidor, estado: 'asignado' })
      ),
    cambiarEstadoPedido: (id, estado) =>
      mutar(
        () => db.changeOrderStatus(id, estado),
        () => api.put(`/pedidos/${id}/estado`, { estado })
      ),
    eliminarPedido: (id) =>
      mutar(() => db.deleteOrder(id), () => api.remove(`/pedidos/${id}`)),

    crearOferta: (data) =>
      mutar(() => db.createOffer(data), () => api.post('/ofertas', data)),
    actualizarOferta: (id, changes) =>
      mutar(() => db.updateOffer(id, changes), () => api.put(`/ofertas/${id}`, changes)),
    eliminarOferta: (id) =>
      mutar(() => db.deleteOffer(id), () => api.remove(`/ofertas/${id}`)),

    crearPost: (data) =>
      mutar(() => db.createPost(data), () => api.post('/blogs', data)),
    actualizarPost: (id, changes) =>
      mutar(() => db.updatePost(id, changes), () => api.put(`/blogs/${id}`, changes)),
    eliminarPost: (id) =>
      mutar(() => db.deletePost(id), () => api.remove(`/blogs/${id}`)),
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData debe usarse dentro de <DataProvider>');
  return ctx;
}
