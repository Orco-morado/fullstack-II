import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const { productos, ofertas } = useData();
  const destacados = productos.filter((p) => p.activo).slice(0, 4);

  return (
    <Container className="my-5">
      <Row className="align-items-center mb-5 hero-section">
        <Col md={6}>
          <h1 className="display-4 fw-bold">Tu Gas a Domicilio Rápido y Seguro</h1>
          <p className="lead">
            Distribuidora Gas La Chispa te entrega el mejor servicio en Chillán y comunas
            aledañas. Pide tu cilindro ahora y haz seguimiento en tiempo real.
          </p>
          <div className="d-flex gap-2">
            <Button as={Link} to="/productos" variant="warning" size="lg" className="fw-bold">
              Ver Productos
            </Button>
            <Button as={Link} to="/ofertas" variant="outline-dark" size="lg">
              Ver Ofertas
            </Button>
          </div>
        </Col>
        <Col md={6} className="text-center">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJRQ6Nv_yCS37RUzZMViwHElJCfdDFFC90BPc0g_Edog&s=10"
            className="img-fluid rounded shadow"
            alt="Camión repartidor de Gas La Chispa"
          />
        </Col>
      </Row>

      <section className="text-center mb-5">
        <h2 className="mb-4 fw-bold">Nuestros Cilindros</h2>
        <Row className="g-4">
          {destacados.map((p) => (
            <Col key={p.id} xs={12} sm={6} lg={3}>
              <ProductCard product={p} />
            </Col>
          ))}
        </Row>
        <Button as={Link} to="/productos" variant="outline-dark" className="mt-4">
          Ver catálogo completo →
        </Button>
      </section>

      <section className="mb-5">
        <h2 className="text-center mb-4 fw-bold">Ofertas de la semana</h2>
        <Row className="g-4">
          {ofertas.filter((o) => o.activo).map((o) => (
            <Col key={o.id} md={4}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Img variant="top" src={o.imagen} style={{ height: 160, objectFit: 'cover' }} />
                <Card.Body>
                  <Card.Title className="fw-bold">{o.titulo}</Card.Title>
                  <Card.Text className="text-muted small">{o.descripcion}</Card.Text>
                  <Button as={Link} to="/ofertas" variant="warning" size="sm">
                    Aprovechar
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>
    </Container>
  );
}
