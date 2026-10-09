import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Form, InputGroup, Button, Alert, Card } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import ProductCard from '../components/ProductCard';

const ORDENES = {
  codigo: (a, b) => a.id.localeCompare(b.id),
  precioAsc: (a, b) => a.precio - b.precio,
  precioDesc: (a, b) => b.precio - a.precio,
  pesoAsc: (a, b) => (a.peso || 0) - (b.peso || 0),
};

export default function Products() {
  const { productos, categorias } = useData();
  const [searchParams] = useSearchParams();
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState(() => searchParams.get('categoria') || '');
  const [orden, setOrden] = useState('codigo');

  const filtrados = useMemo(() => {
    let lista = productos.filter((p) => p.activo);

    if (busqueda.trim()) {
      const q = busqueda.trim().toLowerCase();
      lista = lista.filter(
        (p) => p.nombre.toLowerCase().includes(q) || p.descripcion.toLowerCase().includes(q)
      );
    }
    if (categoria) {
      lista = lista.filter((p) => p.categoria === categoria);
    }
    return [...lista].sort(ORDENES[orden]);
  }, [productos, busqueda, categoria, orden]);

  const limpiar = () => {
    setBusqueda('');
    setCategoria('');
    setOrden('codigo');
  };

  return (
    <Container className="my-5">
      <h1 className="fw-bold text-center">Nuestro Catálogo</h1>
      <p className="text-center text-muted">
        Cilindros de gas certificados y carga a granel
      </p>

      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <Row className="g-3 align-items-end">
            <Col md={4}>
              <Form.Label className="fw-bold">Buscar</Form.Label>
              <InputGroup>
                <Form.Control
                  placeholder="Nombre o descripción..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  aria-label="Buscar productos"
                />
                <Button variant="outline-secondary" onClick={limpiar}>
                  Limpiar
                </Button>
              </InputGroup>
            </Col>
            <Col md={4}>
              <Form.Label className="fw-bold">Categoría</Form.Label>
              <Form.Select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                aria-label="Filtrar por categoría"
              >
                <option value="">Todas</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.nombre}>
                    {c.nombre}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Label className="fw-bold">Ordenar por</Form.Label>
              <Form.Select value={orden} onChange={(e) => setOrden(e.target.value)}>
                <option value="codigo">Código</option>
                <option value="precioAsc">Precio: menor a mayor</option>
                <option value="precioDesc">Precio: mayor a menor</option>
                <option value="pesoAsc">Peso: menor a mayor</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {filtrados.length === 0 ? (
        <Alert variant="info" className="text-center">
          No hay productos que coincidan con los filtros.
        </Alert>
      ) : (
        <Row className="g-4">
          {filtrados.map((p) => (
            <Col key={p.id} xs={12} sm={6} lg={4} xl={3}>
              <ProductCard product={p} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
