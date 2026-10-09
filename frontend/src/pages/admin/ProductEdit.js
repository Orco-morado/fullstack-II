import React, { useState } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';

export default function ProductEdit() {
  const { id } = useParams();
  const { productos, categorias, actualizarProducto } = useData();
  const navigate = useNavigate();

  const original = productos.find((p) => p.id === id);
  const [f, setF] = useState(() =>
    original
      ? {
          nombre: original.nombre,
          categoria: original.categoria,
          peso: original.peso ?? '',
          precio: original.precio,
          stock: original.stock,
          imagen: original.imagen,
          descripcion: original.descripcion,
          activo: original.activo,
        }
      : null
  );
  const [errores, setErrores] = useState({});

  if (!original || !f) {
    return (
      <Container className="my-5">
        <Alert variant="warning">
          Producto no encontrado.
          <div className="mt-2">
            <Button as={Link} to="/admin/productos" variant="dark">Volver</Button>
          </div>
        </Alert>
      </Container>
    );
  }

  const set = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setF((prev) => ({ ...prev, [k]: v }));
    setErrores((prev) => ({ ...prev, [k]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!f.nombre.trim()) errs.nombre = 'Nombre requerido';
    if (!f.precio || Number(f.precio) <= 0) errs.precio = 'Precio inválido';
    if (f.stock === '' || Number(f.stock) < 0) errs.stock = 'Stock inválido';
    setErrores(errs);
    if (Object.keys(errs).length > 0) return;

    actualizarProducto(id, {
      nombre: f.nombre.trim(),
      categoria: f.categoria,
      peso: f.peso === '' ? null : Number(f.peso),
      precio: Number(f.precio),
      stock: Number(f.stock),
      imagen: f.imagen.trim(),
      descripcion: f.descripcion.trim(),
      activo: f.activo,
    });

    navigate('/admin/productos');
  };

  return (
    <Container className="my-4" style={{ maxWidth: 800 }}>
      <h2 className="fw-bold mb-1">✏️ Editar producto</h2>
      <p className="text-muted mb-4">Código: {original.id}</p>

      <Card className="shadow-sm border-0">
        <Card.Body className="p-4">
          <Form noValidate onSubmit={handleSubmit}>
            <Row className="g-3">
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
              <Col md={3}>
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
              <Col md={3} className="d-flex align-items-end">
                <Form.Check
                  type="switch"
                  id="activo-switch"
                  label="Visible en tienda"
                  checked={f.activo}
                  onChange={set('activo')}
                />
              </Col>
              <Col xs={12}>
                <Form.Label>URL de imagen</Form.Label>
                <Form.Control value={f.imagen} onChange={set('imagen')} />
              </Col>
              <Col xs={12}>
                <Form.Label>Descripción</Form.Label>
                <Form.Control as="textarea" rows={3} value={f.descripcion} onChange={set('descripcion')} maxLength={300} />
              </Col>
            </Row>

            <div className="d-flex gap-2 mt-4">
              <Button type="submit" variant="warning" className="fw-bold">Guardar cambios</Button>
              <Button as={Link} to="/admin/productos" variant="outline-secondary">Cancelar</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
