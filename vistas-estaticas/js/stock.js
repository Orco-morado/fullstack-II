document.addEventListener("DOMContentLoaded", function() {

    const productos = {
        '5': { nombre: 'Cilindro 5 kg', minimo: 20 },
        '11': { nombre: 'Cilindro 11 kg', minimo: 20 },
        '15': { nombre: 'Cilindro 15 kg', minimo: 15 },
        '45': { nombre: 'Cilindro 45 kg', minimo: 10 }
    };

    let stock = {};
    let movimientos = [];
    let filtroMov = 'todos';

    function cargarDatos() {
        // Stock por defecto si no existe
        stock = JSON.parse(localStorage.getItem('stockLaChispa')) || {
            '5': 120,
            '11': 85,
            '15': 35,
            '45': 8
        };

        movimientos = JSON.parse(localStorage.getItem('movimientosLaChispa')) || [];

        renderizarStock();
        renderizarAlertas();
        renderizarMovimientos();
    }

    function renderizarStock() {
        Object.keys(productos).forEach(key => {
            const el = document.getElementById('stock-' + key);
            const badge = document.getElementById('badge-stock-' + key);
            const cantidad = stock[key] || 0;
            const minimo = productos[key].minimo;

            el.textContent = cantidad;

            if (cantidad <= 0) {
                badge.textContent = 'AGOTADO';
                badge.className = 'badge bg-danger';
                el.classList.add('text-danger');
            } else if (cantidad < minimo) {
                badge.textContent = 'STOCK BAJO';
                badge.className = 'badge bg-warning text-dark';
                el.classList.add('text-warning');
            } else {
                badge.textContent = 'OK';
                badge.className = 'badge bg-success';
                el.classList.remove('text-danger', 'text-warning');
            }
        });
    }

    function renderizarAlertas() {
        const container = document.getElementById('alertas-stock');
        let alertas = '';

        Object.keys(productos).forEach(key => {
            const cantidad = stock[key] || 0;
            const minimo = productos[key].minimo;

            if (cantidad <= 0) {
                alertas += `
                    <div class="alert alert-danger mb-2">
                        <strong>⚠ ${productos[key].nombre} AGOTADO</strong> - No hay unidades disponibles para despacho.
                    </div>
                `;
            } else if (cantidad < minimo) {
                alertas += `
                    <div class="alert alert-warning mb-2">
                        <strong>⚠ ${productos[key].nombre} con stock bajo</strong> - Quedan ${cantidad} unidades (mínimo recomendado: ${minimo}).
                    </div>
                `;
            }
        });

        container.innerHTML = alertas;
    }

    function renderizarMovimientos() {
        const tbody = document.getElementById('tbody-movimientos');

        let lista = movimientos;
        if (filtroMov !== 'todos') {
            lista = movimientos.filter(m => m.tipo === filtroMov);
        }

        if (lista.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4">Sin movimientos registrados</td></tr>';
            return;
        }

        tbody.innerHTML = '';
        lista.reverse().forEach(m => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${new Date(m.fecha).toLocaleString('es-CL')}</td>
                <td><span class="badge ${m.tipo === 'entrada' ? 'bg-success' : 'bg-danger'}">${m.tipo === 'entrada' ? '📥 Entrada' : '📤 Salida'}</span></td>
                <td>${productos[m.producto]?.nombre || m.producto}</td>
                <td class="fw-bold">${m.tipo === 'entrada' ? '+' : '-'}${m.cantidad}</td>
                <td>${m.responsable}</td>
                <td><small>${m.motivo || '-'}</small></td>
            `;
            tbody.appendChild(fila);
        });
    }

    // Filtros de movimientos
    document.querySelectorAll('[data-mov]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('[data-mov]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filtroMov = this.dataset.mov;
            renderizarMovimientos();
        });
    });

    window.abrirModalMovimiento = function() {
        const modal = new bootstrap.Modal(document.getElementById('modalMovimiento'));
        modal.show();
    };

    window.guardarMovimiento = function() {
        const form = document.getElementById('formMovimiento');
        const tipo = document.querySelector('input[name="tipoMov"]:checked');

        if (!tipo) {
            alert('Selecciona el tipo de movimiento (entrada o salida).');
            return;
        }

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const producto = document.getElementById('movProducto').value;
        const cantidad = parseInt(document.getElementById('movCantidad').value);
        const responsable = document.getElementById('movResponsable').value.trim();
        const motivo = document.getElementById('movMotivo').value.trim();

        // Validar stock suficiente para salidas
        if (tipo.value === 'salida' && (stock[producto] || 0) < cantidad) {
            alert(`Stock insuficiente. Solo hay ${stock[producto] || 0} unidades disponibles.`);
            return;
        }

        // Actualizar stock
        if (tipo.value === 'entrada') {
            stock[producto] = (stock[producto] || 0) + cantidad;
        } else {
            stock[producto] = (stock[producto] || 0) - cantidad;
        }

        // Registrar movimiento
        movimientos.push({
            fecha: new Date().toISOString(),
            tipo: tipo.value,
            producto: producto,
            cantidad: cantidad,
            responsable: responsable,
            motivo: motivo
        });

        // Guardar
        localStorage.setItem('stockLaChispa', JSON.stringify(stock));
        localStorage.setItem('movimientosLaChispa', JSON.stringify(movimientos));

        // Cerrar modal y actualizar
        bootstrap.Modal.getInstance(document.getElementById('modalMovimiento')).hide();
        form.reset();
        renderizarStock();
        renderizarAlertas();
        renderizarMovimientos();

        alert(`Movimiento registrado: ${tipo.value === 'entrada' ? '+' : '-'}${cantidad} ${productos[producto].nombre}`);
    };

    cargarDatos();
});