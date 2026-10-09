import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <Container className="text-center">
        <Row>
          <Col md={4} className="mb-3">
            <h5 className="text-warning">Gas La Chispa</h5>
            <small>Distribución rápida y segura en Chillán y Ñuble.</small>
          </Col>
          <Col md={4} className="mb-3">
            <Link to="/nosotros" className="text-white text-decoration-none d-block">Nosotros</Link>
            <Link to="/contacto" className="text-white text-decoration-none d-block">Contacto</Link>
            <Link to="/terminos" className="text-white text-decoration-none d-block">Términos y condiciones</Link>
          </Col>
          <Col md={4}>
            <p className="mb-2">Mantente en contacto</p>
            <Form
              className="d-flex justify-content-center"
              onSubmit={(e) => {
                e.preventDefault();
                alert('¡Gracias por suscribirte!');
                e.target.reset();
              }}
            >
              <Form.Control type="email" placeholder="Tu correo" required className="w-50 me-2" />
              <Button variant="warning" type="submit">Suscribirse</Button>
            </Form>
          </Col>
        </Row>
        <hr className="border-secondary" />
        <small className="text-muted">Gas La Chispa © 2026 · DSY1104</small>
      </Container>
    </footer>
  );
}
