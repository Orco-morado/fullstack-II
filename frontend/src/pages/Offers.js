import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

export default function Offers() {
  const { ofertas, productos } = useData();
  const activas = ofertas.filter((o) => o.activo);

  return (
    <Container className="my-5">
      <h1 className="fw-bold text-center mb-2">Ofertas</h1>
      <p className="text-center text-muted mb-4">
        Promociones vigentes para hogares y comercios
      </p>

      {activas.length === 0 ? (
        <Card className="text-center p-5">
          <p className="mb-0 text-muted">No hay ofertas vigentes por el momento.</p>
        </Card>
      ) : (
        <Row className="g-4">
          {activas.map((o) => {
            const producto = o.productoId
              ? productos.find((p) => p.id === o.productoId)
              : null;
            return (
              <Col key={o.id} md={6} lg={4}>
                <Card className="h-100 shadow-sm border-0 overflow-hidden">
                  <div className="position-relative">
                    <Card.Img
                      src={o.imagen}
                      alt={o.titulo}
                      style={{ height: 180, objectFit: 'cover' }}
                    />
                    <Badge
                      bg="danger"
                      className="position-absolute top-0 end-0 m-2 fs-6"
                    >
                      -{o.descuento}%
                    </Badge>
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="fw-bold">{o.titulo}</Card.Title>
                    <Card.Text className="text-muted small flex-grow-1">
                      {o.descripcion}
                    </Card.Text>
                    {producto && (
                      <p className="mb-1">
                        <s className="text-muted">
                          $ {producto.precio.toLocaleString('es-CL')}
                        </s>{' '}
                        <strong className="text-success">
                          ${' '}
                          {Math.round(producto.precio * (1 - o.descuento / 100)).toLocaleString('es-CL')}
                        </strong>
                      </p>
                    )}
                    <small className="text-muted mb-3">
                      Válido hasta {new Date(o.vigencia).toLocaleDateString('es-CL')}
                    </small>
                    <div className="d-grid">
                      {producto ? (
                        <Button as={Link} to={`/productos/${producto.id}`} variant="warning" className="fw-bold">
                          Comprar ahora
                        </Button>
                      ) : (
                        <Button as={Link} to="/productos" variant="outline-warning">
                          Ver productos
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
}
