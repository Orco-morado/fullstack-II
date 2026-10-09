import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, ListGroup } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const COMUNAS = ['Chillan', 'ChillanViejo', 'SanNicolas', 'Pinto', 'Coihueco'];

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { crearPedido } = useData();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    nombre: user?.nombre || '',
    fono: user?.telefono || '',
    email: user?.email || '',
    comuna: user?.comuna || '',
    direccion: user?.direccion || '',
    referencia: '',
    pago: 'efectivo',
    horario: 'tarde',
    acepta: false,
  });
  const [errores, setErrores] = useState({});

  const set = (campo) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormulario((f) => ({ ...f, [campo]: value }));
    setErrores((err) => ({ ...err, [campo]: undefined }));
  };

  const validar = () => {
    const errs = {};
    if (!formulario.nombre.trim()) errs.nombre = 'El nombre es obligatorio';
    if (!/^\+?[\d\s]{8,15}$/.test(formulario.fono.trim()))
      errs.fono = 'Teléfono inválido (8-15 dígitos)';
    if (formulario.email && !/^\S+@\S+\.\S+$/.test(formulario.email))
      errs.email = 'Correo inválido';
    if (!formulario.comuna) errs.comuna = 'Selecciona una comuna';
    if (!formulario.direccion.trim()) errs.direccion = 'La dirección es obligatoria';
    if (!formulario.acepta) errs.acepta = 'Debes aceptar los términos';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validar();
    setErrores(errs);
    if (Object.keys(errs).length > 0) return;

    // Si la validación falla por simulación de error de pasarela,
    // se redirige a pago-error (simulación: email que contenga "error")
    const simularError = formulario.email.toLowerCase().includes('error');

    if (simularError) {
      navigate('/pago-error');
      return;
    }

    // Crear un pedido por cada producto del carrito
    items.forEach((item) => {
      crearPedido({
        clienteId: user?.id || null,
        cliente: formulario.nombre,
        fono: formulario.fono,
        comuna: formulario.comuna,
        direccion: formulario.direccion + (formulario.referencia ? ` (${formulario.referencia})` : ''),
        productoId: item.id,
        producto: item.nombre,
        cantidad: item.cantidad,
        total: item.precio * item.cantidad,
        estado: 'recibido',
        repartidor: null,
        pago: formulario.pago,
      });
    });

    clearCart();
    navigate('/pago-correcto', {
      state: {
        total: totalPrice,
        direccion: `${formulario.direccion}, ${formulario.comuna}`,
      },
    });
  };

  if (items.length === 0) {
    return (
      <Container className="my-5 text-center">
        <Alert variant="warning">
          No tienes productos para pagar.
          <div className="mt-3">
            <Button as={Link} to="/productos" variant="dark">Ir al catálogo</Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="fw-bold mb-4">Finalizar compra</h2>

      <Row className="g-4">
        <Col lg={7}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-3">Datos de entrega</h5>
              {!isAuthenticated && (
                <Alert variant="info">
                  ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link> para agilizar el pedido.
                </Alert>
              )}
              <Form noValidate onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Label htmlFor="co-nombre">Nombre completo *</Form.Label>
                    <Form.Control
                      id="co-nombre"
                      value={formulario.nombre}
                      onChange={set('nombre')}
                      isInvalid={!!errores.nombre}
                      maxLength={100}
                    />
                    <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
                  </Col>
                  <Col md={6}>
                    <Form.Label htmlFor="co-fono">Teléfono *</Form.Label>
                    <Form.Control
                      id="co-fono"
                      value={formulario.fono}
                      onChange={set('fono')}
                      isInvalid={!!errores.fono}
                      placeholder="+56 9 1234 5678"
                    />
                    <Form.Control.Feedback type="invalid">{errores.fono}</Form.Control.Feedback>
                  </Col>
                  <Col md={6}>
                    <Form.Label htmlFor="co-email">Correo electrónico</Form.Label>
                    <Form.Control
                      id="co-email"
                      type="email"
                      value={formulario.email}
                      onChange={set('email')}
                      isInvalid={!!errores.email}
                    />
                    <Form.Control.Feedback type="invalid">{errores.email}</Form.Control.Feedback>
                  </Col>
                  <Col md={6}>
                    <Form.Label htmlFor="co-comuna">Comuna *</Form.Label>
                    <Form.Select id="co-comuna" value={formulario.comuna} onChange={set('comuna')} isInvalid={!!errores.comuna}>
                      <option value="">Seleccione...</option>
                      {COMUNAS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errores.comuna}</Form.Control.Feedback>
                  </Col>
                  <Col xs={12}>
                    <Form.Label htmlFor="co-direccion">Dirección exacta *</Form.Label>
                    <Form.Control
                      id="co-direccion"
                      value={formulario.direccion}
                      onChange={set('direccion')}
                      isInvalid={!!errores.direccion}
                      maxLength={300}
                    />
                    <Form.Control.Feedback type="invalid">{errores.direccion}</Form.Control.Feedback>
                  </Col>
                  <Col md={6}>
                    <Form.Label>Referencia</Form.Label>
                    <Form.Control
                      value={formulario.referencia}
                      onChange={set('referencia')}
                      placeholder="Color de casa, portón..."
                    />
                  </Col>
                  <Col md={3}>
                    <Form.Label>Horario</Form.Label>
                    <Form.Select value={formulario.horario} onChange={set('horario')}>
                      <option value="mañana">Mañana</option>
                      <option value="tarde">Tarde</option>
                      <option value="indiferente">Indiferente</option>
                    </Form.Select>
                  </Col>
                  <Col md={3}>
                    <Form.Label>Pago *</Form.Label>
                    <Form.Select value={formulario.pago} onChange={set('pago')}>
                      <option value="efectivo">Efectivo</option>
                      <option value="transferencia">Transferencia</option>
                    </Form.Select>
                  </Col>
                </Row>

                <Form.Check
                  type="checkbox"
                  className="mt-4"
                  checked={formulario.acepta}
                  onChange={set('acepta')}
                  isInvalid={!!errores.acepta}
                  label={
                    <span>
                      Acepto los <Link to="/terminos">términos y condiciones</Link> *</span>
                    }
                />
                {errores.acepta && (
                  <div className="text-danger small mt-1">{errores.acepta}</div>
                )}

                <div className="d-grid mt-4">
                  <Button type="submit" variant="warning" size="lg" className="fw-bold">
                    Confirmar Pedido
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-3">Resumen del pedido</h5>
              <ListGroup variant="flush">
                {items.map((i) => (
                  <ListGroup.Item key={i.id} className="d-flex justify-content-between px-0">
                    <span>
                      {i.nombre} <span className="text-muted">x{i.cantidad}</span>
                    </span>
                    <span className="fw-bold">
                      $ {(i.precio * i.cantidad).toLocaleString('es-CL')}
                    </span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Total</strong>
                <strong className="text-success fs-5">
                  $ {totalPrice.toLocaleString('es-CL')}
                </strong>
              </div>
              <p className="text-muted small mt-3 mb-0">
                El pago se realiza al recibir el pedido.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
