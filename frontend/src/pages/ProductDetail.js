import React, { useState } from 'react';
import { Container, Row, Col, Badge, Button, Form, Alert, Card, ListGroup } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import { estadoStock } from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { productos } = useData();
  const { addItem } = useCart();
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);

  const producto = productos.find((p) => p.id === id);

  if (!producto) {
    return (
      <Container className="my-5 text-center">
        <Alert variant="warning">
          <h4>Producto no encontrado</h4>
          <Button as={Link} to="/productos" variant="dark" className="mt-2">
            Volver al catálogo
          </Button>
        </Alert>
      </Container>
    );
  }

  const stockEstado = estadoStock(producto.stock);
  const relacionados = productos
    .filter((p) => p.categoria === producto.categoria && p.id !== producto.id)
    .slice(0, 3);

  const handleAdd = () => {
    addItem(producto, cantidad);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 2500);
  };

  return (
    <Container className="my-5">
      <nav className="mb-4">
        <Link to="/productos" className="text-decoration-none">Productos</Link>
        <span className="mx-2">›</span>
        <span className="text-muted">{producto.nombre}</span>
      </nav>

      <Row className="g-4">
        <Col md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Img
              src={producto.imagen}
              alt={producto.nombre}
              style={{ height: 400, objectFit: 'contain', padding: 30 }}
            />
          </Card>
        </Col>

        <Col md={6}>
          <Badge bg="primary" className="mb-2">{producto.categoria}</Badge>
          <h1 className="fw-bold">{producto.nombre}</h1>
          <p className="text-muted">Código: {producto.id}</p>

          <p className="fs-5">{producto.descripcion}</p>

          <div className="mb-3">
            {stockEstado === 'ok' && <Badge bg="success">Disponible</Badge>}
            {stockEstado === 'bajo' && <Badge bg="warning" text="dark">Últimas unidades ({producto.stock})</Badge>}
            {stockEstado === 'critico' && <Badge bg="danger">Sin stock</Badge>}
          </div>

          <h2 className="text-success fw-bold">
            $ {producto.precio.toLocaleString('es-CL')}
            {producto.categoria === 'Granel' && <small className="text-muted fs-6"> /litro</small>}
          </h2>

          {producto.stock > 0 && (
            <div className="d-flex align-items-center gap-3 my-4">
              <Form.Label className="mb-0 fw-bold">Cantidad:</Form.Label>
              <div className="d-flex align-items-center">
                <Button
                  variant="outline-secondary"
                  onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                >
                  −
                </Button>
                <Form.Control
                  type="number"
                  value={cantidad}
                  min={1}
                  max={producto.stock}
                  onChange={(e) => setCantidad(Math.max(1, Number(e.target.value)))}
                  className="text-center mx-2"
                  style={{ width: 80 }}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setCantidad((c) => Math.min(producto.stock, c + 1))}
                >
                  +
                </Button>
              </div>
            </div>
          )}

          <div className="d-grid gap-2">
            <Button
              variant="warning"
              size="lg"
              className="fw-bold"
              disabled={producto.stock <= 0}
              onClick={handleAdd}
            >
              Añadir al carrito
            </Button>
            <Button variant="outline-dark" onClick={() => navigate('/carrito')}>
              Ir al carrito
            </Button>
          </div>

          {agregado && (
            <Alert variant="success" className="mt-3">
              ✓ Producto añadido al carrito
            </Alert>
          )}

          <Card className="mt-4 border-0 bg-light">
            <ListGroup variant="flush">
              <ListGroup.Item>🚚 Delivery a domicilio en Chillán y alrededores</ListGroup.Item>
              <ListGroup.Item>💵 Pago en efectivo o transferencia al recibir</ListGroup.Item>
              <ListGroup.Item>🛡️ Cilindros certificados según norma chilena</ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>

      {relacionados.length > 0 && (
        <section className="mt-5">
          <h4 className="fw-bold mb-3">Productos relacionados</h4>
          <Row className="g-3">
            {relacionados.map((r) => (
              <Col key={r.id} md={4}>
                <Card className="h-100 shadow-sm border-0">
                  <Card.Body>
                    <Card.Title className="fw-bold">{r.nombre}</Card.Title>
                    <p className="text-success fw-bold">$ {r.precio.toLocaleString('es-CL')}</p>
                    <Button as={Link} to={`/productos/${r.id}`} size="sm" variant="outline-warning">
                      Ver detalle
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>
      )}
    </Container>
  );
}
