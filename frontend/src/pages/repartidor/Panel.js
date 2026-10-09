import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Form, Alert } from 'react-bootstrap';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export default function Panel() {
  const { pedidos, cambiarEstadoPedido, actualizarPedido } = useData();
  const { user } = useAuth();
  const [filtro, setFiltro] = useState('pendiente');
  const [mensaje, setMensaje] = useState(null);

  const mios = pedidos.filter((p) => p.repartidor === user?.nombre);

  const filtrados = mios.filter((p) => (filtro === 'todos' ? true : p.estado === filtro));

  const stats = {
    asignados: mios.filter((p) => p.estado === 'asignado').length,
    camino: mios.filter((p) => p.estado === 'camino').length,
    entregados: mios.filter((p) => p.estado === 'entregado').length,
  };

  const avanzar = (pedido) => {
    if (pedido.estado === 'asignado') {
      cambiarEstadoPedido(pedido.id, 'camino');
      setMensaje(`✓ Pedido ${pedido.id} marcado "en camino".`);
    } else if (pedido.estado === 'camino') {
      cambiarEstadoPedido(pedido.id, 'entregado');
      setMensaje(`✓ Pedido ${pedido.id} entregado.`);
    } else if (pedido.estado === 'pendiente') {
      actualizarPedido(pedido.id, { repartidor: user.nombre, estado: 'asignado' });
      setMensaje(`✓ Tomaste el pedido ${pedido.id}.`);
    }
    setTimeout(() => setMensaje(null), 3000);
  };

  return (
    <Container fluid className="px-lg-5 my-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1">🚚 Mis entregas</h2>
          <p className="text-muted mb-0">Repartidor: {user?.nombre}</p>
        </div>
      </div>

      {mensaje && <Alert variant="success">{mensaje}</Alert>}

      <Row className="g-3 mb-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm text-center p-3">
            <div className="h3 fw-bold text-primary mb-0">{stats.asignados}</div>
            <small className="text-muted">Asignados (sin partir)</small>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm text-center p-3">
            <div className="h3 fw-bold text-warning mb-0">{stats.camino}</div>
            <small className="text-muted">En camino</small>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm text-center p-3">
            <div className="h3 fw-bold text-success mb-0">{stats.entregados}</div>
            <small className="text-muted">Entregados</small>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm border-0">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h5 className="fw-bold mb-0">Pedidos asignados</h5>
            <Form.Select style={{ width: 200 }} value={filtro} onChange={(e) => setFiltro(e.target.value)}>
              <option value="todos">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="asignado">Asignado</option>
              <option value="camino">En camino</option>
              <option value="entregado">Entregado</option>
            </Form.Select>
          </div>

          <Table hover responsive className="align-middle">
            <thead className="table-dark">
              <tr>
                <th># Pedido</th><th>Cliente</th><th>Dirección</th><th>Producto</th>
                <th>Total</th><th>Estado</th><th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-4">
                    No hay pedidos en este estado.
                  </td>
                </tr>
              )}
              {filtrados.map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.id}</strong></td>
                  <td>{p.cliente}</td>
                  <td>{p.direccion}, {p.comuna}</td>
                  <td>{p.producto} x{p.cantidad}</td>
                  <td>$ {p.total.toLocaleString('es-CL')}</td>
                  <td>
                    <Badge
                      bg={
                        p.estado === 'entregado' ? 'success' :
                        p.estado === 'camino' ? 'warning' :
                        p.estado === 'asignado' ? 'info' : 'secondary'
                      }
                    >
                      {p.estado === 'camino' ? 'en camino' : p.estado}
                    </Badge>
                  </td>
                  <td>
                    {p.estado === 'pendiente' && (
                      <Button size="sm" variant="outline-primary" onClick={() => avanzar(p)}>
                        Tomar
                      </Button>
                    )}
                    {p.estado === 'asignado' && (
                      <Button size="sm" variant="warning" onClick={() => avanzar(p)}>
                        🚚 Salir
                      </Button>
                    )}
                    {p.estado === 'camino' && (
                      <Button size="sm" variant="success" onClick={() => avanzar(p)}>
                        ✓ Entregado
                      </Button>
                    )}
                    {p.estado === 'entregado' && (
                      <Badge bg="success">Completado</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}
