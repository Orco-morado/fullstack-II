import React from 'react';
import { Container, Card, Table, Badge, Button, Alert, Row, Col } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';

export default function UserHistory() {
  const { id } = useParams();
  const { usuarios, pedidos } = useData();

  const usuario = usuarios.find((u) => u.id === id);

  if (!usuario) {
    return (
      <Container className="my-5">
        <Alert variant="warning">
          Usuario no encontrado.
          <div className="mt-2">
            <Button as={Link} to="/admin/usuarios" variant="dark">Volver</Button>
          </div>
        </Alert>
      </Container>
    );
  }

  const historial = pedidos
    .filter((p) => p.clienteId === id || p.cliente === usuario.nombre)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  const totalGastado = historial
    .filter((p) => p.estado === 'entregado')
    .reduce((acc, p) => acc + p.total, 0);

  return (
    <Container className="my-4">
      <nav className="mb-3">
        <Link to="/admin/usuarios">Usuarios</Link>
        <span className="mx-2">›</span>
        <span className="text-muted">Historial</span>
      </nav>

      <h2 className="fw-bold mb-4">📜 Historial de {usuario.nombre}</h2>

      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm text-center p-3">
            <div className="h3 fw-bold text-primary mb-0">{historial.length}</div>
            <small className="text-muted">Pedidos totales</small>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm text-center p-3">
            <div className="h3 fw-bold text-success mb-0">
              $ {totalGastado.toLocaleString('es-CL')}
            </div>
            <small className="text-muted">Total entregado</small>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm text-center p-3">
            <div className="h3 fw-bold mb-0">
              <Badge bg={usuario.estado === 'activo' ? 'success' : 'secondary'}>
                {usuario.estado}
              </Badge>
            </div>
            <small className="text-muted">Estado de cuenta</small>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm border-0">
        <Card.Body>
          <h5 className="fw-bold mb-3">Pedidos del cliente</h5>
          <Table hover responsive className="align-middle">
            <thead className="table-dark">
              <tr>
                <th>Fecha</th><th># Pedido</th><th>Producto</th><th>Dirección</th>
                <th>Total</th><th>Estado</th><th>Pago</th>
              </tr>
            </thead>
            <tbody>
              {historial.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-4">
                    Este usuario aún no tiene pedidos.
                  </td>
                </tr>
              )}
              {historial.map((p) => (
                <tr key={p.id}>
                  <td>{new Date(p.fecha).toLocaleString('es-CL')}</td>
                  <td><strong>{p.id}</strong></td>
                  <td>{p.producto} x{p.cantidad}</td>
                  <td>{p.direccion}, {p.comuna}</td>
                  <td>$ {p.total.toLocaleString('es-CL')}</td>
                  <td>
                    <Badge
                      bg={
                        p.estado === 'entregado' ? 'success' :
                        p.estado === 'camino' ? 'warning' :
                        p.estado === 'asignado' ? 'info' : 'secondary'
                      }
                    >
                      {p.estado}
                    </Badge>
                  </td>
                  <td>{p.pago}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}
