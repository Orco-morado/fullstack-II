document.addEventListener("DOMContentLoaded", function() {

    const nombresCilindro = { '5': 'Cilindro 5 kg', '11': 'Cilindro 11 kg', '15': 'Cilindro 15 kg', '45': 'Cilindro 45 kg' };

    const estados = {
        'recibido': { texto: 'Pendiente', clase: 'bg-secondary' },
        'asignado': { texto: 'Asignado', clase: 'bg-info text-dark' },
        'camino': { texto: 'En camino', clase: 'bg-warning text-dark' },
        'entregado': { texto: 'Entregado', clase: 'bg-success' }
    };

    const destinos = {
        'Chillan': { lat: -36.6050, lng: -72.1020 },
        'ChillanViejo': { lat: -36.6230, lng: -72.1030 },
        'SanNicolas': { lat: -36.5000, lng: -72.2000 },
        'Pinto': { lat: -36.7000, lng: -71.9000 },
        'Coihueco': { lat: -36.6250, lng: -71.8300 }
    };

    const BODEGA = { lat: -36.6080, lng: -72.1050 };

    let pedidos = [];
    let repartidorActual = 'Carlos Rojas';
    let pedidoSeleccionado = null;
    let mapa = null;
    let marcadores = [];

    function cargarPedidos() {
        pedidos = JSON.parse(localStorage.getItem('pedidosLaChispa')) || [];

        // Si no hay pedidos de ejemplo, crear algunos
        if (pedidos.length === 0) {
            pedidos = crearPedidosEjemplo();
            localStorage.setItem('pedidosLaChispa', JSON.stringify(pedidos));
        }

        renderizarKPIs();
        renderizarLista();
        renderizarMapa();
    }

    function crearPedidosEjemplo() {
        const hoy = new Date().toISOString();
        return [
            { id: 'GC-100001', cliente: 'María Rojas', fono: '+56 9 1234 5678', comuna: 'Chillan', direccion: 'Av. Argentina 123', cilindro: '11', cantidad: 1, total: 20000, estado: 'asignado', repartidor: 'Carlos Rojas', fecha: hoy, pago: 'efectivo' },
            { id: 'GC-100002', cliente: 'Roberto Silva', fono: '+56 9 2345 6789', comuna: 'Chillan', direccion: 'O'Higgins 456', cilindro: '15', cantidad: 2, total: 54000, estado: 'asignado', repartidor: 'Carlos Rojas', fecha: hoy, pago: 'efectivo' },
            { id: 'GC-100003', cliente: 'Lucía Herrera', fono: '+56 9 3456 7890', comuna: 'ChillanViejo', direccion: 'Pedro Aguirre Cerda 789', cilindro: '5', cantidad: 1, total: 11500, estado: 'asignado', repartidor: 'Carlos Rojas', fecha: hoy, pago: 'transferencia' },
            { id: 'GC-100004', cliente: 'Fernando Ortiz', fono: '+56 9 4567 8901', comuna: 'Chillan', direccion: 'San Martín 321', cilindro: '45', cantidad: 1, total: 60000, estado: 'camino', repartidor: 'Carlos Rojas', fecha: hoy, pago: 'efectivo' },
            { id: 'GC-100005', cliente: 'Ana Contreras', fono: '+56 9 5678 9012', comuna: 'Chillan', direccion: 'Carrera 654', cilindro: '11', cantidad: 1, total: 20000, estado: 'entregado', repartidor: 'Carlos Rojas', fecha: hoy, pago: 'efectivo' },
            { id: 'GC-100006', cliente: 'Pedro Muñoz', fono: '+56 9 6789 0123', comuna: 'ChillanViejo', direccion: 'Independencia 987', cilindro: '5', cantidad: 2, total: 23000, estado: 'recibido', repartidor: null, fecha: hoy, pago: 'efectivo' }
        ];
    }

    function renderizarKPIs() {
        const mios = pedidos.filter(p => p.repartidor === repartidorActual);
        document.getElementById('mis-pendientes').textContent = mios.filter(p => p.estado === 'asignado').length;
        document.getElementById('mis-camino').textContent = mios.filter(p => p.estado === 'camino').length;
        document.getElementById('mis-entregados').textContent = mios.filter(p => p.estado === 'entregado').length;
    }

    function renderizarLista() {
        const container = document.getElementById('lista-mis-pedidos');
        const mios = pedidos.filter(p => p.repartidor === repartidorActual);

        if (mios.length === 0) {
            container.innerHTML = '<div class="alert alert-info">No tienes pedidos asignados por el momento.</div>';
            return;
        }

        container.innerHTML = '';
        mios.forEach(p => {
            const est = estados[p.estado] || estados.recibido;
            const claseEstado = p.estado === 'entregado' ? 'entregado' : p.estado === 'camino' ? 'camino' : 'pendiente';

            const card = document.createElement('div');
            card.className = `card mb-3 shadow-sm border-0 pedido-card ${claseEstado}`;
            card.style.cursor = 'pointer';
            card.onclick = () => seleccionarPedido(p.id);

            card.innerHTML = `
                <div class="card-body p-3">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <strong>${p.cliente}</strong>
                            <br><small class="text-muted">${p.direccion}, ${p.comuna}</small>
                            <br><small>${nombresCilindro[p.cilindro]} x${p.cantidad}</small>
                        </div>
                        <div class="text-end">
                            <span class="badge ${est.clase}">${est.texto}</span>
                            <br><small class="text-muted mt-1 d-block">${p.id}</small>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    function seleccionarPedido(id) {
        pedidoSeleccionado = pedidos.find(p => p.id === id);
        if (!pedidoSeleccionado) return;

        const est = estados[pedidoSeleccionado.estado];

        document.getElementById('detalle-pedido').style.display = 'block';
        document.getElementById('det-id').textContent = pedidoSeleccionado.id;
        document.getElementById('det-fecha').textContent = new Date(pedidoSeleccionado.fecha).toLocaleString('es-CL');
        document.getElementById('det-cliente').textContent = pedidoSeleccionado.cliente;
        document.getElementById('det-fono').textContent = pedidoSeleccionado.fono;
        document.getElementById('det-fono').href = 'tel:' + pedidoSeleccionado.fono;
        document.getElementById('det-direccion').textContent = pedidoSeleccionado.direccion + ', ' + pedidoSeleccionado.comuna;
        document.getElementById('det-producto').textContent = nombresCilindro[pedidoSeleccionado.cilindro] + ' x' + pedidoSeleccionado.cantidad;
        document.getElementById('det-total').textContent = '$ ' + pedidoSeleccionado.total.toLocaleString('es-CL');

        const badge = document.getElementById('det-estado');
        badge.textContent = est.texto;
        badge.className = 'badge ' + est.clase;

        renderizarAcciones();
        centrarMapaEnPedido(pedidoSeleccionado);
    }

    function renderizarAcciones() {
        const container = document.getElementById('acciones-pedido');
        const p = pedidoSeleccionado;

        if (!p) { container.innerHTML = ''; return; }

        let botones = '';

        if (p.estado === 'asignado') {
            botones = `
                <button class="btn btn-warning fw-bold btn-estado" onclick="iniciarRuta('${p.id}')">
                    🚚 Iniciar Ruta
                </button>
                <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(p.direccion + ', ' + p.comuna + ', Chile')}" target="_blank" class="btn btn-outline-dark btn-estado">
                    📍 Abrir en Google Maps
                </a>
            `;
        } else if (p.estado === 'camino') {
            botones = `
                <button class="btn btn-success fw-bold btn-estado" onclick="marcarEntregado('${p.id}')">
                    ✅ Marcar como Entregado
                </button>
                <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(p.direccion + ', ' + p.comuna + ', Chile')}" target="_blank" class="btn btn-outline-dark btn-estado">
                    📍 Abrir en Google Maps
                </a>
                <a href="tel:${p.fono}" class="btn btn-outline-primary btn-estado">
                    📞 Llamar al cliente
                </a>
            `;
        } else if (p.estado === 'entregado') {
            botones = `
                <div class="alert alert-success mb-0 text-center">
                    ✅ Entrega completada<br>
                    <small>Pago registrado: $${p.total.toLocaleString('es-CL')}</small>
                </div>
            `;
        } else {
            botones = '<p class="text-muted text-center mb-0">Este pedido aún no está asignado a ti.</p>';
        }

        container.innerHTML = botones;
    }

    window.iniciarRuta = function(id) {
        const p = pedidos.find(x => x.id === id);
        if (!p) return;
        p.estado = 'camino';
        guardarYActualizar();
        alert('Ruta iniciada. ¡Buena suerte!');
    };

    window.marcarEntregado = function(id) {
        const p = pedidos.find(x => x.id === id);
        if (!p) return;

        if (confirm(`¿Confirmar entrega a ${p.cliente}?\n\nPago: $${p.total.toLocaleString('es-CL')} (${p.pago})`)) {
            p.estado = 'entregado';
            guardarYActualizar();
            alert('Entrega registrada exitosamente. ✅');
        }
    };

    function guardarYActualizar() {
        localStorage.setItem('pedidosLaChispa', JSON.stringify(pedidos));
        renderizarKPIs();
        renderizarLista();
        renderizarMapa();
        if (pedidoSeleccionado) {
            seleccionarPedido(pedidoSeleccionado.id);
        }
    }

    window.actualizarMisPedidos = function() {
        cargarPedidos();
    };

    window.cambiarRepartidor = function() {
        const opciones = ['Carlos Rojas', 'María López', 'Jorge Díaz'];
        const actual = opciones.indexOf(repartidorActual);
        repartidorActual = opciones[(actual + 1) % opciones.length];
        document.querySelector('nav .d-flex span').textContent = repartidorActual;
        pedidoSeleccionado = null;
        document.getElementById('detalle-pedido').style.display = 'none';
        cargarPedidos();
    };

    function renderizarMapa() {
        if (mapa) {
            marcadores.forEach(m => mapa.removeLayer(m));
            marcadores = [];
            return;
        }

        mapa = L.map('mapa-repartidor').setView([-36.6066, -72.1034], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(mapa);

        actualizarMarcadores();
    }

    function actualizarMarcadores() {
        marcadores.forEach(m => mapa.removeLayer(m));
        marcadores = [];

        const mios = pedidos.filter(p => p.repartidor === repartidorActual);

        // Bodega
        const iconoBodega = L.divIcon({
            html: '<div style="background:#0d6efd;color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:13px;border:2px solid white;">🏢</div>',
            iconSize: [28, 28], iconAnchor: [14, 14], className: ''
        });
        marcadores.push(L.marker([BODEGA.lat, BODEGA.lng], { icon: iconoBodega }).addTo(mapa).bindPopup('<b>Bodega</b>'));

        // Pedidos
        mios.forEach(p => {
            const pos = destinos[p.comuna];
            if (!pos) return;

            const colores = { 'asignado': '#0dcaf0', 'camino': '#ffc107', 'entregado': '#198754' };
            const icon = L.divIcon({
                html: `<div style="background:${colores[p.estado] || '#6c757d'};color:white;border-radius:50%;width:25px;height:25px;display:flex;align-items:center;justify-content:center;font-size:12px;border:2px solid white;">${p.estado === 'entregado' ? '✓' : '📍'}</div>`,
                iconSize: [25, 25], iconAnchor: [12, 12], className: ''
            });

            marcadores.push(
                L.marker([pos.lat, pos.lng], { icon }).addTo(mapa)
                    .bindPopup(`<b>${p.id}</b><br>${p.cliente}<br>${p.direccion}`)
            );
        });

        if (mios.length > 0) {
            const bounds = L.latLngBounds([[BODEGA.lat, BODEGA.lng]]);
            mios.forEach(p => {
                const pos = destinos[p.comuna];
                if (pos) bounds.extend([pos.lat, pos.lng]);
            });
            mapa.fitBounds(bounds, { padding: [30, 30] });
        }
    }

    function centrarMapaEnPedido(p) {
        const pos = destinos[p.comuna];
        if (pos && mapa) {
            mapa.setView([pos.lat, pos.lng], 14);
        }
    }

    cargarPedidos();
});