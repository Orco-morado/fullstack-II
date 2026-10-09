document.addEventListener("DOMContentLoaded", function() {

    const precios = { '5': 11500, '11': 20000, '15': 27000, '45': 60000 };
    const nombresCilindro = { '5': 'Cilindro 5 kg', '11': 'Cilindro 11 kg', '15': 'Cilindro 15 kg', '45': 'Cilindro 45 kg' };

    const estados = {
        'recibido': { texto: 'Recibido', clase: 'bg-secondary' },
        'asignado': { texto: 'Asignado', clase: 'bg-info text-dark' },
        'camino': { texto: 'En camino', clase: 'bg-warning text-dark' },
        'entregado': { texto: 'Entregado', clase: 'bg-success' }
    };

    let pedidos = [];
    let mapa = null;
    let filtroActual = 'todos';
    let pedidoSeleccionado = null;

    // Fecha actual
    document.getElementById('fecha-hoy').textContent = new Date().toLocaleDateString('es-CL', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    // Filtros
    document.querySelectorAll('[data-filtro]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('[data-filtro]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filtroActual = this.dataset.filtro;
            renderizarTabla();
        });
    });

    function cargarPedidos() {
        pedidos = JSON.parse(localStorage.getItem('pedidosLaChispa')) || [];
        renderizarTabla();
        renderizarKPIs();
        renderizarMapa();
    }

    function renderizarKPIs() {
        document.getElementById('kpi-total').textContent = pedidos.length;
        document.getElementById('kpi-pendientes').textContent = pedidos.filter(p => p.estado === 'recibido').length;
        document.getElementById('kpi-camino').textContent = pedidos.filter(p => p.estado === 'camino' || p.estado === 'asignado').length;
        document.getElementById('kpi-entregados').textContent = pedidos.filter(p => p.estado === 'entregado').length;
    }

    function renderizarTabla() {
        const tbody = document.getElementById('tbody-pedidos');

        let lista = pedidos;
        if (filtroActual !== 'todos') {
            if (filtroActual === 'recibido') {
                lista = pedidos.filter(p => p.estado === 'recibido');
            } else {
                lista = pedidos.filter(p => p.estado === filtroActual);
            }
        }

        if (lista.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-4">No hay pedidos en esta categoría</td></tr>';
            return;
        }

        tbody.innerHTML = '';
        lista.forEach(p => {
            const est = estados[p.estado] || estados.recibido;
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td><strong>${p.id}</strong></td>
                <td>${p.cliente}<br><small class="text-muted">${p.fono}</small></td>
                <td>${nombresCilindro[p.cilindro]} x${p.cantidad}</td>
                <td>${p.comuna}</td>
                <td><span class="badge ${est.clase}">${est.texto}</span></td>
                <td>${p.repartidor || '<span class="text-muted">Sin asignar</span>'}</td>
                <td>
                    ${p.estado === 'recibido'
                        ? `<button class="btn btn-sm btn-warning fw-bold" onclick="asignarPedido('${p.id}')">Asignar</button>`
                        : p.estado === 'asignado'
                        ? `<button class="btn btn-sm btn-outline-warning" onclick="cambiarEstado('${p.id}','camino')">Iniciar ruta</button>`
                        : p.estado === 'camino'
                        ? `<button class="btn btn-sm btn-success" onclick="cambiarEstado('${p.id}','entregado')">Entregado</button>`
                        : '<span class="text-muted small">Completado</span>'
                    }
                </td>
            `;
            tbody.appendChild(fila);
        });
    }

    function renderizarMapa() {
        if (mapa) mapa.remove();

        mapa = L.map('mapa-operadora').setView([-36.6066, -72.1034], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(mapa);

        const destinos = {
            'Chillan': { lat: -36.6050, lng: -72.1020 },
            'ChillanViejo': { lat: -36.6230, lng: -72.1030 },
            'SanNicolas': { lat: -36.5000, lng: -72.2000 },
            'Pinto': { lat: -36.7000, lng: -71.9000 },
            'Coihueco': { lat: -36.6250, lng: -71.8300 }
        };

        const colores = {
            'recibido': '#6c757d',
            'asignado': '#0dcaf0',
            'camino': '#ffc107',
            'entregado': '#198754'
        };

        pedidos.forEach(p => {
            const pos = destinos[p.comuna];
            if (!pos) return;

            const icon = L.divIcon({
                className: 'custom-marker',
                html: `<div style="background:${colores[p.estado]};color:white;border-radius:50%;width:25px;height:25px;display:flex;align-items:center;justify-content:center;font-size:11px;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3);">${p.estado === 'entregado' ? '✓' : p.cantidad}</div>`,
                iconSize: [25, 25],
                iconAnchor: [12, 12]
            });

            L.marker([pos.lat, pos.lng], { icon })
                .addTo(mapa)
                .bindPopup(`<b>${p.id}</b><br>${p.cliente}<br>${nombresCilindro[p.cilindro]} x${p.cantidad}<br><b>Estado:</b> ${estados[p.estado]?.texto}`);
        });
    }

    window.actualizarVista = function() {
        cargarPedidos();
    };

    window.abrirModalNuevoPedido = function() {
        const modal = new bootstrap.Modal(document.getElementById('modalNuevoPedido'));
        modal.show();
    };

    window.guardarNuevoPedido = function() {
        const form = document.getElementById('formNuevoPedido');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const cilindro = document.getElementById('npCilindro').value;
        const cantidad = parseInt(document.getElementById('npCantidad').value);
        const repartidor = document.getElementById('npRepartidor').value;

        const nuevoPedido = {
            id: 'GC-' + Date.now().toString().slice(-6),
            cliente: document.getElementById('npCliente').value.trim(),
            fono: document.getElementById('npFono').value.trim(),
            comuna: document.getElementById('npComuna').value,
            direccion: document.getElementById('npDireccion').value.trim(),
            cilindro: cilindro,
            cantidad: cantidad,
            total: precios[cilindro] * cantidad,
            estado: repartidor ? 'asignado' : 'recibido',
            repartidor: repartidor || null,
            observaciones: document.getElementById('npObs').value.trim(),
            fecha: new Date().toISOString(),
            pago: 'efectivo'
        };

        pedidos.push(nuevoPedido);
        localStorage.setItem('pedidosLaChispa', JSON.stringify(pedidos));

        bootstrap.Modal.getInstance(document.getElementById('modalNuevoPedido')).hide();
        form.reset();
        cargarPedidos();
        alert(`Pedido ${nuevoPedido.id} creado exitosamente.`);
    };

    window.asignarPedido = function(id) {
        pedidoSeleccionado = pedidos.find(p => p.id === id);
        if (!pedidoSeleccionado) return;

        document.getElementById('asignar-pedido-id').textContent = id;
        const modal = new bootstrap.Modal(document.getElementById('modalAsignar'));
        modal.show();
    };

    window.confirmarAsignacion = function() {
        if (!pedidoSeleccionado) return;

        const repartidor = document.getElementById('selectRepartidor').value;
        pedidoSeleccionado.repartidor = repartidor;
        pedidoSeleccionado.estado = 'asignado';

        guardarPedidos();
        bootstrap.Modal.getInstance(document.getElementById('modalAsignar')).hide();
        cargarPedidos();
    };

    window.cambiarEstado = function(id, nuevoEstado) {
        const pedido = pedidos.find(p => p.id === id);
        if (!pedido) return;

        pedido.estado = nuevoEstado;
        guardarPedidos();
        cargarPedidos();
    };

    function guardarPedidos() {
        localStorage.setItem('pedidosLaChispa', JSON.stringify(pedidos));
    }

    // Cargar datos iniciales
    cargarPedidos();
});