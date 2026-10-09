import React, { useState } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const REGIONES = { Nuble: ['Chillan', 'ChillanViejo', 'SanNicolas', 'Pinto', 'Coihueco', 'Niquen', 'SanCarlos', 'SanFabian'] };

const vacio = {
  run: '', nombre: '', apellidos: '', email: '', password: '', confirmar: '',
  region: '', comuna: '', direccion: '',
};

export default function Register() {
  const { crearUsuario } = useData();
  const navigate = useNavigate();
  const [f, setF] = useState(vacio);
  const [errores, setErrores] = useState({});
  const [ok, setOk] = useState(false);

  const set = (campo) => (e) => {
    setF((prev) => ({ ...prev, [campo]: e.target.value }));
    setErrores((prev) => ({ ...prev, [campo]: undefined }));
  };

  const validar = () => {
    const errs = {};
    if (!/^\d{7,8}k?$/i.test(f.run.trim())) errs.run = 'RUN inválido (sin puntos ni guion, ej: 19011022k)';
    if (!f.nombre.trim()) errs.nombre = 'Requerido';
    if (!f.apellidos.trim()) errs.apellidos = 'Requerido';
    if (!/^\S+@\S+\.\S+$/.test(f.email)) errs.email = 'Correo inválido';
    if (f.password.length < 4 || f.password.length > 10)
      errs.password = 'Debe tener entre 4 y 10 caracteres';
    if (f.password !== f.confirmar) errs.confirmar = 'Las contraseñas no coinciden';
    if (!f.region) errs.region = 'Selecciona una región';
    if (!f.comuna) errs.comuna = 'Selecciona una comuna';
    if (!f.direccion.trim()) errs.direccion = 'Dirección requerida';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validar();
    setErrores(errs);
    if (Object.keys(errs).length > 0) return;

    crearUsuario({
      run: f.run.trim(),
      nombre: `${f.nombre.trim()} ${f.apellidos.trim()}`,
      email: f.email.trim(),
      password: f.password,
      rol: 'Cliente',
      estado: 'activo',
      comuna: f.comuna,
      direccion: f.direccion.trim(),
    });

    setOk(true);
    setTimeout(() => navigate('/login'), 2000);
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col lg={9}>
          <Card className="shadow border-0">
            <Card.Body className="p-4">
              <h3 className="text-center mb-4">Registro de Usuario</h3>

              {ok && (
                <Alert variant="success">
                  ✓ Cuenta creada con éxito. Redirigiendo al inicio de sesión...
                </Alert>
              )}

              <Form noValidate onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={4}>
                    <Form.Label>RUN *</Form.Label>
                    <Form.Control
                      value={f.run}
                      onChange={set('run')}
                      placeholder="19011022k"
                      isInvalid={!!errores.run}
                    />
                    <Form.Control.Feedback type="invalid">{errores.run}</Form.Control.Feedback>
                  </Col>
                  <Col md={4}>
                    <Form.Label>Nombre *</Form.Label>
                    <Form.Control value={f.nombre} onChange={set('nombre')} isInvalid={!!errores.nombre} />
                    <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
                  </Col>
                  <Col md={4}>
                    <Form.Label>Apellidos *</Form.Label>
                    <Form.Control value={f.apellidos} onChange={set('apellidos')} isInvalid={!!errores.apellidos} />
                    <Form.Control.Feedback type="invalid">{errores.apellidos}</Form.Control.Feedback>
                  </Col>
                  <Col md={6}>
                    <Form.Label>Correo electrónico *</Form.Label>
                    <Form.Control type="email" value={f.email} onChange={set('email')} isInvalid={!!errores.email} />
                    <Form.Control.Feedback type="invalid">{errores.email}</Form.Control.Feedback>
                  </Col>
                  <Col md={3}>
                    <Form.Label>Contraseña *</Form.Label>
                    <Form.Control type="password" value={f.password} onChange={set('password')} isInvalid={!!errores.password} />
                    <Form.Control.Feedback type="invalid">{errores.password}</Form.Control.Feedback>
                  </Col>
                  <Col md={3}>
                    <Form.Label>Confirmar *</Form.Label>
                    <Form.Control type="password" value={f.confirmar} onChange={set('confirmar')} isInvalid={!!errores.confirmar} />
                    <Form.Control.Feedback type="invalid">{errores.confirmar}</Form.Control.Feedback>
                  </Col>
                  <Col md={4}>
                    <Form.Label>Región *</Form.Label>
                    <Form.Select value={f.region} onChange={set('region')} isInvalid={!!errores.region}>
                      <option value="">Seleccione...</option>
                      <option value="Nuble">Región de Ñuble</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errores.region}</Form.Control.Feedback>
                  </Col>
                  <Col md={4}>
                    <Form.Label>Comuna *</Form.Label>
                    <Form.Select value={f.comuna} onChange={set('comuna')} isInvalid={!!errores.comuna} disabled={!f.region}>
                      <option value="">Seleccione...</option>
                      {REGIONES[f.region]?.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errores.comuna}</Form.Control.Feedback>
                  </Col>
                  <Col md={4}>
                    <Form.Label>Dirección *</Form.Label>
                    <Form.Control value={f.direccion} onChange={set('direccion')} isInvalid={!!errores.direccion} />
                    <Form.Control.Feedback type="invalid">{errores.direccion}</Form.Control.Feedback>
                  </Col>
                </Row>

                <div className="text-center mt-4">
                  <Button type="submit" variant="warning" size="lg" className="w-100" disabled={ok}>
                    Registrarse
                  </Button>
                </div>
              </Form>

              <div className="text-center mt-3">
                ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
