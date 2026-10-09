import React, { useState } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { authenticate } from '../../data/db';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    nombre: user.nombre,
    telefono: user.telefono || '',
    comuna: user.comuna || '',
    direccion: user.direccion || '',
  });
  const [pass, setPass] = useState({ actual: '', nueva: '' });
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const guardarDatos = (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) {
      setErr('El nombre es obligatorio.');
      return;
    }
    setErr(null);
    updateUser(form);
    setMsg('✓ Datos actualizados correctamente.');
  };

  const cambiarPass = (e) => {
    e.preventDefault();
    setMsg(null);
    if (pass.nueva.length < 4 || pass.nueva.length > 10) {
      setErr('La nueva contraseña debe tener entre 4 y 10 caracteres.');
      return;
    }
    if (!authenticate(user.email, pass.actual).ok) {
      setErr('La contraseña actual no coincide.');
      return;
    }
    setErr(null);
    updateUser({ password: pass.nueva });
    setPass({ actual: '', nueva: '' });
    setMsg('✓ Contraseña actualizada correctamente.');
  };

  return (
    <Container className="my-4" style={{ maxWidth: 800 }}>
      <h2 className="fw-bold mb-4">👤 Mi perfil</h2>

      {msg && <Alert variant="success" onClose={() => setMsg(null)} dismissible>{msg}</Alert>}
      {err && <Alert variant="danger" onClose={() => setErr(null)} dismissible>{err}</Alert>}

      <Card className="shadow-sm border-0 mb-4">
        <Card.Body className="p-4">
          <h5 className="fw-bold mb-3">Datos personales</h5>
          <Row className="g-3">
            <Col md={6}>
              <Form.Label>Nombre</Form.Label>
              <Form.Control value={form.nombre} onChange={set('nombre')} />
            </Col>
            <Col md={6}>
              <Form.Label>Email</Form.Label>
              <Form.Control value={user.email} disabled />
            </Col>
            <Col md={4}>
              <Form.Label>Teléfono</Form.Label>
              <Form.Control value={form.telefono} onChange={set('telefono')} />
            </Col>
            <Col md={4}>
              <Form.Label>Comuna</Form.Label>
              <Form.Select value={form.comuna} onChange={set('comuna')}>
                {['Chillan', 'ChillanViejo', 'SanNicolas', 'Pinto', 'Coihueco'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Label>Dirección</Form.Label>
              <Form.Control value={form.direccion} onChange={set('direccion')} />
            </Col>
          </Row>
          <div className="mt-3">
            <Button variant="warning" className="fw-bold" onClick={guardarDatos}>Guardar datos</Button>
          </div>
        </Card.Body>
      </Card>

      <Card className="shadow-sm border-0">
        <Card.Body className="p-4">
          <h5 className="fw-bold mb-3">Cambiar contraseña</h5>
          <Row className="g-3">
            <Col md={6}>
              <Form.Label>Contraseña actual</Form.Label>
              <Form.Control
                type="password"
                value={pass.actual}
                onChange={(e) => setPass((p) => ({ ...p, actual: e.target.value }))}
              />
            </Col>
            <Col md={6}>
              <Form.Label>Nueva contraseña</Form.Label>
              <Form.Control
                type="password"
                value={pass.nueva}
                onChange={(e) => setPass((p) => ({ ...p, nueva: e.target.value }))}
              />
            </Col>
          </Row>
          <div className="mt-3">
            <Button variant="outline-danger" onClick={cambiarPass}>Cambiar contraseña</Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
