import React, { useState } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';

const vacio = {
  id: '', nombre: '', categoria: 'Normal', peso: '', precio: '', stock: '',
  imagen: '', descripcion: '',
};

export default function ProductNew() {
  const { crearProducto, categorias } = useData();
  const navigate = useNavigate();
  const [f, setF] = useState(vacio);
  const [errores, setErrores] = useState({});

  const set = (k) => (e) => {
    setF((prev) => ({ ...prev, [k]: e.target.value }));
    setErrores((prev) => ({ ...prev, [k]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!f.nombre.trim()) errs.nombre = 'Nombre requerido';
    if (!f.precio || Number(f.precio) <= 0) errs.precio = 'Precio inválido';
    if (f.stock === '' || Number(f.stock) < 0) errs.stock = 'Stock inválido';
    if (f.id.trim() && !/^[A-Za-z0-9-]+$/.test(f.id.trim()))
      errs.id = 'Solo letras, números y guiones';
    setErrores(errs);
    if (Object.keys(errs).length > 0) return;

    crearProducto({
      id: f.id.trim() || undefined,
      nombre: f.nombre.trim(),
      categoria: f.categoria,
      peso: f.peso ? Number(f.peso) : null,
      precio: Number(f.precio),
      stock: Number(f.stock),
      imagen: f.imagen.trim(),
      descripcion: f.descripcion.trim(),
    });

    navigate('/admin/productos');
  };

  return (
    <Container className="my-4" style={{ maxWidth: 800 }}>
      <h2 className="fw-bold mb-4">➕ Producto nuevo</h2>
      <Card className="shadow-sm border-0">
        <Card.Body className="p-4">
          <Form noValidate onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={4}>
                <Form.Label>Código (opcional)</Form.Label>
                <Form.Control value={f.id} onChange={set('id')} placeholder="VOL-050" isInvalid={!!errores.id} />
                <Form.Control.Feedback type="invalid">{errores.id}</Form.Control.Feedback>
              </Col>
              <Col md={8}>
                <Form.Label>Nombre *</Form.Label>
                <Form.Control value={f.nombre} onChange={set('nombre')} isInvalid={!!errores.nombre} />
                <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
              </Col>
              <Col md={4}>
                <Form.Label>Categoría</Form.Label>
                <Form.Select value={f.categoria} onChange={set('categoria')}>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.nombre}>{c.nombre}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Label>Peso (kg)</Form.Label>
                <Form.Control type="number" value={f.peso} onChange={set('peso')} />
              </Col>
              <Col md={3}>
                <Form.Label>Precio *</Form.Label>
                <Form.Control type="number" value={f.precio} onChange={set('precio')} isInvalid={!!errores.precio} />
                <Form.Control.Feedback type="invalid">{errores.precio}</Form.Control.Feedback>
              </Col>
              <Col md={3}>
                <Form.Label>Stock *</Form.Label>
                <Form.Control type="number" value={f.stock} onChange={set('stock')} isInvalid={!!errores.stock} />
                <Form.Control.Feedback type="invalid">{errores.stock}</Form.Control.Feedback>
              </Col>
              <Col xs={12}>
                <Form.Label>URL de imagen</Form.Label>
                <Form.Control value={f.imagen} onChange={set('imagen')} placeholder="https://..." />
              </Col>
              <Col xs={12}>
                <Form.Label>Descripción</Form.Label>
                <Form.Control as="textarea" rows={3} value={f.descripcion} onChange={set('descripcion')} maxLength={300} />
              </Col>
            </Row>

            <Alert variant="light" className="mt-3 border">
              <small className="text-muted">
                Si dejas el código vacío se generará uno automáticamente (VOL-001, VOL-002, ...).
              </small>
            </Alert>

            <div className="d-flex gap-2 mt-4">
              <Button type="submit" variant="warning" className="fw-bold">Guardar producto</Button>
              <Button as={Link} to="/admin/productos" variant="outline-secondary">Cancelar</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
