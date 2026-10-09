import React from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function PaymentError() {
  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body className="p-5">
              <div style={{ fontSize: '4rem' }}>❌</div>
              <h2 className="fw-bold text-danger mt-3">Pago con error</h2>
              <p className="lead">
                No pudimos procesar tu pedido. No se realizó ningún cobro.
              </p>

              <div className="bg-light rounded p-3 my-3">
                <p className="mb-0 text-muted small">
                  Causas posibles: datos de entrega incompletos o un problema
                  temporal del servicio. Tus productos siguen en el carrito.
                </p>
              </div>

              <div className="d-grid gap-2 mt-4">
                <Button as={Link} to="/checkout" variant="warning" className="fw-bold">
                  Reintentar el pago
                </Button>
                <Button as={Link} to="/carrito" variant="outline-dark">
                  Volver al carrito
                </Button>
                <Button as={Link} to="/contacto" variant="outline-secondary">
                  Contactar soporte
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
