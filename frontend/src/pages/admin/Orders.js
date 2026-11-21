import React, { useState } from 'react';
import { Container, Table, Button, Badge, Form, Modal, Row, Col, Card, Alert } from 'react-bootstrap';
import { useData } from '../../context/DataContext';
import StatusBadge from '../../components/StatusBadge';

const FILTROS = [
  { key: 'todos', label: 'Total', color: 'primary' },
  { key: 'recibido', label: 'Pendientes', color: 'secondary' },
  { key: 'asignado', label: 'Asignados', color: 'info' },
  { key: 'camino', label: 'En camino', color: 'warning' },
  { key: 'entregado', label: 'Entregados', color: 'success' },
];

export default function Orders({ readOnly = false }) {
  const { pedidos, usuarios, cambiarEstadoPedido, asignarPedido, crearPedido, productos } = useData();
  const [filtro, setFiltro] = useState('todos');
  const [asignarId, setAsignarId] = useState(null);
  const [repartidorSeleccionado, setRepartidorSeleccionado] = useState('');
  const [nuevoOpen, setNuevoOpen] = useState(false);
  const [detalle, setDetalle] = useState(null);
  const [error, setError] = useState(null);

  const repartidores = usuarios.filter((u) => u.rol === 'Repartidor' && u.estado === 'activo');
  const lista = filtro === 'todos' ? pedidos : pedidos.filter((p) => p.estado === filtro);

  const contar = (estado) =>
    estado === 'todos' ? pedidos.length : pedidos.filter((p) => p.estado === estado).length;

  const ejecutar = async (accion) => {
    setError(null);
    try {
      await accion();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const abrirAsignacion = (id) => {
    setError(null);
    setAsignarId(id);
    setRepartidorSeleccionado(repartidores[0]?.nombre || '');
  };

  const confirmarAsignacion = async () => {
    if (!repartidorSeleccionado) {
      setError('No hay repartidores disponibles.');
      return;
    }
    const ok = await ejecutar(() => asignarPedido(asignarId, repartidorSeleccionado));
    if (ok) setAsignarId(null);
  };

  return (
    <Container fluid className="px-lg-5 my-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-0">{readOnly ? '📋 Pedidos' : '📋 Órdenes del día'}</h2>
          <small className="text-muted">
            {new Date().toLocaleDateString('es-CL', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
            })}
          </small>
        </div>
        {readOnly ? (
          <Badge bg="secondary" className="fs-6">Solo lectura</Badge>
        ) : (
          <Button variant="warning" className="fw-bold" onClick={() => setNuevoOpen(true)}>
            + Nuevo Pedido
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Row className="g-3 mb-4">
        {FILTROS.map(({ key, label, color }) => (
          <Col key={key} xs={6} md={2} className="d-grid">
            <Card
              className={`border-0 bg-${color} text-center p-2`}
              style={{ cursor: 'pointer' }}
              onClick={() => setFiltro(key)}
            >
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
            <div className="btn-group btn-group-sm flex-wrap">
              {FILTROS.map(({ key, label }) => (
                <Button
                  key={key}
                  variant={filtro === key ? 'warning' : 'outline-dark'}
                  onClick={() => setFiltro(key)}
                >
                  {key === 'todos' ? 'Todos' : label}
                </Button>
              ))}
            </div>
          </div>

          <Table hover responsive className="align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th><th>Cliente</th><th>Producto</th><th>Comuna</th>
                <th>Total</th><th>Estado</th><th>Repartidor</th><th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {lista.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-muted py-4">
                    No hay pedidos en esta categoría
                  </td>
                </tr>
              )}
              {lista.map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.id}</strong></td>
                  <td>{p.cliente}<br /><small className="text-muted">{p.fono}</small></td>
                  <td>{p.producto} x{p.cantidad}</td>
                  <td>{p.comuna}</td>
                  <td>$ {p.total.toLocaleString('es-CL')}</td>
                  <td><StatusBadge estado={p.estado} /></td>
                  <td>{p.repartidor || <span className="text-muted">Sin asignar</span>}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-dark"
                      className="me-1"
                      onClick={() => setDetalle(p)}
                    >
                      Ver
                    </Button>
                    {!readOnly && p.estado === 'recibido' && (
                      <Button
                        size="sm"
                        variant="warning"
                        className="fw-bold"
                        onClick={() => abrirAsignacion(p.id)}
                      >
                        Asignar
                      </Button>
                    )}
                    {!readOnly && p.estado === 'asignado' && (
                      <Button
                        size="sm"
                        variant="outline-warning"
                        onClick={() => ejecutar(() => cambiarEstadoPedido(p.id, 'camino'))}
                      >
                        Iniciar ruta
                      </Button>
                    )}
                    {!readOnly && p.estado === 'camino' && (
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => ejecutar(() => cambiarEstadoPedido(p.id, 'entregado'))}
                      >
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

      <Modal show={!!asignarId} onHide={() => setAsignarId(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Asignar Repartidor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Pedido: <strong>{asignarId}</strong></p>
          <Form.Label>Seleccionar repartidor:</Form.Label>
          <Form.Select
            value={repartidorSeleccionado}
            onChange={(e) => setRepartidorSeleccionado(e.target.value)}
          >
            {repartidores.length === 0 && <option value="">Sin repartidores disponibles</option>}
            {repartidores.map((r) => (
              <option key={r.id} value={r.nombre}>{r.nombre}</option>
            ))}
          </Form.Select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setAsignarId(null)}>Cancelar</Button>
          <Button
            variant="warning"
            className="fw-bold"
            disabled={!repartidorSeleccionado}
            onClick={confirmarAsignacion}
          >
            Asignar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={!!detalle} onHide={() => setDetalle(null)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalle del pedido {detalle?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detalle && (
            <Row className="g-3">
              <Col md={6}><strong>Cliente:</strong> {detalle.cliente}</Col>
              <Col md={6}><strong>Teléfono:</strong> {detalle.fono || 'Sin teléfono'}</Col>
              <Col md={6}><strong>Comuna:</strong> {detalle.comuna}</Col>
              <Col md={6}><strong>Dirección:</strong> {detalle.direccion}</Col>
              <Col md={6}><strong>Producto:</strong> {detalle.producto}</Col>
              <Col md={6}><strong>Cantidad:</strong> {detalle.cantidad}</Col>
              <Col md={6}><strong>Total:</strong> $ {detalle.total.toLocaleString('es-CL')}</Col>
              <Col md={6}><strong>Pago:</strong> {detalle.pago}</Col>
              <Col md={6}><strong>Estado:</strong> <StatusBadge estado={detalle.estado} /></Col>
              <Col md={6}><strong>Repartidor:</strong> {detalle.repartidor || 'Sin asignar'}</Col>
              <Col md={12}>
                <strong>Fecha:</strong>{' '}
                {detalle.fecha ? new Date(detalle.fecha).toLocaleString('es-CL') : 'Sin fecha'}
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDetalle(null)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>

      {!readOnly && (
        <NuevoPedidoModal
          show={nuevoOpen}
          onHide={() => setNuevoOpen(false)}
          productos={productos}
          repartidores={repartidores}
          onCreate={crearPedido}
        />
      )}
    </Container>
  );
}

function NuevoPedidoModal({ show, onHide, productos, repartidores, onCreate }) {
  const [f, setF] = useState({
    cliente: '',
    fono: '',
    comuna: 'Chillan',
    direccion: '',
    productoId: productos[0]?.id || '',
    cantidad: 1,
    repartidor: '',
  });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setF((prev) => ({ ...prev, [k]: e.target.value }));
  const productoId = f.productoId || productos[0]?.id || '';

  const handleCreate = async () => {
    const prod = productos.find((p) => p.id === productoId);
    if (!prod) {
      setError('No hay productos disponibles.');
      return;
    }
    if (!f.cliente.trim() || !f.direccion.trim()) {
      setError('Completa cliente y dirección.');
      return;
    }
    const cantidad = Number(f.cantidad);
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      setError('La cantidad debe ser mayor a cero.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await onCreate({
        cliente: f.cliente.trim(),
        fono: f.fono.trim(),
        comuna: f.comuna,
        direccion: f.direccion.trim(),
        productoId: prod.id,
        producto: prod.nombre,
        cantidad,
        total: prod.precio * cantidad,
        estado: f.repartidor ? 'asignado' : 'recibido',
        repartidor: f.repartidor || null,
      });
      setF({
        cliente: '',
        fono: '',
        comuna: 'Chillan',
        direccion: '',
        productoId: productos[0]?.id || '',
        cantidad: 1,
        repartidor: '',
      });
      onHide();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Nuevo Pedido Manual</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
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
            <Form.Select value={productoId} onChange={set('productoId')}>
              {productos.length === 0 && <option value="">Sin productos</option>}
              {productos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} - ${p.precio.toLocaleString('es-CL')}
                </option>
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
              {repartidores.map((r) => (
                <option key={r.id} value={r.nombre}>{r.nombre}</option>
              ))}
            </Form.Select>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={saving}>Cancelar</Button>
        <Button variant="warning" className="fw-bold" onClick={handleCreate} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar Pedido'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
