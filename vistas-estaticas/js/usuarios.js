document.addEventListener("DOMContentLoaded", function() {

    const roles = {
        'Administrador': { clase: 'bg-danger', icono: '👑' },
        'Operadora': { clase: 'bg-info text-dark', icono: '📞' },
        'Repartidor': { clase: 'bg-warning text-dark', icono: '🚚' },
        'Cliente': { clase: 'bg-success', icono: '👤' }
    };

    let usuarios = [];
    let usuarioEditando = null;

    function cargarUsuarios() {
        usuarios = JSON.parse(localStorage.getItem('usuariosLaChispa')) || [];

        // Si no hay usuarios, crear datos de ejemplo
        if (usuarios.length === 0) {
            usuarios = crearUsuariosEjemplo();
            localStorage.setItem('usuariosLaChispa', JSON.stringify(usuarios));
        }

        renderizarEstadisticas();
        renderizarTabla();
    }

    function crearUsuariosEjemplo() {
        return [
            { id: 1, run: '12345678-9', nombre: 'Ana García', email: 'admin@gaslachispa.cl', fono: '+56 9 1111 1111', rol: 'Administrador', estado: 'activo', ultimoAcceso: '2026-10-08T10:30:00', comuna: 'Chillan', direccion: '' },
            { id: 2, run: '23456789-0', nombre: 'María López', email: 'operadora1@gaslachispa.cl', fono: '+56 9 2222 2222', rol: 'Operadora', estado: 'activo', ultimoAcceso: '2026-10-08T08:15:00', comuna: 'Chillan', direccion: '' },
            { id: 3, run: '34567890-1', nombre: 'Carlos Rojas', email: 'repartidor1@gaslachispa.cl', fono: '+56 9 3333 3333', rol: 'Repartidor', estado: 'activo', ultimoAcceso: '2026-10-08T07:45:00', comuna: 'Chillan', direccion: 'Los Alerces 123' },
            { id: 4, run: '45678901-2', nombre: 'María López', email: 'repartidor2@gaslachispa.cl', fono: '+56 9 4444 4444', rol: 'Repartidor', estado: 'activo', ultimoAcceso: '2026-10-08T07:50:00', comuna: 'Chillan', direccion: 'Las Rosas 456' },
            { id: 5, run: '56789012-3', nombre: 'Jorge Díaz', email: 'repartidor3@gaslachispa.cl', fono: '+56 9 5555 5555', rol: 'Repartidor', estado: 'activo', ultimoAcceso: '2026-10-07T17:20:00', comuna: 'Chillan', direccion: 'El Molino 789' },
            { id: 6, run: '67890123-4', nombre: 'Pedro Muñoz', email: 'cliente1@gmail.com', fono: '+56 9 6666 6666', rol: 'Cliente', estado: 'activo', ultimoAcceso: '2026-10-06T14:30:00', comuna: 'ChillanViejo', direccion: 'Independencia 987' },
            { id: 7, run: '78901234-5', nombre: 'Lucía Herrera', email: 'cliente2@gmail.com', fono: '+56 9 7777 7777', rol: 'Cliente', estado: 'inactivo', ultimoAcceso: '2026-09-15T11:00:00', comuna: 'Chillan', direccion: 'San Martín 321' }
        ];
    }

    function renderizarEstadisticas() {
        document.getElementById('total-usuarios').textContent = usuarios.length;
        document.getElementById('total-admin').textContent = usuarios.filter(u => u.rol === 'Administrador').length;
        document.getElementById('total-operadora').textContent = usuarios.filter(u => u.rol === 'Operadora').length;
        document.getElementById('total-repartidor').textContent = usuarios.filter(u => u.rol === 'Repartidor').length;
    }

    function renderizarTabla() {
        const tbody = document.getElementById('tbody-usuarios');
        const busqueda = document.getElementById('buscarUsuario').value.toLowerCase();
        const rolFiltro = document.getElementById('filtroRol').value;
        const estadoFiltro = document.getElementById('filtroEstado').value;

        let lista = usuarios;

        if (busqueda) {
            lista = lista.filter(u =>
                u.nombre.toLowerCase().includes(busqueda) ||
                u.email.toLowerCase().includes(busqueda) ||
                u.run.toLowerCase().includes(busqueda)
            );
        }

        if (rolFiltro) {
            lista = lista.filter(u => u.rol === rolFiltro);
        }

        if (estadoFiltro) {
            lista = lista.filter(u => u.estado === estadoFiltro);
        }

        if (lista.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-4">No se encontraron usuarios</td></tr>';
            return;
        }

        tbody.innerHTML = '';
        lista.forEach(u => {
            const rolInfo = roles[u.rol] || roles.Cliente;
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>
                    <div class="d-flex align-items-center">
                        <div class="rounded-circle bg-light d-flex align-items-center justify-content-center me-2" style="width: 35px; height: 35px; font-size: 16px;">${rolInfo.icono}</div>
                        <strong>${u.nombre}</strong>
                    </div>
                </td>
                <td>${u.run}</td>
                <td>${u.email}</td>
                <td><span class="badge ${rolInfo.clase}">${u.rol}</span></td>
                <td><span class="badge ${u.estado === 'activo' ? 'bg-success' : 'bg-secondary'}">${u.estado === 'activo' ? 'Activo' : 'Inactivo'}</span></td>
                <td><small>${u.ultimoAcceso ? new Date(u.ultimoAcceso).toLocaleDateString('es-CL') : 'Nunca'}</small></td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="editarUsuario(${u.id})" title="Editar">✏️</button>
                        <button class="btn btn-outline-${u.estado === 'activo' ? 'danger' : 'success'}" onclick="toggleEstado(${u.id})" title="${u.estado === 'activo' ? 'Desactivar' : 'Activar'}">
                            ${u.estado === 'activo' ? '🚫' : '✅'}
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(fila);
        });
    }

    // Filtros en tiempo real
    document.getElementById('buscarUsuario').addEventListener('input', renderizarTabla);
    document.getElementById('filtroRol').addEventListener('change', renderizarTabla);
    document.getElementById('filtroEstado').addEventListener('change', renderizarTabla);

    window.abrirModalUsuario = function() {
        usuarioEditando = null;
        document.getElementById('modalUsuarioTitulo').textContent = 'Nuevo Usuario';
        document.getElementById('formUsuario').reset();
        document.getElementById('usuarioId').value = '';
        document.getElementById('campoPassword').style.display = 'block';
        document.getElementById('uPassword').required = true;
        document.getElementById('uPassword').value = '';

        const modal = new bootstrap.Modal(document.getElementById('modalUsuario'));
        modal.show();
    };

    window.editarUsuario = function(id) {
        const u = usuarios.find(x => x.id === id);
        if (!u) return;

        usuarioEditando = u;
        document.getElementById('modalUsuarioTitulo').textContent = 'Editar Usuario';
        document.getElementById('usuarioId').value = u.id;
        document.getElementById('uRun').value = u.run;
        document.getElementById('uNombre').value = u.nombre;
        document.getElementById('uEmail').value = u.email;
        document.getElementById('uFono').value = u.fono;
        document.getElementById('uRol').value = u.rol;
        document.getElementById('uEstado').value = u.estado;
        document.getElementById('uComuna').value = u.comuna || '';
        document.getElementById('uDireccion').value = u.direccion || '';

        // En edición, la contraseña es opcional
        document.getElementById('campoPassword').style.display = 'block';
        document.getElementById('uPassword').required = false;
        document.getElementById('uPassword').value = '';
        document.getElementById('uPassword').placeholder = 'Dejar en blanco para no cambiar';

        const modal = new bootstrap.Modal(document.getElementById('modalUsuario'));
        modal.show();
    };

    window.guardarUsuario = function() {
        const form = document.getElementById('formUsuario');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const run = document.getElementById('uRun').value.trim();
        const email = document.getElementById('uEmail').value.trim();
        const password = document.getElementById('uPassword').value;

        // Validar RUN duplicado
        const runExiste = usuarios.find(u => u.run === run && u.id !== usuarioEditando?.id);
        if (runExiste) {
            alert('Ya existe un usuario con ese RUN.');
            return;
        }

        // Validar email duplicado
        const emailExiste = usuarios.find(u => u.email === email && u.id !== usuarioEditando?.id);
        if (emailExiste) {
            alert('Ya existe un usuario con ese email.');
            return;
        }

        // Validar contraseña en nuevo usuario
        if (!usuarioEditando && (!password || password.length < 4 || password.length > 10)) {
            alert('La contraseña debe tener entre 4 y 10 caracteres.');
            return;
        }

        const datos = {
            run: run,
            nombre: document.getElementById('uNombre').value.trim(),
            email: email,
            fono: document.getElementById('uFono').value.trim(),
            rol: document.getElementById('uRol').value,
            estado: document.getElementById('uEstado').value,
            comuna: document.getElementById('uComuna').value,
            direccion: document.getElementById('uDireccion').value.trim()
        };

        if (usuarioEditando) {
            Object.assign(usuarioEditando, datos);
        } else {
            usuarios.push({
                id: Date.now(),
                ...datos,
                password: password,
                ultimoAcceso: null
            });
        }

        localStorage.setItem('usuariosLaChispa', JSON.stringify(usuarios));
        bootstrap.Modal.getInstance(document.getElementById('modalUsuario')).hide();
        renderizarEstadisticas();
        renderizarTabla();

        alert(usuarioEditando ? 'Usuario actualizado exitosamente.' : 'Usuario creado exitosamente.');
    };

    window.toggleEstado = function(id) {
        const u = usuarios.find(x => x.id === id);
        if (!u) return;

        const accion = u.estado === 'activo' ? 'desactivar' : 'activar';
        if (confirm(`¿${accion.charAt(0).toUpperCase() + accion.slice(1)} al usuario ${u.nombre}?`)) {
            u.estado = u.estado === 'activo' ? 'inactivo' : 'activo';
            localStorage.setItem('usuariosLaChispa', JSON.stringify(usuarios));
            renderizarEstadisticas();
            renderizarTabla();
        }
    };

    cargarUsuarios();
});