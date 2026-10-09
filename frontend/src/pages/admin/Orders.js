import React, { useState } from 'react';
import { Container, Table, Button, Badge, Form, Modal, Row, Col, Card } from 'react-bootstrap';
import { useData } from '../../context/DataContext';
import StatusBadge from '../../components/StatusBadge';

const REPARTIDORES = ['Carlos Rojas', 'María López', 'Jorge Díaz'];

export default function Orders() {
  const { pedidos, cambiarEstadoPedido, asignarPedido, crearPedido, productos } = useData();
  const [filtro, setFiltro] = useState('todos');
  const [asignarId, setAsignarId] = useState(null);
  const [nuevoOpen, setNuevoOpen] = useState(false);

  const lista = filtro === 'todos' ? pedidos : pedidos.filter((p) => p.estado === filtro);

  const contar = (estado) =>
    estado === 'todos' ? pedidos.length : pedidos.filter((p) => p.estado === estado).length;

  return (
    <Container fluid className="px-lg-5 my-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-0">📋 Órdenes del día</h2>
          <small className="text-muted">{new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</small>
        </div>
        <Button variant="warning" className="fw-bold" onClick={() => setNuevoOpen(true)}>
          + Nuevo Pedido
        </Button>
      </div>

      <Row className="g-3 mb-4">
        {[
          ['todos', 'Total', 'primary'],
          ['recibido', 'Pendientes', 'secondary'],
          ['asignado', 'Asignados', 'info'],
          ['camino', 'En camino', 'warning'],
          ['entregado', 'Entregados', 'success'],
        ].map(([key, label, color]) => (
          <Col key={key} xs={6} md={2} className="d-grid">
            <Card className={`border-0 bg-${color} text-center p-2`} style={{ cursor: 'pointer' }} onClick={() => setFiltro(key)}>
              <div className="fw-bold">{contar(key)}</div>
              <small>{label}</small>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="shadow-sm border-0">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h5 className="fw-bold mb-0">Lista de pedidos</h5>
            <div className="btn-group btn-group-sm">
              {['todos', 'recibido', 'camino', 'entregado'].map((f) => (
                <Button
                  key={f}
                  variant={filtro === f ? 'warning' : 'outline-dark'}
                  onClick={() => setFiltro(f)}
                >
                  {f === 'todos' ? 'Todos' : f === 'recibido' ? 'Pendientes' : f === 'camino' ? 'En camino' : 'Entregados'}
                </Button>
              ))}
            </div>
          </div>

          <Table hover responsive className="align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th><th>Cliente</th><th>Producto</th><th>Comuna</th>
                <th>Estado</th><th>Repartidor</th><th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {lista.length === 0 && (
                <tr><td colSpan={7} className="text-center text-muted py-4">No hay pedidos en esta categoría</td></tr>
              )}
              {lista.map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.id}</strong></td>
                  <td>{p.cliente}<br /><small className="text-muted">{p.fono}</small></td>
                  <td>{p.producto} x{p.cantidad}</td>
                  <td>{p.comuna}</td>
                  <td><StatusBadge estado={p.estado} /></td>
                  <td>{p.repartidor || <span className="text-muted">Sin asignar</span>}</td>
                  <td>
                    {p.estado === 'recibido' && (
                      <Button size="sm" variant="warning" className="fw-bold" onClick={() => setAsignarId(p.id)}>
                        Asignar
                      </Button>
                    )}
                    {p.estado === 'asignado' && (
                      <Button size="sm" variant="outline-warning" onClick={() => cambiarEstadoPedido(p.id, 'camino')}>
                        Iniciar ruta
                      </Button>
                    )}
                    {p.estado === 'camino' && (
                      <Button size="sm" variant="success" onClick={() => cambiarEstadoPedido(p.id, 'entregado')}>
                        Entregado
                      </Button>
                    )}
                    {p.estado === 'entregado' && <Badge bg="success">✓ Completado</Badge>}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal asignar repartidor */}
      <Modal show={!!asignarId} onHide={() => setAsignarId(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Asignar Repartidor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Pedido: <strong>{asignarId}</strong></p>
          <Form.Label>Seleccionar repartidor:</Form.Label>
          <Form.Select id="selectRepartidor">
            {REPARTIDORES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </Form.Select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setAsignarId(null)}>Cancelar</Button>
          <Button
            variant="warning"
            className="fw-bold"
            onClick={() => {
              const sel = document.getElementById('selectRepartidor').value;
              asignarPedido(asignarId, sel);
              setAsignarId(null);
            }}
          >
            Asignar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal nuevo pedido manual */}
      <NuevoPedidoModal
        show={nuevoOpen}
        onHide={() => setNuevoOpen(false)}
        productos={productos}
        onCreate={crearPedido}
      />
    </Container>
  );
}

function NuevoPedidoModal({ show, onHide, productos, onCreate }) {
  const [f, setF] = useState({
    cliente: '', fono: '', comuna: 'Chillan', direccion: '',
    productoId: productos[0]?.id || '', cantidad: 1, repartidor: '',
  });

  const set = (k) => (e) => setF((prev) => ({ ...prev, [k]: e.target.value }));

  const handleCreate = () => {
    if (!f.cliente.trim() || !f.direccion.trim()) {
      alert('Completa cliente y dirección.');
      return;
    }
    const prod = productos.find((p) => p.id === f.productoId);
    onCreate({
      cliente: f.cliente.trim(),
      fono: f.fono.trim(),
      comuna: f.comuna,
      direccion: f.direccion.trim(),
      productoId: prod.id,
      producto: prod.nombre,
      cantidad: Number(f.cantidad),
      total: prod.precio * Number(f.cantidad),
      estado: f.repartidor ? 'asignado' : 'recibido',
      repartidor: f.repartidor || null,
    });
    setF({ ...f, cliente: '', fono: '', direccion: '', cantidad: 1, repartidor: '' });
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Nuevo Pedido Manual</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="g-3">
          <Col md={6}>
            <Form.Label>Cliente *</Form.Label>
            <Form.Control value={f.cliente} onChange={set('cliente')} />
          </Col>
          <Col md={6}>
            <Form.Label>Teléfono</Form.Label>
            <Form.Control value={f.fono} onChange={set('fono')} />
          </Col>
          <Col md={4}>
            <Form.Label>Comuna</Form.Label>
            <Form.Select value={f.comuna} onChange={set('comuna')}>
              {['Chillan', 'ChillanViejo', 'SanNicolas', 'Pinto', 'Coihueco'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={8}>
            <Form.Label>Dirección *</Form.Label>
            <Form.Control value={f.direccion} onChange={set('direccion')} />
          </Col>
          <Col md={5}>
            <Form.Label>Producto</Form.Label>
            <Form.Select value={f.productoId} onChange={set('productoId')}>
              {productos.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre} - ${p.precio.toLocaleString('es-CL')}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Label>Cantidad</Form.Label>
            <Form.Control type="number" min={1} value={f.cantidad} onChange={set('cantidad')} />
          </Col>
          <Col md={4}>
            <Form.Label>Repartidor</Form.Label>
            <Form.Select value={f.repartidor} onChange={set('repartidor')}>
              <option value="">Sin asignar aún</option>
              {REPARTIDORES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </Form.Select>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancelar</Button>
        <Button variant="warning" className="fw-bold" onClick={handleCreate}>Guardar Pedido</Button>
      </Modal.Footer>
    </Modal>
  );
}
