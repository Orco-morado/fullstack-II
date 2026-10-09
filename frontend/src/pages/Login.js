import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, homePathFor } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recordar, setRecordar] = useState(true);
  const [errores, setErrores] = useState({});
  const [errorGlobal, setErrorGlobal] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};

    if (!email.trim()) {
      errs.email = 'El correo es requerido.';
    } else if (email.length > 100) {
      errs.email = 'El correo no puede exceder los 100 caracteres.';
    }

    if (!password.trim()) {
      errs.password = 'La contraseña es requerida.';
    } else if (password.length < 4 || password.length > 10) {
      errs.password = 'La contraseña debe tener entre 4 y 10 caracteres.';
    }

    setErrores(errs);
    setErrorGlobal('');
    if (Object.keys(errs).length > 0) return;

    const result = login(email, password, recordar);
    if (!result.ok) {
      setErrorGlobal(result.error);
      return;
    }

    const destino = location.state?.from || homePathFor(result.user.rol);
    navigate(destino, { replace: true });
  };

  return (
    <Container className="my-5">
      <div style={{ maxWidth: 420, margin: '0 auto' }}>
        <Card className="shadow-sm border-0">
          <Card.Body className="p-4">
            <h3 className="text-center text-warning fw-bold mb-1">🔥 Gas La Chispa</h3>
            <h5 className="text-center mb-4">Inicio de Sesión</h5>

            {errorGlobal && <Alert variant="danger">{errorGlobal}</Alert>}

            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Correo electrónico</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  isInvalid={!!errores.email}
                />
                <Form.Control.Feedback type="invalid">{errores.email}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  isInvalid={!!errores.password}
                />
                <Form.Control.Feedback type="invalid">{errores.password}</Form.Control.Feedback>
              </Form.Group>

              <Form.Check
                type="checkbox"
                className="mb-3"
                checked={recordar}
                onChange={(e) => setRecordar(e.target.checked)}
                label="Mantener sesión iniciada"
              />

              <Button type="submit" variant="warning" className="w-100 fw-bold" size="lg">
                Ingresar
              </Button>
            </Form>

            <div className="text-center mt-4">
              ¿Primera vez aquí? <Link to="/registro">Regístrate</Link>
            </div>

            <Card className="bg-light border-0 mt-4 p-3">
              <small className="text-muted fw-bold">Usuarios de prueba:</small>
              <small className="d-block">admin@gmail.com / admin123</small>
              <small className="d-block">operadora@gmail.com / oper1234</small>
              <small className="d-block">repartidor@gmail.com / repart123</small>
              <small className="d-block">cliente@gmail.com / cliente123</small>
            </Card>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}
