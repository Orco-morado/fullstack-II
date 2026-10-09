document.addEventListener("DOMContentLoaded", function() {

    const precios = {
        '5': 11500,
        '11': 20000,
        '15': 27000,
        '45': 60000
    };

    const nombres = {
        '5': 'Cilindro 5 kg',
        '11': 'Cilindro 11 kg',
        '15': 'Cilindro 15 kg',
        '45': 'Cilindro 45 kg'
    };

    const form = document.getElementById('formPedido');
    const resumen = document.getElementById('resumen-pedido');
    const cantidadInput = document.getElementById('cantidad');

    // Actualizar resumen en tiempo real
    function actualizarResumen() {
        const cilindroSel = document.querySelector('input[name="cilindro"]:checked');
        const cantidad = parseInt(cantidadInput.value) || 1;

        if (!cilindroSel) {
            resumen.innerHTML = '<p class="text-muted mb-0">Selecciona un cilindro para ver el resumen</p>';
            return;
        }

        const precio = precios[cilindroSel.value];
        const total = precio * cantidad;

        resumen.innerHTML = `
            <div class="d-flex justify-content-between mb-1">
                <span>${nombres[cilindroSel.value]}</span>
                <span class="fw-bold">$ ${precio.toLocaleString('es-CL')}</span>
            </div>
            <div class="d-flex justify-content-between mb-1">
                <span>Cantidad: ${cantidad}</span>
                <span class="text-muted">x${cantidad}</span>
            </div>
            <hr class="my-2">
            <div class="d-flex justify-content-between">
                <span class="fw-bold">Total estimado</span>
                <span class="fw-bold text-success fs-5">$ ${total.toLocaleString('es-CL')}</span>
            </div>
            <small class="text-muted d-block mt-1">El pago se realiza al recibir el pedido</small>
        `;
    }

    document.querySelectorAll('input[name="cilindro"]').forEach(radio => {
        radio.addEventListener('change', actualizarResumen);
    });
    cantidadInput.addEventListener('input', actualizarResumen);

    // Envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const nombre = document.getElementById('nombreCliente').value.trim();
        const fono = document.getElementById('fonoCliente').value.trim();
        const comuna = document.getElementById('comuna').value;
        const direccion = document.getElementById('direccion').value.trim();
        const cilindroSel = document.querySelector('input[name="cilindro"]:checked');
        const cantidad = parseInt(cantidadInput.value) || 1;
        const terminos = document.getElementById('terminos').checked;

        // Validaciones
        if (!nombre || !fono || !comuna || !direccion) {
            alert('Por favor completa todos los campos obligatorios.');
            return;
        }

        if (!cilindroSel) {
            alert('Selecciona un tipo de cilindro.');
            return;
        }

        if (!terminos) {
            alert('Debes aceptar los términos y condiciones.');
            return;
        }

        if (cantidad < 1 || cantidad > 20) {
            alert('La cantidad debe estar entre 1 y 20.');
            return;
        }

        // Generar número de pedido
        const numPedido = 'GC-' + Date.now().toString().slice(-6);

        // Guardar en localStorage (mock hasta tener backend)
        const pedidos = JSON.parse(localStorage.getItem('pedidosLaChispa')) || [];
        const nuevoPedido = {
            id: numPedido,
            cliente: nombre,
            fono: fono,
            email: document.getElementById('emailCliente').value.trim(),
            comuna: comuna,
            direccion: direccion,
            referencia: document.getElementById('referencia').value.trim(),
            cilindro: cilindroSel.value,
            cantidad: cantidad,
            total: precios[cilindroSel.value] * cantidad,
            horario: document.getElementById('horario').value,
            pago: document.getElementById('pago').value,
            observaciones: document.getElementById('obs').value.trim(),
            estado: 'recibido',
            fecha: new Date().toISOString(),
            repartidor: null
        };

        pedidos.push(nuevoPedido);
        localStorage.setItem('pedidosLaChispa', JSON.stringify(pedidos));

        // Mostrar confirmación
        alert(
            `¡Pedido registrado con éxito!\n\n` +
            `Número: ${numPedido}\n` +
            `Producto: ${nombres[cilindroSel.value]} x${cantidad}\n` +
            `Total: $ ${(precios[cilindroSel.value] * cantidad).toLocaleString('es-CL')}\n\n` +
            `Podrás seguir tu pedido en "Mi Pedido".`
        );

        // Redirigir a seguimiento
        window.location.href = `seguimiento.html?id=${numPedido}`;
    });

    actualizarResumen();
});