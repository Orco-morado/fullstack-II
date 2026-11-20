import React from 'react';
import { Container, Row, Col, Card, Table, Badge } from 'react-bootstrap';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';

export default function Panel() {
  const { pedidos, productos } = useData();
  const { user } = useAuth();

  const ventas = pedidos
    .filter((p) => p.estado === 'entregado')
    .reduce((acc, p) => acc + p.total, 0);

  const stats = [
    { label: 'Pedidos totales', value: pedidos.length, color: 'primary' },
    { label: 'Pendientes', value: pedidos.filter((p) => p.estado === 'recibido').length, color: 'secondary' },
    { label: 'En camino', value: pedidos.filter((p) => p.estado === 'camino').length, color: 'warning' },
    { label: 'Entregados', value: pedidos.filter((p) => p.estado === 'entregado').length, color: 'success' },
  ];

  const recientes = [...pedidos].sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));

  return (
    <Container fluid className="px-lg-5 my-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1">🛒 Panel de ventas</h2>
          <p className="text-muted mb-0">Vendedor: {user?.nombre} · modo consulta</p>
        </div>
        <Badge bg="secondary" className="fs-6">Solo lectura</Badge>
      </div>

      <Row className="g-3 mb-4">
        {stats.map((s) => (
          <Col key={s.label} xs={6} md={3}>
            <Card className="border-0 shadow-sm text-center p-3 h-100">
              <div className={`display-6 fw-bold text-${s.color}`}>{s.value}</div>
              <small className="text-muted">{s.label}</small>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-3 mb-4">
        <Col md={6}>
          <Card className="border-0 shadow-sm p-3 h-100">
            <div className="h4 fw-bold text-success mb-0">$ {ventas.toLocaleString('es-CL')}</div>
            <small className="text-muted">Ventas entregadas</small>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="border-0 shadow-sm p-3 h-100">
            <div className="h4 fw-bold text-dark mb-0">{productos.length}</div>
            <small className="text-muted">Productos en catálogo</small>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm border-0">
        <Card.Body>
          <h5 className="fw-bold mb-3">Últimos pedidos</h5>
          <Table hover responsive className="align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th><th>Cliente</th><th>Producto</th><th>Total</th><th>Estado</th><th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {recientes.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-4">Sin pedidos registrados</td>
                </tr>
              )}
              {recientes.map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.id}</strong></td>
                  <td>{p.cliente}</td>
                  <td>{p.producto} x{p.cantidad}</td>
                  <td>$ {p.total.toLocaleString('es-CL')}</td>
                  <td><StatusBadge estado={p.estado} /></td>
                  <td>{new Date(p.fecha).toLocaleDateString('es-CL')}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}
