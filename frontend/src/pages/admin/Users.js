import React, { useState } from 'react';
import { Container, Table, Button, Badge, Form, Card, Tab, Tabs, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';

const ROLES = {
  Administrador: 'danger',
  Operadora: 'info',
  Repartidor: 'warning',
  Cliente: 'success',
};

export default function Users() {
  const { usuarios, pedidos, actualizarUsuario } = useData();
  const [busqueda, setBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState('');

  const filtrados = usuarios.filter((u) => {
    const q = busqueda.toLowerCase();
    const coincide =
      u.nombre.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.run.toLowerCase().includes(q);
    const coincideRol = !filtroRol || u.rol === filtroRol;
    return coincide && coincideRol;
  });

  const toggleEstado = (u) => {
    const nuevo = u.estado === 'activo' ? 'inactivo' : 'activo';
    if (window.confirm(`¿${nuevo === 'activo' ? 'Activar' : 'Desactivar'} a ${u.nombre}?`)) {
      actualizarUsuario(u.id, { estado: nuevo });
    }
  };

  return (
    <Container fluid className="px-lg-5 my-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="fw-bold mb-0">👥 Usuarios</h2>
        <Button as={Link} to="/admin/usuarios/nuevo" variant="warning" className="fw-bold">
          + Usuario nuevo
        </Button>
      </div>

      <Tabs defaultActiveKey="lista" className="mb-4">
        <Tab eventKey="lista" title={`Lista (${usuarios.length})`}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Row className="g-3 mb-3">
                <div className="col-md-6">
                  <Form.Control
                    placeholder="🔍 Buscar por nombre, email o RUN..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <Form.Select value={filtroRol} onChange={(e) => setFiltroRol(e.target.value)}>
                    <option value="">Todos los roles</option>
                    {Object.keys(ROLES).map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </Form.Select>
                </div>
              </Row>

              <Table hover responsive className="align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Usuario</th><th>RUN</th><th>Email</th><th>Rol</th>
                    <th>Estado</th><th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.length === 0 && (
                    <tr><td colSpan={6} className="text-center text-muted">No se encontraron usuarios</td></tr>
                  )}
                  {filtrados.map((u) => (
                    <tr key={u.id}>
                      <td><strong>{u.nombre}</strong></td>
                      <td>{u.run}</td>
                      <td>{u.email}</td>
                      <td><Badge bg={ROLES[u.rol]}>{u.rol}</Badge></td>
                      <td>
                        <Badge bg={u.estado === 'activo' ? 'success' : 'secondary'}>
                          {u.estado === 'activo' ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Button as={Link} to={`/admin/usuarios/${u.id}/editar`} variant="outline-primary">✏️</Button>
                          <Button
                            as={Link}
                            to={`/admin/usuarios/${u.id}/historial`}
                            variant="outline-secondary"
                            title="Historial"
                          >
                            📜
                          </Button>
                          <Button
                            variant={u.estado === 'activo' ? 'outline-danger' : 'outline-success'}
                            onClick={() => toggleEstado(u)}
                            title={u.estado === 'activo' ? 'Desactivar' : 'Activar'}
                          >
                            {u.estado === 'activo' ? '🚫' : '✅'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="historial" title="📜 Historial global">
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Table hover responsive className="align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Fecha</th><th># Pedido</th><th>Cliente</th><th>Producto</th>
                    <th>Total</th><th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {[...pedidos]
                    .sort((a, b) => b.fecha.localeCompare(a.fecha))
                    .map((p) => (
                      <tr key={p.id}>
                        <td>{new Date(p.fecha).toLocaleString('es-CL')}</td>
                        <td><strong>{p.id}</strong></td>
                        <td>{p.cliente}</td>
                        <td>{p.producto} x{p.cantidad}</td>
                        <td>$ {p.total.toLocaleString('es-CL')}</td>
                        <td>
                          <Badge bg={p.estado === 'entregado' ? 'success' : p.estado === 'camino' ? 'warning' : 'secondary'}>
                            {p.estado}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
}
