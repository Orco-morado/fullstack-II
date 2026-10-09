import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <Container className="text-center py-5">
      <div className="display-1 fw-bold text-warning">404</div>
      <h2 className="fw-bold mb-3">Página no encontrada</h2>
      <p className="text-muted mb-4">
        La ruta que buscas no existe o fue movida.
      </p>
      <Button as={Link} to="/" variant="dark" className="fw-bold">
        Volver al inicio
      </Button>
    </Container>
  );
}
