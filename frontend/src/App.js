import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { DataProvider } from './context/DataContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Categories from './pages/Categories';
import Offers from './pages/Offers';
import About from './pages/About';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentError from './pages/PaymentError';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

import Dashboard from './pages/admin/Dashboard';
import Orders from './pages/admin/Orders';
import ProductsAdmin from './pages/admin/Products';
import ProductNew from './pages/admin/ProductNew';
import ProductEdit from './pages/admin/ProductEdit';
import CategoryNew from './pages/admin/CategoryNew';
import Users from './pages/admin/Users';
import UserNew from './pages/admin/UserNew';
import UserEdit from './pages/admin/UserEdit';
import UserHistory from './pages/admin/UserHistory';
import Reports from './pages/admin/Reports';
import Profile from './pages/admin/Profile';
import RepartidorPanel from './pages/repartidor/Panel';

const ROLES_ADMIN = ['Administrador', 'Operadora'];

function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navigation />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <DataProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              <Route element={<Layout />}>
                {/* Tienda */}
                <Route path="/" element={<Home />} />
                <Route path="/productos" element={<Products />} />
                <Route path="/productos/:id" element={<ProductDetail />} />
                <Route path="/categorias" element={<Categories />} />
                <Route path="/ofertas" element={<Offers />} />
                <Route path="/nosotros" element={<About />} />
                <Route path="/blogs" element={<Blog />} />
                <Route path="/blogs/:id" element={<BlogPost />} />
                <Route path="/contacto" element={<Contact />} />
                <Route path="/carrito" element={<Cart />} />
                <Route path="/checkout" element={<ProtectedRoute roles={['Cliente']}><Checkout /></ProtectedRoute>} />
                <Route path="/pago-correcto" element={<PaymentSuccess />} />
                <Route path="/pago-error" element={<PaymentError />} />
                <Route path="/registro" element={<Register />} />
                <Route path="/login" element={<Login />} />

                {/* Panel administrativo */}
                <Route path="/admin" element={<ProtectedRoute roles={ROLES_ADMIN}><Dashboard /></ProtectedRoute>} />
                <Route path="/admin/pedidos" element={<ProtectedRoute roles={ROLES_ADMIN}><Orders /></ProtectedRoute>} />
                <Route path="/admin/productos" element={<ProtectedRoute roles={ROLES_ADMIN}><ProductsAdmin /></ProtectedRoute>} />
                <Route path="/admin/productos/nuevo" element={<ProtectedRoute roles={ROLES_ADMIN}><ProductNew /></ProtectedRoute>} />
                <Route path="/admin/productos/:id/editar" element={<ProtectedRoute roles={ROLES_ADMIN}><ProductEdit /></ProtectedRoute>} />
                <Route path="/admin/categorias/nueva" element={<ProtectedRoute roles={ROLES_ADMIN}><CategoryNew /></ProtectedRoute>} />
                <Route path="/admin/usuarios" element={<ProtectedRoute roles={ROLES_ADMIN}><Users /></ProtectedRoute>} />
                <Route path="/admin/usuarios/nuevo" element={<ProtectedRoute roles={ROLES_ADMIN}><UserNew /></ProtectedRoute>} />
                <Route path="/admin/usuarios/:id/editar" element={<ProtectedRoute roles={ROLES_ADMIN}><UserEdit /></ProtectedRoute>} />
                <Route path="/admin/usuarios/:id/historial" element={<ProtectedRoute roles={ROLES_ADMIN}><UserHistory /></ProtectedRoute>} />
                <Route path="/admin/reportes" element={<ProtectedRoute roles={ROLES_ADMIN}><Reports /></ProtectedRoute>} />
                <Route path="/admin/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                {/* Repartidor */}
                <Route path="/repartidor" element={<ProtectedRoute roles={['Repartidor']}><RepartidorPanel /></ProtectedRoute>} />

                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
