import React from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';

const EQUIPO = [
  { nombre: 'Juan Pérez', cargo: 'Gerente General', icono: '👔' },
  { nombre: 'María González', cargo: 'Jefa de Operaciones', icono: '📋' },
  { nombre: 'Carlos Rojas', cargo: 'Prevención de Riesgos', icono: '🛡️' },
  { nombre: 'Ana Silva', cargo: 'Atención al Cliente', icono: '📞' },
];

const COBERTURA = ['Chillán', 'Chillán Viejo', 'San Nicolás', 'Pinto', 'Coihueco', 'Ñiquén', 'San Carlos', 'San Fabián'];

export default function About() {
  return (
    <Container className="my-5">
      <Row className="align-items-center mb-5">
        <Col md={6}>
          <h1 className="display-5 fw-bold">Nuestra Historia</h1>
          <p className="lead">
            Más de 15 años llevando energía a los hogares de Chillán y Ñuble
          </p>
          <p>
            Gas La Chispa nace en 2009 como una empresa familiar comprometida con la
            distribución segura y confiable de gas licuado. Hoy somos la distribuidora
            de referencia en la región, manteniendo los valores de cercanía, seguridad
            y puntualidad que nos definieron desde el inicio.
          </p>
        </Col>
        <Col md={6} className="text-center">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJRQ6Nv_yCS37RUzZMViwHElJCfdDFFC90BPc0g_Edog&s=10"
            className="img-fluid rounded shadow"
            alt="Equipo Gas La Chispa"
          />
        </Col>
      </Row>

      <section className="mb-5">
        <h2 className="fw-bold text-center mb-4">Lo que nos mueve</h2>
        <Row className="g-4">
          {[
            { t: 'Misión', i: '🎯', d: 'Entregar gas licuado de calidad certificada a hogares, comercios e industrias de Chillán y comunas aledañas, con puntualidad, seguridad y trato cercano.' },
            { t: 'Visión', i: '🔭', d: 'Ser la distribuidora líder en la Región de Ñuble, reconocida por la excelencia operacional, innovación en logística y compromiso sostenible.' },
            { t: 'Valores', i: '💎', d: 'Seguridad ante todo · Confianza en cada entrega · Cercanía con el cliente · Responsabilidad ambiental.' },
          ].map((v) => (
            <Col key={v.t} md={4}>
              <Card className="h-100 border-0 shadow-sm text-center p-4">
                <Card.Body>
                  <div className="mb-2" style={{ fontSize: '3rem' }}>{v.i}</div>
                  <h5 className="fw-bold">{v.t}</h5>
                  <p className="text-muted mb-0">{v.d}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section className="mb-5">
        <h2 className="fw-bold text-center mb-4">Certificaciones y Cobertura</h2>
        <Row className="g-4">
          <Col md={6}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <h5 className="fw-bold mb-3">📋 Certificaciones</h5>
                {[
                  ['Norma Chilena NCh 342', 'Vigente'],
                  ['Reglamento SEC Gas Licuado', 'Vigente'],
                  ['ISO 9001:2015', 'En proceso'],
                  ['Permisos Seremi Salud', 'Vigente'],
                ].map(([n, e]) => (
                  <div key={n} className="d-flex justify-content-between border-bottom py-2">
                    <span>{n}</span>
                    <Badge bg={e === 'Vigente' ? 'success' : 'warning'} text={e === 'Vigente' ? undefined : 'dark'}>
                      {e}
                    </Badge>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <h5 className="fw-bold mb-3">📍 Cobertura de Entrega</h5>
                <div className="d-flex flex-wrap gap-2">
                  {COBERTURA.map((c) => (
                    <Badge key={c} bg="light" text="dark" className="p-2">{c}</Badge>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>

      <section className="mb-5">
        <h2 className="fw-bold text-center mb-4">Nuestro Equipo</h2>
        <Row className="g-4 justify-content-center">
          {EQUIPO.map((m) => (
            <Col key={m.nombre} xs={6} md={3}>
              <Card className="border-0 shadow-sm text-center h-100">
                <Card.Body>
                  <div style={{ fontSize: '3rem' }}>{m.icono}</div>
                  <h6 className="fw-bold mt-2 mb-0">{m.nombre}</h6>
                  <small className="text-muted">{m.cargo}</small>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>
    </Container>
  );
}
