import React, { useState } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';

export default function UserEdit() {
  const { id } = useParams();
  const { usuarios, actualizarUsuario } = useData();
  const navigate = useNavigate();

  const original = usuarios.find((u) => u.id === id);
  const [f, setF] = useState(() =>
    original
      ? {
          nombre: original.nombre,
          email: original.email,
          telefono: original.telefono,
          rol: original.rol,
          estado: original.estado,
          comuna: original.comuna,
          direccion: original.direccion,
          password: '',
        }
      : null
  );
  const [errores, setErrores] = useState({});

  if (!original || !f) {
    return (
      <Container className="my-5">
        <Alert variant="warning">
          Usuario no encontrado.
          <div className="mt-2">
            <Button as={Link} to="/admin/usuarios" variant="dark">Volver</Button>
          </div>
        </Alert>
      </Container>
    );
  }

  const set = (k) => (e) => {
    setF((prev) => ({ ...prev, [k]: e.target.value }));
    setErrores((prev) => ({ ...prev, [k]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!f.nombre.trim()) errs.nombre = 'Nombre requerido';
    if (!/^\S+@\S+\.\S+$/.test(f.email)) errs.email = 'Correo inválido';
    if (f.password && (f.password.length < 4 || f.password.length > 10))
      errs.password = 'Entre 4 y 10 caracteres';
    setErrores(errs);
    if (Object.keys(errs).length > 0) return;

    const cambios = {
      nombre: f.nombre.trim(),
      email: f.email.trim(),
      telefono: f.telefono.trim(),
      rol: f.rol,
      estado: f.estado,
      comuna: f.comuna,
      direccion: f.direccion.trim(),
    };
    if (f.password) cambios.password = f.password;

    actualizarUsuario(id, cambios);
    navigate('/admin/usuarios');
  };

  return (
    <Container className="my-4" style={{ maxWidth: 800 }}>
      <h2 className="fw-bold mb-1">✏️ Editar usuario</h2>
      <p className="text-muted mb-4">{original.run} · creado {new Date(original.creadoEn).toLocaleDateString('es-CL')}</p>

      <Card className="shadow-sm border-0">
        <Card.Body className="p-4">
          <Form noValidate onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Label>Nombre completo *</Form.Label>
                <Form.Control value={f.nombre} onChange={set('nombre')} isInvalid={!!errores.nombre} />
                <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
              </Col>
              <Col md={6}>
                <Form.Label>Email *</Form.Label>
                <Form.Control type="email" value={f.email} onChange={set('email')} isInvalid={!!errores.email} />
                <Form.Control.Feedback type="invalid">{errores.email}</Form.Control.Feedback>
              </Col>
              <Col md={4}>
                <Form.Label>Nueva contraseña</Form.Label>
                <Form.Control type="password" value={f.password} onChange={set('password')} placeholder="Dejar en blanco para no cambiar" isInvalid={!!errores.password} />
                <Form.Control.Feedback type="invalid">{errores.password}</Form.Control.Feedback>
              </Col>
              <Col md={4}>
                <Form.Label>Teléfono</Form.Label>
                <Form.Control value={f.telefono} onChange={set('telefono')} />
              </Col>
              <Col md={4}>
                <Form.Label>Rol</Form.Label>
                <Form.Select value={f.rol} onChange={set('rol')}>
                  {['Administrador', 'Operadora', 'Repartidor', 'Cliente'].map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Label>Estado</Form.Label>
                <Form.Select value={f.estado} onChange={set('estado')}>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Label>Comuna</Form.Label>
                <Form.Select value={f.comuna} onChange={set('comuna')}>
                  {['Chillan', 'ChillanViejo', 'SanNicolas', 'Pinto', 'Coihueco'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Label>Dirección</Form.Label>
                <Form.Control value={f.direccion} onChange={set('direccion')} />
              </Col>
            </Row>

            <div className="d-flex gap-2 mt-4">
              <Button type="submit" variant="warning" className="fw-bold">Guardar cambios</Button>
              <Button as={Link} to="/admin/usuarios" variant="outline-secondary">Cancelar</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
