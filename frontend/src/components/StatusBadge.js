import React from 'react';
import { Badge } from 'react-bootstrap';

export const ESTADOS_PEDIDO = {
  recibido: { texto: 'Recibido', bg: 'secondary', paso: 1 },
  asignado: { texto: 'Asignado', bg: 'info', paso: 2 },
  camino: { texto: 'En camino', bg: 'warning', paso: 3 },
  entregado: { texto: 'Entregado', bg: 'success', paso: 4 },
  cancelado: { texto: 'Cancelado', bg: 'danger', paso: 0 },
};

export default function StatusBadge({ estado, className = '' }) {
  const cfg = ESTADOS_PEDIDO[estado] || ESTADOS_PEDIDO.recibido;
  return (
    <Badge bg={cfg.bg} className={className}>
      {cfg.texto}
    </Badge>
  );
}
