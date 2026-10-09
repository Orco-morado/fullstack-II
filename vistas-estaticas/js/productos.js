document.addEventListener("DOMContentLoaded", function() {

    // Catálogo basado en DSY1104 - Forma C - Catalogo Distribuidora Gas El Volcan
    const catalogoProductos = [
        { 
            id: 'VOL-005', 
            nombre: 'Cilindro Normal 5 kg', 
            tipo: 'cilindro', 
            peso: 5, 
            precio: 11500, 
            stock: null,
            img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoe4VQoRhPj4pnXVzeMl7dfOL_t0bSW9E7JPCUWHix0w&s=10',
            desc: 'Ideal para estufas pequeñas y uso doméstico básico'
        },
        { 
            id: 'VOL-011', 
            nombre: 'Cilindro Normal 11 kg', 
            tipo: 'cilindro', 
            peso: 11, 
            precio: 20000, 
            stock: null,
            img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3yhfKiRlMS5LKhPyFcbW4Yi5tR997lJt8xglXm9CFiw&s=10',
            desc: 'El clásico para hogar, uso estándar familiar'
        },
        { 
            id: 'VOL-015', 
            nombre: 'Cilindro Normal 15 kg', 
            tipo: 'cilindro', 
            peso: 15, 
            precio: 27000, 
            stock: null,
            img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRCy_n2hs5Ea6SM_6z-hf18XYC_6biqbxJYTjBBgB3LA&s=10',
            desc: 'Mayor duración, ideal para familias grandes'
        },
        { 
            id: 'VOL-045', 
            nombre: 'Cilindro Normal 45 kg', 
            tipo: 'cilindro', 
            peso: 45, 
            precio: 60000, 
            stock: null,
            img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1uHGeEXlfTHDrT_VTpdKe08_5YWXQiDyLT2RQchm4OQ&s',
            desc: 'El más grande, para uso comercial e industrial'
        },
        { 
            id: 'VOL-CAT', 
            nombre: 'Cilindro Catalítico 11 kg', 
            tipo: 'catalitico', 
            peso: 11, 
            precio: 22000, 
            stock: null,
            img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3yhfKiRlMS5LKhPyFcbW4Yi5tR997lJt8xglXm9CFiw&s=10',
            desc: 'Tecnología catalítica para mayor eficiencia y seguridad'
        },
        { 
            id: 'VOL-ALU', 
            nombre: 'Cilindro Aluminio 15 kg', 
            tipo: 'aluminio', 
            peso: 15, 
            precio: 35000, 
            stock: null,
            img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRCy_n2hs5Ea6SM_6z-hf18XYC_6biqbxJYTjBBgB3LA&s=10',
            desc: 'Ligero y resistente, ideal para transporte frecuente'
        },
        { 
            id: 'GR-100', 
            nombre: 'Carga a Granel (desde 100 litros)', 
            tipo: 'granel', 
            peso: null, 
            precio: 500, 
            stock: null,
            img: 'https://www.csc-trucks.com/uploads/201921798/10cbm-lp-gas-tank-truck56176327375.jpg',
            desc: 'Entrega a granel para industrias y comercios. Precio por litro. Mínimo 100 litros.'
        }
    ];

    let carritoActual = JSON.parse(localStorage.getItem("carritoLaChispa")) || [];
    actualizarContadorCarrito();

    const container = document.getElementById("productos-container");
    const filtroTipo = document.getElementById("filtro-tipo");
    const filtroPeso = document.getElementById("filtro-peso");
    const filtroOrden = document.getElementById("filtro-orden");

    function renderizarProductos(lista) {
        container.innerHTML = "";
        
        if (lista.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="alert alert-info w-75 mx-auto">
                        <h4>No hay productos que coincidan con los filtros</h4>
                        <p class="mb-0">Intenta ajustar los filtros de búsqueda</p>
                    </div>
                </div>
            `;
            return;
        }

        lista.forEach(producto => {
            const badgeTipo = getBadgeTipo(producto.tipo);
            const precioTexto = producto.tipo === 'granel' 
                ? `$ ${producto.precio.toLocaleString('es-CL')} / litro` 
                : `$ ${producto.precio.toLocaleString('es-CL')}`;
            const stockTexto = producto.stock !== null ? `<span class="badge bg-success">Stock: ${producto.stock}</span>` : '<span class="badge bg-secondary">Consultar stock</span>';

            container.innerHTML += `
                <div class="col-12 col-sm-6 col-lg-4 col-xl-3" data-tipo="${producto.tipo}" data-peso="${producto.peso || ''}">
                    <div class="card h-100 shadow-sm custom-card">
                        <div class="position-relative">
                            <img src="${producto.img}" class="card-img-top p-3" alt="${producto.nombre}" style="height: 200px; object-fit: contain;">
                            ${badgeTipo}
                        </div>
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${producto.nombre}</h5>
                            <p class="card-text text-muted small flex-grow-1">${producto.desc}</p>
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <small class="text-muted">Código: ${producto.id}</small>
                                ${stockTexto}
                            </div>
                            <p class="fs-5 fw-bold text-success mb-3">${precioTexto}</p>
                            ${producto.tipo === 'granel' 
                                ? `<button class="btn btn-outline-warning w-100 fw-bold" onclick="solicitarCotizacionGranel('${producto.id}')">Solicitar Cotización</button>`
                                : `<button class="btn btn-warning w-100 fw-bold" onclick="agregarAlCarrito('${producto.id}')">Añadir al carrito</button>`
                            }
                        </div>
                    </div>
                </div>
            `;
        });
    }

    function getBadgeTipo(tipo) {
        const badges = {
            'cilindro': '<span class="position-absolute top-0 start-0 m-2 badge bg-primary">Cilindro</span>',
            'catalitico': '<span class="position-absolute top-0 start-0 m-2 badge bg-info text-dark">Catalítico</span>',
            'aluminio': '<span class="position-absolute top-0 start-0 m-2 badge bg-warning text-dark">Aluminio</span>',
            'granel': '<span class="position-absolute top-0 start-0 m-2 badge bg-danger">Granel</span>'
        };
        return badges[tipo] || '';
    }

    function filtrarYOrdenar() {
        let resultado = [...catalogoProductos];

        // Filtro por tipo
        const tipoSel = filtroTipo.value;
        if (tipoSel) {
            resultado = resultado.filter(p => p.tipo === tipoSel);
        }

        // Filtro por peso
        const pesoSel = filtroPeso.value;
        if (pesoSel) {
            resultado = resultado.filter(p => p.peso == pesoSel);
        }

        // Ordenamiento
        const ordenSel = filtroOrden.value;
        switch (ordenSel) {
            case 'precio-asc':
                resultado.sort((a, b) => a.precio - b.precio);
                break;
            case 'precio-desc':
                resultado.sort((a, b) => b.precio - a.precio);
                break;
            case 'peso-asc':
                resultado.sort((a, b) => (a.peso || 0) - (b.peso || 0));
                break;
            default:
                resultado.sort((a, b) => a.id.localeCompare(b.id));
        }

        renderizarProductos(resultado);
    }

    // Event listeners para filtros
    [filtroTipo, filtroPeso, filtroOrden].forEach(el => {
        el.addEventListener("change", filtrarYOrdenar);
    });

    // LÓGICA DEL CARRITO (compartida con main.js)
    window.agregarAlCarrito = function(id) {
        const productoSel = catalogoProductos.find(p => p.id === id);
        if (!productoSel) return;

        const existe = carritoActual.find(item => item.id === id);
        
        if (existe) {
            existe.cantidad++;
        } else {
            carritoActual.push({ ...productoSel, cantidad: 1 });
        }
        
        localStorage.setItem("carritoLaChispa", JSON.stringify(carritoActual));
        actualizarContadorCarrito();
        alert(`¡${productoSel.nombre} añadido al carrito!`);
    };

    window.solicitarCotizacionGranel = function(id) {
        const producto = catalogoProductos.find(p => p.id === id);
        if (!producto) return;
        
        const litros = prompt(`Solicitud de cotización: ${producto.nombre}\n\nIngrese cantidad de litros (mínimo 100):`);
        if (litros && parseInt(litros) >= 100) {
            const total = parseInt(litros) * producto.precio;
            alert(`Cotización generada:\n${litros} litros x $${producto.precio.toLocaleString('es-CL')}/litro\nTotal estimado: $${total.toLocaleString('es-CL')}\n\nNos contactaremos para confirmar entrega.`);
        } else if (litros !== null) {
            alert("El mínimo de carga es 100 litros.");
        }
    };

    function actualizarContadorCarrito() {
        const countElement = document.getElementById("cart-count");
        if (countElement) {
            const totalItems = carritoActual.reduce((acc, item) => acc + item.cantidad, 0);
            countElement.textContent = totalItems;
        }
    }

    // Renderizado inicial
    renderizarProductos(catalogoProductos);
});