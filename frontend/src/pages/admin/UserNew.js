import React, { useState } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';

const vacio = { run: '', nombre: '', email: '', password: '', telefono: '', rol: 'Cliente', comuna: 'Chillan', direccion: '' };

export default function UserNew() {
  const { crearUsuario } = useData();
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
    if (!/^\d{7,8}k?$/i.test(f.run.trim())) errs.run = 'RUN inválido';
    if (!f.nombre.trim()) errs.nombre = 'Nombre requerido';
    if (!/^\S+@\S+\.\S+$/.test(f.email)) errs.email = 'Correo inválido';
    if (f.password.length < 4 || f.password.length > 10) errs.password = 'Entre 4 y 10 caracteres';
    setErrores(errs);
    if (Object.keys(errs).length > 0) return;

    crearUsuario({
      run: f.run.trim(),
      nombre: f.nombre.trim(),
      email: f.email.trim(),
      password: f.password,
      telefono: f.telefono.trim(),
      rol: f.rol,
      estado: 'activo',
      comuna: f.comuna,
      direccion: f.direccion.trim(),
    });

    navigate('/admin/usuarios');
  };

  return (
    <Container className="my-4" style={{ maxWidth: 800 }}>
      <h2 className="fw-bold mb-4">➕ Usuario nuevo</h2>
      <Card className="shadow-sm border-0">
        <Card.Body className="p-4">
          <Form noValidate onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={4}>
                <Form.Label>RUN *</Form.Label>
                <Form.Control value={f.run} onChange={set('run')} placeholder="19011022k" isInvalid={!!errores.run} />
                <Form.Control.Feedback type="invalid">{errores.run}</Form.Control.Feedback>
              </Col>
              <Col md={8}>
                <Form.Label>Nombre completo *</Form.Label>
                <Form.Control value={f.nombre} onChange={set('nombre')} isInvalid={!!errores.nombre} />
                <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
              </Col>
              <Col md={6}>
                <Form.Label>Email *</Form.Label>
                <Form.Control type="email" value={f.email} onChange={set('email')} isInvalid={!!errores.email} />
                <Form.Control.Feedback type="invalid">{errores.email}</Form.Control.Feedback>
              </Col>
              <Col md={3}>
                <Form.Label>Contraseña *</Form.Label>
                <Form.Control type="password" value={f.password} onChange={set('password')} isInvalid={!!errores.password} />
                <Form.Control.Feedback type="invalid">{errores.password}</Form.Control.Feedback>
              </Col>
              <Col md={3}>
                <Form.Label>Teléfono</Form.Label>
                <Form.Control value={f.telefono} onChange={set('telefono')} />
              </Col>
              <Col md={4}>
                <Form.Label>Rol *</Form.Label>
                <Form.Select value={f.rol} onChange={set('rol')}>
                  {['Administrador', 'Operadora', 'Repartidor', 'Cliente'].map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
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
              <Button type="submit" variant="warning" className="fw-bold">Crear usuario</Button>
              <Button as={Link} to="/admin/usuarios" variant="outline-secondary">Cancelar</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
