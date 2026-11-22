export function fechaLocalISO(fecha = new Date()) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

export function estaVigente(oferta, hoy = new Date()) {
  const vigencia = oferta?.vigencia;
  if (typeof vigencia !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(vigencia)) {
    return false;
  }
  return vigencia >= fechaLocalISO(hoy);
}

export function precioConDescuento(precio, descuento) {
  const base = Number(precio) || 0;
  const valor = Math.max(0, Math.min(100, Number(descuento) || 0));
  return Math.round((base * (100 - valor)) / 100);
}

export function precioFinalProducto(producto, ofertas = [], hoy = new Date()) {
  const descuento = ofertas
    .filter((oferta) => oferta?.activo && oferta.productoId === producto?.id && estaVigente(oferta, hoy))
    .reduce((mayor, oferta) => Math.max(mayor, Number(oferta.descuento) || 0), 0);

  return precioConDescuento(producto?.precio, descuento);
}

export function formatearVigencia(vigencia) {
  if (typeof vigencia !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(vigencia)) {
    return null;
  }
  const [anio, mes, dia] = vigencia.split('-');
  return `${dia}-${mes}-${anio}`;
}
