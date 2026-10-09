import React, { createContext, useContext, useState, useCallback } from 'react';
import * as db from '../data/db';

// Contexto que expone los datos + mutaciones a toda la app.
// Los componentes consumen este contexto para leer datos y
// refrescar la interfaz automáticamente tras cada operación CRUD.
const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [productos, setProductos] = useState(() => db.getProducts());
  const [categorias, setCategorias] = useState(() => db.getCategories());
  const [usuarios, setUsuarios] = useState(() => db.getUsers());
  const [pedidos, setPedidos] = useState(() => db.getOrders());
  const [ofertas, setOfertas] = useState(() => db.getOffers());
  const [blogs, setBlogs] = useState(() => db.getPosts());

  const refresh = useCallback(() => {
    setProductos(db.getProducts());
    setCategorias(db.getCategories());
    setUsuarios(db.getUsers());
    setPedidos(db.getOrders());
    setOfertas(db.getOffers());
    setBlogs(db.getPosts());
  }, []);

  const value = {
    // lecturas
    productos,
    categorias,
    usuarios,
    pedidos,
    ofertas,
    blogs,
    stats: db.getDBStats(),
    refresh,

    // productos
    crearProducto: (data) => {
      const p = db.createProduct(data);
      refresh();
      return p;
    },
    actualizarProducto: (id, changes) => {
      const p = db.updateProduct(id, changes);
      refresh();
      return p;
    },
    eliminarProducto: (id) => {
      const ok = db.deleteProduct(id);
      refresh();
      return ok;
    },

    // categorías
    crearCategoria: (data) => {
      const c = db.createCategory(data);
      refresh();
      return c;
    },
    actualizarCategoria: (id, changes) => {
      const c = db.updateCategory(id, changes);
      refresh();
      return c;
    },
    eliminarCategoria: (id) => {
      const ok = db.deleteCategory(id);
      refresh();
      return ok;
    },

    // usuarios
    crearUsuario: (data) => {
      const u = db.createUser(data);
      refresh();
      return u;
    },
    actualizarUsuario: (id, changes) => {
      const u = db.updateUser(id, changes);
      refresh();
      return u;
    },
    eliminarUsuario: (id) => {
      const ok = db.deleteUser(id);
      refresh();
      return ok;
    },

    // pedidos
    crearPedido: (data) => {
      const p = db.createOrder(data);
      refresh();
      return p;
    },
    actualizarPedido: (id, changes) => {
      const p = db.updateOrder(id, changes);
      refresh();
      return p;
    },
    asignarPedido: (id, repartidor) => {
      const p = db.assignOrder(id, repartidor);
      refresh();
      return p;
    },
    cambiarEstadoPedido: (id, estado) => {
      const p = db.changeOrderStatus(id, estado);
      refresh();
      return p;
    },
    eliminarPedido: (id) => {
      const ok = db.deleteOrder(id);
      refresh();
      return ok;
    },

    // ofertas
    crearOferta: (data) => {
      const o = db.createOffer(data);
      refresh();
      return o;
    },
    actualizarOferta: (id, changes) => {
      const o = db.updateOffer(id, changes);
      refresh();
      return o;
    },
    eliminarOferta: (id) => {
      const ok = db.deleteOffer(id);
      refresh();
      return ok;
    },

    // blog
    crearPost: (data) => {
      const p = db.createPost(data);
      refresh();
      return p;
    },
    actualizarPost: (id, changes) => {
      const p = db.updatePost(id, changes);
      refresh();
      return p;
    },
    eliminarPost: (id) => {
      const ok = db.deletePost(id);
      refresh();
      return ok;
    },
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData debe usarse dentro de <DataProvider>');
  return ctx;
}
