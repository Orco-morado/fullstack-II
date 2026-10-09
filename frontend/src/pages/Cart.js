import React from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <Container className="my-5">
        <h2 className="fw-bold mb-4">Mi carrito de compras</h2>
        <Alert variant="warning" className="text-center">
          Tu carrito está vacío.
          <div className="mt-3">
            <Button as={Link} to="/productos" variant="dark">
              Volver a la tienda
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="fw-bold mb-4">Mi carrito de compras</h2>

      <Row className="g-4">
        <Col lg={8}>
          {items.map((item) => (
            <Card key={item.id} className="mb-3 shadow-sm border-0">
              <Card.Body>
                <Row className="align-items-center">
                  <Col xs={3} md={2} className="text-center">
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="img-fluid rounded border"
                      style={{ maxHeight: 80, objectFit: 'contain' }}
                    />
                  </Col>
                  <Col xs={9} md={4}>
                    <h6 className="fw-bold mb-1">{item.nombre}</h6>
                    <small className="text-muted d-block">
                      $ {item.precio.toLocaleString('es-CL')} c/u
                    </small>
                  </Col>
                  <Col xs={6} md={3} className="text-end fs-5 text-success fw-bold mt-3 mt-md-0">
                    $ {(item.precio * item.cantidad).toLocaleString('es-CL')}
                  </Col>
                  <Col xs={6} md={3} className="mt-3 mt-md-0">
                    <div className="input-group input-group-sm justify-content-end">
                      <Button
                        variant="outline-secondary"
                        onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                      >
                        −
                      </Button>
                      <Form.Control
                        value={item.cantidad}
                        readOnly
                        className="text-center"
                        style={{ maxWidth: 55 }}
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                      >
                        +
                      </Button>
                      <Button
                        variant="outline-danger"
                        onClick={() => removeItem(item.id)}
                        title="Eliminar"
                      >
                        🗑
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}

          <div className="d-flex justify-content-between">
            <Button as={Link} to="/productos" variant="outline-dark">
              ← Seguir comprando
            </Button>
            <Button variant="outline-danger" onClick={clearCart}>
              Vaciar carrito
            </Button>
          </div>
        </Col>

        <Col lg={4}>
          <Card className="shadow-sm border-0 bg-light">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                <h4 className="fw-bold mb-0">TOTAL:</h4>
                <h4 className="text-success fw-bold mb-0">
                  $ {totalPrice.toLocaleString('es-CL')}
                </h4>
              </div>
              <Button
                variant="warning"
                size="lg"
                className="w-100 fw-bold"
                onClick={() => navigate('/checkout')}
              >
                Ir a pagar
              </Button>
              <p className="text-center text-muted small mt-3 mb-0">
                El pago por normas de seguridad se realiza al recibir el pedido.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
