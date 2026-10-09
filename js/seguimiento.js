document.addEventListener("DOMContentLoaded", function() {

    // Coordenadas de Chillán y alrededores
    const CHILLAN = { lat: -36.6066, lng: -72.1034 };
    const BODEGA = { lat: -36.6080, lng: -72.1050 };

    const estados = {
        'recibido': { icono: '📦', titulo: 'Recibido', desc: 'Tu pedido fue registrado y está esperando asignación.', progreso: 25, badge: 'bg-secondary' },
        'asignado': { icono: '👤', titulo: 'Asignado', desc: 'Un repartidor fue asignado a tu pedido. Preparando la carga.', progreso: 50, badge: 'bg-info text-dark' },
        'camino': { icono: '🚚', titulo: 'En Camino', desc: 'Tu repartidor está en ruta hacia tu dirección.', progreso: 75, badge: 'bg-warning text-dark' },
        'entregado': { icono: '✅', titulo: 'Entregado', desc: 'Tu pedido fue entregado exitosamente. ¡Gracias!', progreso: 100, badge: 'bg-success' }
    };

    const nombresCilindro = {
        '5': 'Cilindro 5 kg',
        '11': 'Cilindro 11 kg',
        '15': 'Cilindro 15 kg',
        '45': 'Cilindro 45 kg'
    };

    let mapa = null;
    let marcadorRepartidor = null;
    let marcadorDestino = null;
    let intervaloSimulacion = null;

    const formBuscar = document.getElementById('formBuscar');
    const container = document.getElementById('seguimiento-container');
    const sinResultado = document.getElementById('sin-resultado');

    // Si hay ?id= en la URL, buscar automáticamente
    const params = new URLSearchParams(window.location.search);
    const idInicial = params.get('id');
    if (idInicial) {
        document.getElementById('buscarId').value = idInicial;
        buscarPedido(idInicial);
    }

    formBuscar.addEventListener('submit', function(e) {
        e.preventDefault();
        const id = document.getElementById('buscarId').value.trim();
        buscarPedido(id);
    });

    function buscarPedido(id) {
        const pedidos = JSON.parse(localStorage.getItem('pedidosLaChispa')) || [];
        const pedido = pedidos.find(p => p.id.toUpperCase() === id.toUpperCase());

        if (!pedido) {
            container.style.display = 'none';
            sinResultado.style.display = 'block';
            return;
        }

        sinResultado.style.display = 'none';
        container.style.display = 'block';
        renderizarPedido(pedido);
    }

    function renderizarPedido(pedido) {
        const est = estados[pedido.estado] || estados.recibido;

        document.getElementById('pedido-id').textContent = pedido.id;
        document.getElementById('pedido-fecha').textContent = new Date(pedido.fecha).toLocaleString('es-CL');
        document.getElementById('pedido-producto').textContent = nombresCilindro[pedido.cilindro] || pedido.cilindro;
        document.getElementById('pedido-cantidad').textContent = pedido.cantidad;
        document.getElementById('pedido-total').textContent = '$ ' + pedido.total.toLocaleString('es-CL');
        document.getElementById('pedido-direccion').textContent = pedido.direccion + ', ' + pedido.comuna;
        document.getElementById('pedido-repartidor').textContent = pedido.repartidor || 'Pendiente de asignación';
        document.getElementById('pedido-pago').textContent = pedido.pago === 'efectivo' ? 'Efectivo' : 'Transferencia';

        // Badge de estado
        const badge = document.getElementById('pedido-estado-badge');
        badge.textContent = est.titulo;
        badge.className = 'badge fs-6 ' + est.badge;

        // Barra de progreso
        document.getElementById('progress-bar').style.width = est.progreso + '%';

        // Icono y descripción
        document.getElementById('estado-icono').textContent = est.icono;
        document.getElementById('estado-titulo').textContent = est.titulo;
        document.getElementById('estado-desc').textContent = est.desc;
        document.getElementById('estado-tiempo').textContent = 'Última actualización: ' + new Date().toLocaleTimeString('es-CL');

        // Mapa
        inicializarMapa(pedido);
    }

    function inicializarMapa(pedido) {
        if (mapa) {
            mapa.remove();
        }

        // Posición del destino (simulada según comuna)
        const destinos = {
            'Chillan': { lat: -36.6050, lng: -72.1020 },
            'ChillanViejo': { lat: -36.6230, lng: -72.1030 },
            'SanNicolas': { lat: -36.5000, lng: -72.2000 },
            'Pinto': { lat: -36.7000, lng: -71.9000 },
            'Coihueco': { lat: -36.6250, lng: -71.8300 },
            'Niquen': { lat: -36.4400, lng: -71.9100 },
            'SanCarlos': { lat: -36.4300, lng: -71.9600 },
            'SanFabian': { lat: -36.5600, lng: -71.5100 }
        };

        const destino = destinos[pedido.comuna] || CHILLAN;

        // Crear mapa
        mapa = L.map('mapa-seguimiento').setView([
            (BODEGA.lat + destino.lat) / 2,
            (BODEGA.lng + destino.lng) / 2
        ], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(mapa);

        // Marcador destino
        const iconoDestino = L.divIcon({
            className: 'custom-marker',
            html: '<div style="background:#dc3545;color:white;border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-size:16px;border:2px solid white;box-shadow:0 2px 5px rgba(0,0,0,0.3);">🏠</div>',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        marcadorDestino = L.marker([destino.lat, destino.lng], { icon: iconoDestino }).addTo(mapa);
        marcadorDestino.bindPopup(`<b>Tu dirección</b><br>${pedido.direccion}`);

        // Marcador repartidor (simulado)
        const iconoRepartidor = L.divIcon({
            className: 'custom-marker',
            html: '<div style="background:#ffc107;color:black;border-radius:50%;width:35px;height:35px;display:flex;align-items:center;justify-content:center;font-size:18px;border:2px solid white;box-shadow:0 2px 5px rgba(0,0,0,0.3);">🚚</div>',
            iconSize: [35, 35],
            iconAnchor: [17, 17]
        });

        if (pedido.estado === 'camino' || pedido.estado === 'entregado') {
            // Posición simulada del repartidor
            const posRepartidor = pedido.estado === 'entregado'
                ? destino
                : {
                    lat: BODEGA.lat + (destino.lat - BODEGA.lat) * 0.5,
                    lng: BODEGA.lng + (destino.lng - BODEGA.lng) * 0.5
                };

            marcadorRepartidor = L.marker([posRepartidor.lat, posRepartidor.lng], { icon: iconoRepartidor }).addTo(mapa);
            marcadorRepartidor.bindPopup(`<b>Repartidor</b><br>${pedido.repartidor || 'En ruta'}`);

            // Línea de ruta
            L.polyline([
                [BODEGA.lat, BODEGA.lng],
                [posRepartidor.lat, posRepartidor.lng],
                [destino.lat, destino.lng]
            ], { color: '#ffc107', weight: 3, dashArray: '10,10' }).addTo(mapa);

            // Ajustar vista
            mapa.fitBounds([
                [BODEGA.lat, BODEGA.lng],
                [destino.lat, destino.lng]
            ], { padding: [30, 30] });

            // Tiempo estimado
            document.getElementById('mapa-tiempo-llegada').textContent = pedido.estado === 'entregado'
                ? 'Entregado'
                : 'Llegada estimada: ~15-25 min';

            // Simular movimiento si está en camino
            if (pedido.estado === 'camino') {
                simularMovimiento(destino);
            }

        } else {
            // Solo mostrar bodega y destino
            const iconoBodega = L.divIcon({
                className: 'custom-marker',
                html: '<div style="background:#0d6efd;color:white;border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-size:14px;border:2px solid white;box-shadow:0 2px 5px rgba(0,0,0,0.3);">🏢</div>',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });
            L.marker([BODEGA.lat, BODEGA.lng], { icon: iconoBodega }).addTo(mapa).bindPopup('<b>Bodega</b><br>Gas La Chispa');

            mapa.fitBounds([
                [BODEGA.lat, BODEGA.lng],
                [destino.lat, destino.lng]
            ], { padding: [30, 30] });

            document.getElementById('mapa-tiempo-llegada').textContent = 'Esperando asignación';
        }
    }

    function simularMovimiento(destino) {
        if (intervaloSimulacion) clearInterval(intervaloSimulacion);

        let progreso = 0.5;
        intervaloSimulacion = setInterval(() => {
            progreso += 0.02;
            if (progreso >= 1) {
                progreso = 1;
                clearInterval(intervaloSimulacion);
            }

            const lat = BODEGA.lat + (destino.lat - BODEGA.lat) * progreso;
            const lng = BODEGA.lng + (destino.lng - BODEGA.lng) * progreso;

            if (marcadorRepartidor) {
                marcadorRepartidor.setLatLng([lat, lng]);
            }
        }, 3000);
    }
});