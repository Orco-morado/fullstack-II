document.addEventListener("DOMContentLoaded", function() {

    //  GESTIÓN DEL CATÁLOGO DE PRODUCTOS (INDEX)
    const productosGas = [
        { id: 'CL001', nombre: 'Cilindro 5 kg', desc: 'Ideal para estufas pequeñas', precio: 6500, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoe4VQoRhPj4pnXVzeMl7dfOL_t0bSW9E7JPCUWHix0w&s=10' },
        { id: 'CL002', nombre: 'Cilindro 11 kg', desc: 'El clásico para hogar', precio: 12000, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3yhfKiRlMS5LKhPyFcbW4Yi5tR997lJt8xglXm9CFiw&s=10' },
        { id: 'CL003', nombre: 'Cilindro 15 kg', desc: 'Mayor duración', precio: 16000, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRCy_n2hs5Ea6SM_6z-hf18XYC_6biqbxJYTjBBgB3LA&s=10' },
        { id: 'CL004', nombre: 'Cilindro 45 kg', desc: 'El más grande', precio: 45000, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1uHGeEXlfTHDrT_VTpdKe08_5YWXQiDyLT2RQchm4OQ&s' },
        { id: 'GR001', nombre: 'Carga a granel', desc: 'Mínimo de 100 litros la carga', precio: 300, img: 'https://www.csc-trucks.com/uploads/201921798/10cbm-lp-gas-tank-truck56176327375.jpg' } // Asumiendo $300 por litro como base
    ];

    let carritoActual = JSON.parse(localStorage.getItem("carritoLaChispa")) || [];
    actualizarContadorCarrito();

    // Renderizar productos en el index.html
    const contenedorProductos = document.getElementById("home-products-container");
    if (contenedorProductos) {
        contenedorProductos.innerHTML = ""; // Limpia la maqueta estática del HTML
        
        productosGas.forEach(producto => {
            let botonAccion = `<button class="btn btn-warning w-100 fw-bold" onclick="agregarAlCarrito('${producto.id}')">Añadir al carrito</button>`;
            
            // Caso especial para la carga a granel
            if(producto.id === 'GR001'){
                 botonAccion = `<button class="btn btn-warning w-100 fw-bold" onclick="alert('Esta función de cálculo por litro se implementará pronto.')">Calcula x litro de gas</button>`;
            }

            contenedorProductos.innerHTML += `
                <div class="col-md-3">
                    <div class="card h-100 shadow-sm custom-card">
                        <img src="${producto.img}" class="card-img-top p-3" alt="${producto.nombre}">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${producto.nombre}</h5>
                            <p class="card-text text-muted small">${producto.desc}</p>
                            <p class="fs-5 fw-bold text-success mt-auto">$ ${producto.precio.toLocaleString('es-CL')}</p>
                            ${botonAccion}
                        </div>
                    </div>
                </div>
            `;
        });
    }

    // LÓGICA DEL CARRITO (LOCALSTORAGE)
  
    window.agregarAlCarrito = function(id) {
        const productoSel = productosGas.find(p => p.id === id);
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

    function actualizarContadorCarrito() {
        const countElement = document.getElementById("cart-count");
        if (countElement) {
            const totalItems = carritoActual.reduce((acc, item) => acc + item.cantidad, 0);
            countElement.textContent = totalItems;
        }
    }

    //  VALIDACIONES DEL FORMULARIO DE LOGIN
    const loginForm = document.getElementById("loginForm");
    
    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault(); 
            let isValid = true;
            
            const emailInput = document.getElementById("usuarioEmail");
            const passwordInput = document.getElementById("usuarioPassword");
            const emailError = document.getElementById("emailError");
            const passwordError = document.getElementById("passwordError");
            
            emailError.textContent = "";
            passwordError.textContent = "";
            
            const emailValue = emailInput.value.trim();
            const dominiosPermitidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
            
            if (emailValue === "") {
                emailError.textContent = "El correo es requerido.";
                isValid = false;
            } else if (emailValue.length > 100) {
                emailError.textContent = "El correo no puede exceder los 100 caracteres.";
                isValid = false;
            } else {
                const hasValidDomain = dominiosPermitidos.some(dominio => emailValue.endsWith(dominio));
                if (!hasValidDomain) {
                    emailError.textContent = "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.";
                    isValid = false;
                }
            }
            
            const passwordValue = passwordInput.value.trim();
            if (passwordValue === "") {
                passwordError.textContent = "La contraseña es requerida.";
                isValid = false;
            } else if (passwordValue.length < 4 || passwordValue.length > 10) {
                passwordError.textContent = "La contraseña debe tener entre 4 y 10 caracteres.";
                isValid = false;
            }
            
            if (isValid) {
                alert("Validación exitosa. Simulando inicio de sesión...");
            }
        });
    }
});