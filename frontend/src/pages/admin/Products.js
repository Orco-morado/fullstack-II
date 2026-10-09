import React, { useState } from 'react';
import { Container, Table, Button, Badge, Form, Card, Tab, Tabs, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';

function estadoStock(stock) {
  if (stock <= 0) return { bg: 'danger', txt: 'Agotado' };
  if (stock < 10) return { bg: 'warning', txt: 'Bajo' };
  return { bg: 'success', txt: 'OK' };
}

export default function Products() {
  const { productos, eliminarProducto } = useData();
  const [busqueda, setBusqueda] = useState('');

  const filtrados = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.id.toLowerCase().includes(busqueda.toLowerCase())
  );

  const criticos = productos.filter((p) => p.stock < 10);

  const handleEliminar = (id, nombre) => {
    if (window.confirm(`¿Eliminar "${nombre}" del catálogo?`)) {
      eliminarProducto(id);
    }
  };

  return (
    <Container fluid className="px-lg-5 my-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="fw-bold mb-0">📦 Productos</h2>
        <Button as={Link} to="/admin/productos/nuevo" variant="warning" className="fw-bold">
          + Producto nuevo
        </Button>
      </div>

      <Tabs defaultActiveKey="lista" className="mb-4">
        <Tab eventKey="lista" title={`Lista (${productos.length})`}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Form.Control
                className="mb-3"
                placeholder="🔍 Buscar por nombre o código..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <Table hover responsive className="align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Código</th><th>Nombre</th><th>Categoría</th><th>Precio</th>
                    <th>Stock</th><th>Estado</th><th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.length === 0 && (
                    <tr><td colSpan={7} className="text-center text-muted">Sin resultados</td></tr>
                  )}
                  {filtrados.map((p) => {
                    const st = estadoStock(p.stock);
                    return (
                      <tr key={p.id}>
                        <td><strong>{p.id}</strong></td>
                        <td>{p.nombre}</td>
                        <td><Badge bg="primary">{p.categoria}</Badge></td>
                        <td>$ {p.precio.toLocaleString('es-CL')}</td>
                        <td>{p.stock}</td>
                        <td><Badge bg={st.bg}>{st.txt}</Badge></td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <Button as={Link} to={`/admin/productos/${p.id}/editar`} variant="outline-primary">
                              ✏️
                            </Button>
                            <Button variant="outline-danger" onClick={() => handleEliminar(p.id, p.nombre)}>
                              🗑
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="criticos" title={`⚠ Críticos (${criticos.length})`}>
          {criticos.length === 0 ? (
            <Card className="text-center p-5">
              <p className="mb-0 text-muted">No hay productos con stock crítico. ✓</p>
            </Card>
          ) : (
            <Row className="g-3">
              {criticos.map((p) => (
                <div key={p.id} className="col-md-6 col-lg-4">
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body>
                      <div className="d-flex justify-content-between">
                        <strong>{p.nombre}</strong>
                        <Badge bg="danger">{p.stock} u.</Badge>
                      </div>
                      <small className="text-muted">{p.id} · {p.categoria}</small>
                      <div className="mt-3 d-grid">
                        <Button as={Link} to={`/admin/productos/${p.id}/editar`} size="sm" variant="warning">
                          Reponer stock
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </Row>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
}
