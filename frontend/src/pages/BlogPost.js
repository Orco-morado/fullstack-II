import React from 'react';
import { Container, Badge, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

export default function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { blogs } = useData();

  const post = blogs.find((b) => b.id === id);

  if (!post) {
    return (
      <Container className="my-5">
        <Alert variant="warning" className="text-center">
          <h4>Artículo no encontrado</h4>
          <Button as={Link} to="/blogs" variant="dark" className="mt-2">Volver al blog</Button>
        </Alert>
      </Container>
    );
  }

  const relacionados = blogs
    .filter((b) => b.categoria === post.categoria && b.id !== post.id && b.activo)
    .slice(0, 3);

  return (
    <Container className="my-5">
      <nav className="mb-4">
        <Link to="/" className="text-decoration-none">Home</Link>
        <span className="mx-2">›</span>
        <Link to="/blogs" className="text-decoration-none">Blog</Link>
        <span className="mx-2">›</span>
        <span className="text-muted">{post.titulo}</span>
      </nav>

      <article style={{ maxWidth: 820, margin: '0 auto' }}>
        <Badge bg="warning" text="dark" className="mb-2">{post.categoria}</Badge>
        <h1 className="fw-bold">{post.titulo}</h1>
        <p className="text-muted">
          Publicado el {new Date(post.fecha).toLocaleDateString('es-CL')} · por {post.autor}
        </p>
        <hr />
        <div style={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
          <p className="lead">{post.resumen}</p>
          <p>{post.contenido}</p>
        </div>
        <hr />
        <div className="d-flex justify-content-between">
          <Button variant="outline-dark" onClick={() => navigate('/blogs')}>
            ← Volver al blog
          </Button>
          <Button as={Link} to="/contacto" variant="warning" className="fw-bold">
            ¿Dudas? Contáctanos
          </Button>
        </div>
      </article>

      {relacionados.length > 0 && (
        <section className="mt-5">
          <h4 className="fw-bold mb-3">Artículos relacionados</h4>
          <Row className="g-3">
            {relacionados.map((r) => (
              <Col key={r.id} md={4}>
                <Card className="h-100 shadow-sm border-0">
                  <Card.Body>
                    <Badge bg="warning" text="dark">{r.categoria}</Badge>
                    <h6 className="fw-bold mt-2">{r.titulo}</h6>
                    <Button as={Link} to={`/blogs/${r.id}`} size="sm" variant="outline-warning">
                      Leer
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
