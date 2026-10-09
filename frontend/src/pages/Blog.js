import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Badge, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

export default function Blog() {
  const { blogs } = useData();
  const [categoria, setCategoria] = useState('');

  const publicados = useMemo(
    () => blogs.filter((b) => b.activo).sort((a, b) => b.fecha.localeCompare(a.fecha)),
    [blogs]
  );

  const categorias = useMemo(() => [...new Set(publicados.map((b) => b.categoria))], [publicados]);

  const filtrados = categoria
    ? publicados.filter((b) => b.categoria === categoria)
    : publicados;

  const [destacado, ...resto] = filtrados;

  return (
    <Container className="my-5">
      <h1 className="fw-bold text-center mb-2">Blog y Novedades</h1>
      <p className="text-center text-muted mb-4">
        Consejos de seguridad, novedades y noticias del sector
      </p>

      <div className="text-center mb-4">
        <ButtonGroup size="sm">
          <Button
            variant={!categoria ? 'warning' : 'outline-warning'}
            onClick={() => setCategoria('')}
          >
            Todas
          </Button>
          {categorias.map((c) => (
            <Button
              key={c}
              variant={categoria === c ? 'warning' : 'outline-warning'}
              onClick={() => setCategoria(c)}
            >
              {c}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      {filtrados.length === 0 && (
        <Card className="text-center p-5">
          <p className="mb-0 text-muted">No hay artículos en esta categoría.</p>
        </Card>
      )}

      {destacado && (
        <Card className="shadow-sm border-0 overflow-hidden mb-5">
          <Row className="g-0">
            <Col md={5}>
              <div className="bg-warning d-flex align-items-center justify-content-center h-100" style={{ minHeight: 220 }}>
                <span style={{ fontSize: '4rem' }}>📝</span>
              </div>
            </Col>
            <Col md={7}>
              <Card.Body className="p-4 d-flex flex-column justify-content-center h-100">
                <Badge bg="warning" text="dark" className="mb-2 align-self-start">{destacado.categoria}</Badge>
                <Card.Title as="h3" className="fw-bold">{destacado.titulo}</Card.Title>
                <small className="text-muted mb-2">
                  {new Date(destacado.fecha).toLocaleDateString('es-CL')} · por {destacado.autor}
                </small>
                <Card.Text>{destacado.resumen}</Card.Text>
                <Button
                  as={Link}
                  to={`/blogs/${destacado.id}`}
                  variant="outline-warning"
                  className="align-self-start fw-bold"
                >
                  Leer más →
                </Button>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      )}

      <Row className="g-4">
        {resto.map((post) => (
          <Col key={post.id} sm={6} lg={4}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Badge bg="warning" text="dark">{post.categoria}</Badge>
                  <small className="text-muted">{new Date(post.fecha).toLocaleDateString('es-CL')}</small>
                </div>
                <Card.Title as="h5" className="fw-bold">{post.titulo}</Card.Title>
                <Card.Text className="text-muted small flex-grow-1">{post.resumen}</Card.Text>
                <Button as={Link} to={`/blogs/${post.id}`} size="sm" variant="outline-warning" className="align-self-start">
                  Leer artículo
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
