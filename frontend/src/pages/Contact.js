import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Accordion, Alert } from 'react-bootstrap';

const FAQS = [
  {
    q: '¿Cuáles son las zonas de reparto?',
    a: 'Entregamos gas a domicilio en todo el sector de Chillán y comunas aledañas. Nuestro sistema te asignará el repartidor más cercano.',
  },
  {
    q: '¿Cuáles son los medios de pago aceptados?',
    a: 'Por estrictas normas de seguridad, el pago se realiza de forma presencial (en efectivo o transferencia) al momento de recibir tu cilindro.',
  },
  {
    q: 'Olvidé mi contraseña, ¿qué hago?',
    a: 'Ve a la página de inicio de sesión y selecciona la opción para recuperar contraseña. Te enviaremos un correo para restablecerla.',
  },
  {
    q: '¿Con cuánta anticipación debo pedir?',
    a: 'Recomendamos pedir con al menos 2 horas de anticipación. En días de alta demanda puede demorar un poco más.',
  },
];

const vacio = { nombre: '', email: '', mensaje: '' };

export default function Contact() {
  const [form, setForm] = useState(vacio);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  const set = (campo) => (valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setErrores((prev) => ({ ...prev, [campo]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.nombre.trim()) errs.nombre = 'Ingresa tu nombre';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Correo inválido';
    if (!form.mensaje.trim()) errs.mensaje = 'Escribe tu consulta';
    else if (form.mensaje.length > 500) errs.mensaje = 'Máximo 500 caracteres';

    setErrores(errs);
    if (Object.keys(errs).length > 0) return;

    setEnviado(true);
    setForm(vacio);
  };

  return (
    <Container className="my-5">
      <h2 className="fw-bold mb-4">Centro de Ayuda y Contacto</h2>

      <Row>
        <Col md={6} className="mb-4">
          <h5 className="mb-3">Preguntas Frecuentes</h5>
          <Accordion>
            {FAQS.map((f, i) => (
              <Accordion.Item eventKey={String(i)} key={i}>
                <Accordion.Header>{f.q}</Accordion.Header>
                <Accordion.Body>{f.a}</Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm border-0 bg-light p-4">
            <h5 className="mb-3">Envíanos un mensaje</h5>

            {enviado && (
              <Alert variant="success" onClose={() => setEnviado(false)} dismissible>
                ✓ Mensaje enviado. Te responderemos a la brevedad.
              </Alert>
            )}

            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="contact-nombre">Nombre completo</Form.Label>
                <Form.Control
                  id="contact-nombre"
                  value={form.nombre}
                  onChange={(e) => set('nombre')(e.target.value)}
                  isInvalid={!!errores.nombre}
                  maxLength={100}
                />
                <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="contact-email">Correo electrónico</Form.Label>
                <Form.Control
                  id="contact-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email')(e.target.value)}
                  isInvalid={!!errores.email}
                />
                <Form.Control.Feedback type="invalid">{errores.email}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="contact-mensaje">Describe tu problema o consulta</Form.Label>
                <Form.Control
                  id="contact-mensaje"
                  as="textarea"
                  rows={4}
                  value={form.mensaje}
                  onChange={(e) => set('mensaje')(e.target.value)}
                  isInvalid={!!errores.mensaje}
                  maxLength={500}
                />
                <Form.Control.Feedback type="invalid">{errores.mensaje}</Form.Control.Feedback>
                <Form.Text className="text-muted">{form.mensaje.length}/500 caracteres</Form.Text>
              </Form.Group>

              <Button type="submit" variant="warning" className="w-100 fw-bold">
                Enviar Mensaje
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
