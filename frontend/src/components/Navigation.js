import React from 'react';
import { Navbar, Nav, Container, Badge, Dropdown, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout, homePathFor } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const esInterno = isAuthenticated && ['Administrador', 'Operadora'].includes(user.rol);
  const esRepartidor = isAuthenticated && user.rol === 'Repartidor';

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="text-warning fw-bold">
          🔥 Gas La Chispa
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {esInterno ? (
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/admin">Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/admin/pedidos">Órdenes</Nav.Link>
              <Nav.Link as={Link} to="/admin/productos">Productos</Nav.Link>
              <Nav.Link as={Link} to="/admin/usuarios">Usuarios</Nav.Link>
              <Nav.Link as={Link} to="/admin/reportes">Reportes</Nav.Link>
              <Nav.Link as={Link} to="/admin/perfil">Perfil</Nav.Link>
            </Nav>
          ) : esRepartidor ? (
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/repartidor">Mis Entregas</Nav.Link>
            </Nav>
          ) : (
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/productos">Productos</Nav.Link>
              <Nav.Link as={Link} to="/categorias">Categorías</Nav.Link>
              <Nav.Link as={Link} to="/ofertas">Ofertas</Nav.Link>
              <Nav.Link as={Link} to="/nosotros">Nosotros</Nav.Link>
              <Nav.Link as={Link} to="/blogs">Blogs</Nav.Link>
              <Nav.Link as={Link} to="/contacto">Contacto</Nav.Link>
            </Nav>
          )}

          <Nav className="ms-auto align-items-lg-center">
            {!esInterno && !esRepartidor && (
              <Nav.Link as={Link} to="/carrito" className="text-warning fw-bold">
                🛒 Cart{' '}
                <Badge bg={totalItems > 0 ? 'warning' : 'secondary'} text={totalItems > 0 ? 'dark' : 'light'}>
                  {totalItems}
                </Badge>
              </Nav.Link>
            )}

            {isAuthenticated ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="outline-light" size="sm" id="user-dropdown">
                  👤 {user.nombre.split(' ')[0]} · {user.rol}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to={homePathFor(user.rol)}>Mi panel</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/admin/perfil" hidden={!esInterno}>Perfil</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>Cerrar sesión</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Button as={Link} to="/login" variant="outline-warning" size="sm" className="ms-lg-2">
                Iniciar sesión
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
