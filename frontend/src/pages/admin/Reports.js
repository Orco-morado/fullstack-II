import React from 'react';
import { Container, Row, Col, Card, Table, Badge } from 'react-bootstrap';
import { useData } from '../../context/DataContext';

function Kpi({ titulo, valor, icono, color }) {
  return (
    <Card className="border-0 shadow-sm h-100">
      <Card.Body className="d-flex align-items-center gap-3">
        <div className="fs-2">{icono}</div>
        <div>
          <div className="h4 fw-bold mb-0" style={{ color }}>{valor}</div>
          <small className="text-muted">{titulo}</small>
        </div>
      </Card.Body>
    </Card>
  );
}

export default function Reports() {
  const { productos, pedidos, usuarios } = useData();

  const ventasTotales = pedidos
    .filter((p) => p.estado === 'entregado')
    .reduce((acc, p) => acc + p.total, 0);
  const pipeline = pedidos
    .filter((p) => p.estado !== 'entregado' && p.estado !== 'anulado')
    .reduce((acc, p) => acc + p.total, 0);

  const porEstado = ['pendiente', 'asignado', 'camino', 'entregado'].map((estado) => ({
    estado,
    cantidad: pedidos.filter((p) => p.estado === estado).length,
  }));

  const ventasPorCategoria = Object.entries(
    pedidos
      .filter((p) => p.estado === 'entregado')
      .reduce((acc, p) => {
        acc[p.categoria || 'General'] = (acc[p.categoria || 'General'] || 0) + p.total;
        return acc;
      }, {})
  ).sort((a, b) => b[1] - a[1]);

  const topProductos = Object.entries(
    pedidos.reduce((acc, p) => {
      acc[p.producto] = (acc[p.producto] || 0) + p.cantidad;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const criticos = productos.filter((p) => p.stock < 10);

  return (
    <Container fluid className="px-lg-5 my-4">
      <h2 className="fw-bold mb-4">📊 Reportes</h2>

      <Row className="g-3 mb-4">
        <Col md={3} xs={6}><Kpi titulo="Ventas ejecutadas" valor={`$ ${ventasTotales.toLocaleString('es-CL')}`} icono="💰" color="#198754" /></Col>
        <Col md={3} xs={6}><Kpi titulo="Pedidos en curso" valor={`$ ${pipeline.toLocaleString('es-CL')}`} icono="🚚" color="#fd7e14" /></Col>
        <Col md={3} xs={6}><Kpi titulo="Usuarios registrados" valor={usuarios.length} icono="👥" color="#0d6efd" /></Col>
        <Col md={3} xs={6}><Kpi titulo="Alertas de stock" valor={criticos.length} icono="⚠️" color="#dc3545" /></Col>
      </Row>

      <Row className="g-4">
        <Col lg={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <h5 className="fw-bold mb-3">Pedidos por estado</h5>
              <Table size="sm" className="mb-0">
                <tbody>
                  {porEstado.map(({ estado, cantidad }) => (
                    <tr key={estado}>
                      <td>
                        <Badge
                          bg={estado === 'entregado' ? 'success' : estado === 'camino' ? 'warning' : estado === 'asignado' ? 'info' : 'secondary'}
                        >
                          {estado}
                        </Badge>
                      </td>
                      <td style={{ width: '60%' }}>
                        <div className="bg-light rounded">
                          <div
                            className="bg-primary rounded"
                            style={{
                              width: `${pedidos.length ? Math.round((cantidad / pedidos.length) * 100) : 0}%`,
                              height: 10,
                            }}
                          />
                        </div>
                      </td>
                      <td className="text-end"><strong>{cantidad}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <h5 className="fw-bold mb-3">Ventas por categoría (entregadas)</h5>
              {ventasPorCategoria.length === 0 ? (
                <p className="text-muted mb-0">Aún no hay ventas entregadas.</p>
              ) : (
                <Table size="sm" className="mb-0">
                  <tbody>
                    {ventasPorCategoria.map(([cat, total]) => (
                      <tr key={cat}>
                        <td>{cat}</td>
                        <td className="text-end">
                          <strong>$ {total.toLocaleString('es-CL')}</strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <h5 className="fw-bold mb-3">Top 5 productos (unidades)</h5>
              {topProductos.length === 0 ? (
                <p className="text-muted mb-0">Sin datos todavía.</p>
              ) : (
                <Table size="sm" className="mb-0">
                  <thead>
                    <tr><th>#</th><th>Producto</th><th className="text-end">U.</th></tr>
                  </thead>
                  <tbody>
                    {topProductos.map(([nombre, cant], i) => (
                      <tr key={nombre}>
                        <td>{i + 1}</td>
                        <td>{nombre}</td>
                        <td className="text-end">{cant}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <h5 className="fw-bold mb-3">Productos con stock crítico</h5>
              {criticos.length === 0 ? (
                <p className="text-success mb-0">✓ Sin alertas de stock.</p>
              ) : (
                <Table size="sm" className="mb-0">
                  <thead>
                    <tr><th>Producto</th><th>Stock</th></tr>
                  </thead>
                  <tbody>
                    {criticos.map((p) => (
                      <tr key={p.id}>
                        <td>{p.nombre}</td>
                        <td><Badge bg="danger">{p.stock}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
