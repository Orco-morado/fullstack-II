import React from 'react';
import { Container, Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';

export default function Dashboard() {
  const { stats, pedidos, productos, usuarios } = useData();
  const { user } = useAuth();

  const accesos = [
    { t: '📋 Órdenes', d: 'Gestión de pedidos del día', to: '/admin/pedidos' },
    { t: '📦 Productos', d: 'Catálogo, stock y críticos', to: '/admin/productos' },
    { t: '➕ Producto nuevo', d: 'Agregar al catálogo', to: '/admin/productos/nuevo' },
    { t: '👥 Usuarios', d: 'Crear, editar y roles', to: '/admin/usuarios' },
    { t: '🏷️ Categoría nueva', d: 'Agregar categoría', to: '/admin/categorias/nueva' },
    { t: '📊 Reportes', d: 'Ventas y desempeño', to: '/admin/reportes' },
    { t: '👤 Perfil', d: 'Tu cuenta', to: '/admin/perfil' },
  ];

  const recientes = [...pedidos].sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 5);
  const criticos = productos.filter((p) => p.stock < 10);

  return (
    <Container fluid className="px-lg-5 my-4">
      <h2 className="fw-bold mb-1">Dashboard</h2>
      <p className="text-muted mb-4">Hola {user?.nombre}, este es el resumen de hoy.</p>

      <Row className="g-4 mb-4">
        {[
          { v: stats.pedidos, l: 'Pedidos totales', c: 'warning' },
          { v: `$ ${stats.ventasTotales.toLocaleString('es-CL')}`, l: 'Ventas entregadas', c: 'success' },
          { v: usuarios.filter((u) => u.estado === 'activo').length, l: 'Usuarios activos', c: 'info' },
          { v: stats.productosCriticos, l: 'Productos con stock bajo', c: 'danger' },
        ].map((k) => (
          <Col key={k.l} xs={6} md={3}>
            <Card className="border-0 shadow-sm text-center p-3 h-100">
              <div className={`display-6 fw-bold text-${k.c}`}>{k.v}</div>
              <small className="text-muted">{k.l}</small>
            </Card>
          </Col>
        ))}
      </Row>

      <h5 className="fw-bold mb-3">Accesos rápidos</h5>
      <Row className="g-3 mb-4">
        {accesos.map((a) => (
          <Col key={a.to} xs={6} md={4} lg={3}>
            <Card as={Link} to={a.to} className="border-0 shadow-sm text-center p-3 h-100 text-decoration-none">
              <Card.Body>
                <div className="fw-bold text-dark">{a.t}</div>
                <small className="text-muted">{a.d}</small>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-4">
        <Col lg={8}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="d-flex justify-content-between mb-3">
                <h5 className="fw-bold mb-0">Últimos pedidos</h5>
                <Button as={Link} to="/admin/pedidos" size="sm" variant="outline-warning">Ver todos</Button>
              </div>
              <Table hover responsive className="align-middle">
                <thead className="table-dark">
                  <tr><th>#</th><th>Cliente</th><th>Producto</th><th>Total</th><th>Estado</th></tr>
                </thead>
                <tbody>
                  {recientes.length === 0 && (
                    <tr><td colSpan={5} className="text-center text-muted">Sin pedidos</td></tr>
                  )}
                  {recientes.map((p) => (
                    <tr key={p.id}>
                      <td><strong>{p.id}</strong></td>
                      <td>{p.cliente}</td>
                      <td>{p.producto} x{p.cantidad}</td>
                      <td>$ {p.total.toLocaleString('es-CL')}</td>
                      <td><StatusBadge estado={p.estado} /></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="d-flex justify-content-between mb-3">
                <h5 className="fw-bold mb-0">⚠ Stock crítico</h5>
                <Button as={Link} to="/admin/productos" size="sm" variant="outline-warning">Gestionar</Button>
              </div>
              {criticos.length === 0 ? (
                <p className="text-muted mb-0">Todo el stock está en niveles OK.</p>
              ) : (
                criticos.map((p) => (
                  <div key={p.id} className="d-flex justify-content-between border-bottom py-2">
                    <span>{p.nombre}</span>
                    <Badge bg="danger">{p.stock}</Badge>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
