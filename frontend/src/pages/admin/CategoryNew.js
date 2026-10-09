import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';

export default function CategoryNew() {
  const { crearCategoria, categorias } = useData();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!nombre.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }
    if (categorias.some((c) => c.nombre.toLowerCase() === nombre.trim().toLowerCase())) {
      setError('Ya existe una categoría con ese nombre.');
      return;
    }

    crearCategoria({ nombre: nombre.trim(), descripcion: descripcion.trim() });
    setOk(true);
    setNombre('');
    setDescripcion('');
    setTimeout(() => navigate('/admin/productos'), 1500);
  };

  return (
    <Container className="my-4" style={{ maxWidth: 700 }}>
      <nav className="mb-3">
        <Link to="/admin">Panel</Link>
        <span className="mx-2">›</span>
        <span className="text-muted">Nueva categoría</span>
      </nav>

      <h2 className="fw-bold mb-4">🏷️ Nueva categoría</h2>

      {ok && <Alert variant="success">✓ Categoría creada. Redirigiendo...</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="shadow-sm border-0">
        <Card.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre *</Form.Label>
              <Form.Control
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Residencial"
                maxLength={50}
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                maxLength={200}
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button type="submit" variant="warning" className="fw-bold">Crear categoría</Button>
              <Button as={Link} to="/admin" variant="outline-secondary">Cancelar</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <Card className="shadow-sm border-0 mt-4">
        <Card.Body>
          <h6 className="fw-bold mb-3">Categorías existentes</h6>
          <div className="d-flex flex-wrap gap-2">
            {categorias.map((c) => (
              <Badge key={c.id} bg="secondary" className="p-2">{c.nombre}</Badge>
            ))}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
