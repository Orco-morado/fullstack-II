import React from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

export default function PaymentSuccess() {
  const location = useLocation();
  const total = location.state?.total;
  const direccion = location.state?.direccion;

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body className="p-5">
              <div style={{ fontSize: '4rem' }}>✅</div>
              <h2 className="fw-bold text-success mt-3">¡Pago correcto!</h2>
              <p className="lead">Tu pedido fue registrado exitosamente.</p>

              {total != null && (
                <div className="bg-light rounded p-3 my-3">
                  <p className="mb-1">Total: <strong>$ {total.toLocaleString('es-CL')}</strong></p>
                  {direccion && <p className="mb-0 text-muted small">Entrega: {direccion}</p>}
                </div>
              )}

              <p className="text-muted">
                Recibirás la confirmación y podrás seguir tu pedido en el panel.
                El pago se realiza en efectivo o transferencia al recibir.
              </p>

              <div className="d-grid gap-2 mt-4">
                <Button as={Link} to="/productos" variant="warning" className="fw-bold">
                  Seguir comprando
                </Button>
                <Button as={Link} to="/" variant="outline-dark">
                  Volver al inicio
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
