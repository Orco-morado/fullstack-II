document.addEventListener("DOMContentLoaded", function() {

    const articulosBlog = [
        {
            id: 'seguridad-5-reglas',
            titulo: '5 Reglas de Oro para el Uso Seguro de Gas en Casa',
            categoria: 'Seguridad',
            fecha: '15 Sep 2026',
            tiempo: '3 min',
            imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJRQ6Nv_yCS37RUzZMViwHElJCfdDFFC90BPc0g_Edog&s=10',
            resumen: 'El gas licuado es seguro si se maneja correctamente. Te compartimos las 5 reglas fundamentales que toda familia debe conocer: ventilación, revisión de conexiones, detector de fugas, cierre de llave y qué hacer ante emergencias.',
            destacado: true
        },
        {
            id: 'ahorro-cilindro-ideal',
            titulo: '¿Qué Cilindro Elegir para Ahorrar en tu Hogar?',
            categoria: 'Ahorro',
            fecha: '08 Sep 2026',
            tiempo: '4 min',
            imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3yhfKiRlMS5LKhPyFcbW4Yi5tR997lJt8xglXm9CFiw&s=10',
            resumen: 'Comparamos el consumo promedio según el tamaño de tu familia y tipo de uso. Descubre si el de 11kg, 15kg o 45kg es el más conveniente para tu bolsillo.',
            destacado: false
        },
        {
            id: 'mantenimiento-revision-anual',
            titulo: 'Revisión Anual Obligatoria: Qué Revisa el Técnico',
            categoria: 'Mantenimiento',
            fecha: '01 Sep 2026',
            tiempo: '5 min',
            imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRCy_n2hs5Ea6SM_6z-hf18XYC_6biqbxJYTjBBgB3LA&s=10',
            resumen: 'La normativa exige revisión anual de instalaciones. Te explicamos paso a paso qué verifica el técnico certificado y qué documentos debes exigir al finalizar.',
            destacado: false
        },
        {
            id: 'normativa-nueva-reglamento',
            titulo: 'Nuevo Reglamento SEC 2026: Cambios que Afectan a Usuarios',
            categoria: 'Normativa',
            fecha: '25 Ago 2026',
            tiempo: '6 min',
            imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1uHGeEXlfTHDrT_VTpdKe08_5YWXQiDyLT2RQchm4OQ&s',
            resumen: 'La Superintendencia de Electricidad y Combustibles actualizó exigencias para distribuidoras y usuarios finales. Resumen de los cambios clave en certificaciones y plazos.',
            destacado: false
        },
        {
            id: 'empresa-15-anos',
            titulo: '15 Años de Gas La Chispa: Historia y Compromiso',
            categoria: 'Empresa',
            fecha: '10 Ago 2026',
            tiempo: '4 min',
            imagen: 'https://via.placeholder.com/400x250/ffc107/000?text=15+A%C3%B1os',
            resumen: 'Celebramos nuestro aniversario compartiendo la historia de cómo una empresa familiar se convirtió en la distribuidora de referencia en Ñuble. Entrevista a nuestro fundador.',
            destacado: false
        },
        {
            id: 'seguridad-detector-fugas',
            titulo: 'Detectores de Fugas: ¿Son Necesarios en Casa?',
            categoria: 'Seguridad',
            fecha: '03 Ago 2026',
            tiempo: '3 min',
            imagen: 'https://via.placeholder.com/400x250/dc3545/fff?text=Detector',
            resumen: 'Analizamos los tipos de detectores disponibles (fijos, portátiles, inteligentes), su instalación y por qué son una inversión que puede salvar vidas.',
            destacado: false
        },
        {
            id: 'ahorro-carga-granel-industria',
            titulo: 'Carga a Granel: La Opción Inteligente para Industrias',
            categoria: 'Ahorro',
            fecha: '20 Jul 2026',
            tiempo: '5 min',
            imagen: 'https://www.csc-trucks.com/uploads/201921798/10cbm-lp-gas-tank-truck56176327375.jpg',
            resumen: 'Para consumos superiores a 500 kg/mes, la carga a granel reduce costos hasta un 30%. Casos de éxito de clientes industriales en la región.',
            destacado: false
        },
        {
            id: 'mantenimiento-cambio-regulador',
            titulo: 'Cada Cuánto Cambiar el Regulador de Presión',
            categoria: 'Mantenimiento',
            fecha: '12 Jul 2026',
            tiempo: '3 min',
            imagen: 'https://via.placeholder.com/400x250/0d6efd/fff?text=Regulador',
            resumen: 'El regulador es el corazón de la instalación. Señales de desgaste, vida útil según fabricante y por qué no debes esperar a que falle para reemplazarlo.',
            destacado: false
        }
    ];

    const container = document.getElementById("blogs-container");

    function renderizarBlogs(lista) {
        container.innerHTML = "";
        
        lista.forEach(articulo => {
            if (articulo.destacado) return; // El destacado se muestra aparte
            
            container.innerHTML += `
                <div class="col-12 col-md-6 col-lg-4">
                    <article class="card h-100 shadow-sm border-0 overflow-hidden">
                        <img src="${articulo.imagen}" class="card-img-top" alt="${articulo.titulo}" style="height: 200px; object-fit: cover;">
                        <div class="card-body d-flex flex-column">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="badge bg-warning text-dark">${articulo.categoria}</span>
                                <small class="text-muted">${articulo.tiempo} lectura</small>
                            </div>
                            <h5 class="fw-bold card-title">${articulo.titulo}</h5>
                            <p class="card-text text-muted small flex-grow-1">${articulo.resumen}</p>
                            <div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                                <small class="text-muted">${articulo.fecha}</small>
                                <a href="blog-detalle.html?id=${articulo.id}" class="btn btn-sm btn-outline-warning fw-bold">Leer más</a>
                            </div>
                        </div>
                    </article>
                </div>
            `;
        });
    }

    // Filtrado por categoría desde URL
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get('cat');
    
    let listaFiltrada = articulosBlog;
    if (catParam) {
        listaFiltrada = articulosBlog.filter(a => a.categoria.toLowerCase() === catParam.toLowerCase());
    }

    renderizarBlogs(listaFiltrada);

    // Actualizar título si hay filtro
    if (catParam) {
        const tituloSeccion = document.querySelector('section h2');
        if (tituloSeccion) {
            tituloSeccion.textContent = `Artículos en: ${catParam.charAt(0).toUpperCase() + catParam.slice(1)}`;
        }
    }
});