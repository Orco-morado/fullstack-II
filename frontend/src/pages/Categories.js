import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

export default function Categories() {
  const { categorias, productos } = useData();

  return (
    <Container className="my-5">
      <h1 className="fw-bold text-center mb-2">Categorías</h1>
      <p className="text-center text-muted mb-4">
        Encuentra el cilindro ideal según tu tipo de uso
      </p>

      <Row className="g-4">
        {categorias
          .filter((c) => c.activo)
          .map((cat) => {
            const items = productos.filter(
              (p) => p.categoria === cat.nombre && p.activo
            );
            const minPrecio = items.length ? Math.min(...items.map((p) => p.precio)) : 0;

            return (
              <Col key={cat.id} sm={6} lg={4}>
                <Card className="h-100 shadow-sm border-0 text-center">
                  <Card.Body className="d-flex flex-column">
                    <div className="fs-1 mb-2">🔥</div>
                    <Card.Title className="fw-bold">{cat.nombre}</Card.Title>
                    <Card.Text className="text-muted small flex-grow-1">
                      {cat.descripcion}
                    </Card.Text>
                    <Badge bg="secondary" className="mb-3">
                      {items.length} producto{items.length !== 1 && 's'}
                    </Badge>
                    {minPrecio > 0 && (
                      <p className="text-success fw-bold mb-3">
                        Desde $ {minPrecio.toLocaleString('es-CL')}
                      </p>
                    )}
                    <Button
                      as={Link}
                      to={`/productos?categoria=${encodeURIComponent(cat.nombre)}`}
                      variant="warning"
                      className="fw-bold"
                    >
                      Ver productos
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
      </Row>
    </Container>
  );
}
