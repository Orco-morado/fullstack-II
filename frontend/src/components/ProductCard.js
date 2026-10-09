import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CLASES_STOCK = {
  critico: { bg: 'danger', texto: 'Stock crítico' },
  bajo: { bg: 'warning', texto: 'Stock bajo' },
  ok: { bg: 'success', texto: 'Disponible' },
};

export function estadoStock(stock) {
  if (stock <= 0) return 'critico';
  if (stock < 10) return 'bajo';
  return 'ok';
}

export default function ProductCard({ product, onAdd, showAddButton = true }) {
  const { addItem } = useCart();
  const stockEstado = estadoStock(product.stock);

  const handleAdd = () => {
    if (onAdd) {
      onAdd(product);
    } else {
      addItem(product, 1);
      alert(`¡${product.nombre} añadido al carrito!`);
    }
  };

  return (
    <Card className="h-100 shadow-sm border-0 custom-card">
      <div className="position-relative">
        <Card.Img
          variant="top"
          src={product.imagen}
          alt={product.nombre}
          style={{ height: 180, objectFit: 'contain', padding: 15 }}
        />
        <Badge bg="primary" className="position-absolute top-0 start-0 m-2">
          {product.categoria}
        </Badge>
        <Badge bg={CLASES_STOCK[stockEstado].bg} className="position-absolute top-0 end-0 m-2">
          {CLASES_STOCK[stockEstado].texto}
        </Badge>
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title as="h5">{product.nombre}</Card.Title>
        <Card.Text className="text-muted small flex-grow-1">{product.descripcion}</Card.Text>
        <small className="text-muted">Código: {product.id}</small>
        <p className="fs-5 fw-bold text-success mb-2">
          $ {product.precio.toLocaleString('es-CL')}
          {product.categoria === 'Granel' && <small className="text-muted"> /litro</small>}
        </p>
        <div className="d-grid gap-2">
          <Button as={Link} to={`/productos/${product.id}`} variant="outline-warning" size="sm">
            Ver detalle
          </Button>
          {showAddButton && product.stock > 0 && (
            <Button variant="warning" className="fw-bold" onClick={handleAdd}>
              Añadir al carrito
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
