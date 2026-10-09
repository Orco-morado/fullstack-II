document.addEventListener("DOMContentLoaded", function() {

    const articulosBlog = [
        {
            id: 'seguridad-5-reglas',
            titulo: '5 Reglas de Oro para el Uso Seguro de Gas en Casa',
            categoria: 'Seguridad',
            fecha: '15 Sep 2026',
            tiempo: '3 min',
            imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJRQ6Nv_yCS37RUzZMViwHElJCfdDFFC90BPc0g_Edog&s=10',
            resumen: 'El gas licuado es seguro si se maneja correctamente. Te compartimos las 5 reglas fundamentales que toda familia debe conocer.',
            contenido: `
                <p>El gas licuado de petróleo (GLP) es una energía segura y eficiente, siempre que se respeten las normas básicas de uso. Estas son las 5 reglas que toda familia debe conocer:</p>
                <h4 class="fw-bold mt-4">1. Ventilación permanente</h4>
                <p>Nunca cierres por completo las ventanas donde hay artefactos a gas. La combustión consume oxígeno y, en espacios cerrados, puede generar monóxido de carbono. Una ventana entreabierta es suficiente.</p>
                <h4 class="fw-bold mt-4">2. Revisión anual de conexiones</h4>
                <p>Todos los años, un técnico certificado debe revisar la instalación completa: mangueras, regulador, llave de paso y conexiones. La normativa chilena lo exige por ley.</p>
                <h4 class="fw-bold mt-4">3. Detector de fugas</h4>
                <p>Instala un detector de gas en la cocina y cerca del cilindro. Detectan fugas invisibles y suenan una alarma antes de que sea peligroso. Cuestan menos que una cena familiar.</p>
                <h4 class="fw-bold mt-4">4. Cierre total de llave de paso</h4>
                <p>Al terminar de cocinar o si vas a salir de casa, cierra la llave de paso del cilindro. Es un hábito de 5 segundos que previene accidentes graves.</p>
                <h4 class="fw-bold mt-4">5. Plan de emergencia</h4>
                <p>Si hueles gas: no enciendas ni apagues luces, no uses el teléfono dentro del ambiente, abre todas las ventanas, cierra la llave de paso y sal. Llama a Bomberos desde afuera: <strong>132</strong>.</p>
                <div class="alert alert-warning mt-4">
                    <strong>Recuerda:</strong> Gas La Chispa ofrece revisión gratuita de instalaciones para clientes activos. <a href="contacto.html" class="fw-bold">Contáctanos</a>.
                </div>
            `
        },
        {
            id: 'ahorro-cilindro-ideal',
            titulo: '¿Qué Cilindro Elegir para Ahorrar en tu Hogar?',
            categoria: 'Ahorro',
            fecha: '08 Sep 2026',
            tiempo: '4 min',
            imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3yhfKiRlMS5LKhPyFcbW4Yi5tR997lJt8xglXm9CFiw&s=10',
            resumen: 'Comparamos el consumo promedio según el tamaño de tu familia y tipo de uso.',
            contenido: `
                <p>Elegir el cilindro correcto impacta directamente en tu bolsillo. Un cilindro mal dimensionado significa más viajes de reposición o desperdicio de gas.</p>
                <div class="table-responsive">
                    <table class="table table-bordered table-striped">
                        <thead class="table-dark">
                            <tr><th>Familia</th><th>Cilindro ideal</th><th>Duración aprox.</th></tr>
                        </thead>
                        <tbody>
                            <tr><td>1-2 personas</td><td>5 kg</td><td>2-3 semanas</td></tr>
                            <tr><td>3-4 personas</td><td>11 kg</td><td>3-4 semanas</td></tr>
                            <tr><td>5-6 personas</td><td>15 kg</td><td>4-5 semanas</td></tr>
                            <tr><td>7+ / Uso intenso</td><td>45 kg</td><td>6-8 semanas</td></tr>
                        </tbody>
                    </table>
                </div>
                <p><strong>Tip:</strong> Si cocinas con gas todos los días y tienes horno a gas, sube un tamaño. Es mejor tener gas de sobra que quedarte sin él un domingo.</p>
            `
        },
        {
            id: 'mantenimiento-revision-anual',
            titulo: 'Revisión Anual Obligatoria: Qué Revisa el Técnico',
            categoria: 'Mantenimiento',
            fecha: '01 Sep 2026',
            tiempo: '5 min',
            imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRCy_n2hs5Ea6SM_6z-hf18XYC_6biqbxJYTjBBgB3LA&s=10',
            resumen: 'La normativa exige revisión anual de instalaciones. Te explicamos paso a paso qué verifica el técnico certificado.',
            contenido: `
                <p>La revisión anual no es opcional: está normada por la <strong>SEC</strong> y la <strong>NCh 342</strong>. Aquí qué implica:</p>
                <ol class="list-group list-group-numbered list-group-flush mb-3">
                    <li class="list-group-item">Inspección visual de mangueras (busca grietas, ablandamiento, marcas de quemadura)</li>
                    <li class="list-group-item">Prueba de hermeticidad con solución jabonosa o detector electrónico</li>
                    <li class="list-group-item">Verificación de presión del regulador</li>
                    <li class="list-group-item">Revisión de la campana extractora y ventilación</li>
                    <li class="list-group-item">Comprobación de llaves de paso y corte automático</li>
                    <li class="list-group-item">Emisión de certificado de conformidad</li>
                </ol>
                <p>El certificado debe estar disponible en caso de inspección de bomberos o Seremi de Salud. Guárdalo por al menos 3 años.</p>
            `
        },
        {
            id: 'normativa-nueva-reglamento',
            titulo: 'Nuevo Reglamento SEC 2026: Cambios que Afectan a Usuarios',
            categoria: 'Normativa',
            fecha: '25 Ago 2026',
            tiempo: '6 min',
            imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1uHGeEXlfTHDrT_VTpdKe08_5YWXQiDyLT2RQchm4OQ&s',
            resumen: 'La SEC actualizó exigencias para distribuidoras y usuarios finales.',
            contenido: `
                <p>Los principales cambios del reglamento actualizado:</p>
                <ul class="list-group list-group-flush mb-3">
                    <li class="list-group-item"><strong>Certificación de instalaciones:</strong> Ahora obligatoria antes de la primera conexión, no solo después.</li>
                    <li class="list-group-item"><strong>Plazo de respuesta:</strong> Las distribuidoras deben atender emergencias en máximo 2 horas.</li>
                    <li class="list-group-item"><strong>Cilindros certificados:</strong> Solo se pueden rellenar cilindros con sello de seguridad vigente.</li>
                    <li class="list-group-item"><strong>Detección de fugas:</strong> Recomendado (con planes futuros de obligatoriedad) para edificios y multi-domicilios.</li>
                </ul>
            `
        },
        {
            id: 'empresa-15-anos',
            titulo: '15 Años de Gas La Chispa: Historia y Compromiso',
            categoria: 'Empresa',
            fecha: '10 Ago 2026',
            tiempo: '4 min',
            imagen: 'https://via.placeholder.com/400x250/ffc107/000?text=15+A%C3%B1os',
            resumen: 'Celebramos nuestro aniversario compartiendo la historia de la empresa.',
            contenido: `
                <p>En 2009, comenzamos con un solo camión y la convicción de que el servicio al cliente podía ser mejor. Hoy contamos con flota propia, sistema de seguimiento en tiempo real y más de 5.000 clientes activos en la Región de Ñuble.</p>
                <p>Nuestro compromiso sigue siendo el mismo: <strong>llegar a tiempo, entregar seguro y tratar con respeto.</strong></p>
            `
        },
        {
            id: 'seguridad-detector-fugas',
            titulo: 'Detectores de Fugas: ¿Son Necesarios en Casa?',
            categoria: 'Seguridad',
            fecha: '03 Ago 2026',
            tiempo: '3 min',
            imagen: 'https://via.placeholder.com/400x250/dc3545/fff?text=Detector',
            resumen: 'Analizamos los tipos de detectores disponibles y por qué son una inversión que puede salvar vidas.',
            contenido: `
                <p>Sí, son necesarios. Un detector de gas cuesta entre $15.000 y $40.000 y detecta fugas que el olfato humano no percibe a tiempo.</p>
                <p><strong>Tipos:</strong> fijos en pared (los más confiables), portátiles (para llevar al camping o terraza) e inteligentes (se conectan al celular y te avisan por notificación).</p>
            `
        },
        {
            id: 'ahorro-carga-granel-industria',
            titulo: 'Carga a Granel: La Opción Inteligente para Industrias',
            categoria: 'Ahorro',
            fecha: '20 Jul 2026',
            tiempo: '5 min',
            imagen: 'https://www.csc-trucks.com/uploads/201921798/10cbm-lp-gas-tank-truck56176327375.jpg',
            resumen: 'Para consumos superiores a 500 kg/mes, la carga a granel reduce costos hasta un 30%.',
            contenido: `
                <p>Si tu negocio consume más de 500 kg de gas al mes (restaurantes, fabricas, invernaderos), la carga a granel es la alternativa más económica.</p>
                <p><strong>Ventajas:</strong> precio por litro más bajo, entrega programada según consumo, sin manejo de cilindros y facturación simplificada.</p>
            `
        },
        {
            id: 'mantenimiento-cambio-regulador',
            titulo: 'Cada Cuánto Cambiar el Regulador de Presión',
            categoria: 'Mantenimiento',
            fecha: '12 Jul 2026',
            tiempo: '3 min',
            imagen: 'https://via.placeholder.com/400x250/0d6efd/fff?text=Regulador',
            resumen: 'Señales de desgaste y vida útil del regulador de presión.',
            contenido: `
                <p>El regulador tiene una vida útil promedio de <strong>5 a 7 años</strong>. Señales de que necesita reemplazo:</p>
                <ul>
                    <li>Llama de la estufa demasiado alta o anaranjada</li>
                    <li>Chasquidos en el quemador</li>
                    <li>Olido a gas cerca del regulador</li>
                    <li>El regulador se siente frío al tacto en uso normal</li>
                </ul>
                <p>No esperes a que falle: un regulador defectuoso es la causa número 1 de fugas en el hogar.</p>
            `
        }
    ];

    const params = new URLSearchParams(window.location.search);
    const idArticulo = params.get('id');
    const contenedor = document.getElementById('articulo-container');
    const breadcrumb = document.getElementById('breadcrumb-titulo');

    const articulo = articulosBlog.find(a => a.id === idArticulo);

    if (!articulo) {
        contenedor.innerHTML = `
            <div class="alert alert-warning text-center">
                <h3>Artículo no encontrado</h3>
                <p>El artículo que buscas no existe o fue movido.</p>
                <a href="blogs.html" class="btn btn-warning fw-bold">Volver al blog</a>
            </div>
        `;
        return;
    }

    breadcrumb.textContent = articulo.titulo;

    contenedor.innerHTML = `
        <header class="mb-4">
            <span class="badge bg-warning text-dark mb-2">${articulo.categoria}</span>
            <h1 class="fw-bold">${articulo.titulo}</h1>
            <p class="text-muted">Publicado el ${articulo.fecha} · ${articulo.tiempo} de lectura</p>
        </header>
        <img src="${articulo.imagen}" class="img-fluid rounded shadow-sm w-100 mb-4" style="max-height: 400px; object-fit: cover;" alt="${articulo.titulo}">
        <div class="fs-5" style="line-height: 1.8;">
            ${articulo.contenido}
        </div>
        <hr class="my-5">
        <div class="d-flex justify-content-between">
            <a href="blogs.html" class="btn btn-outline-dark">← Volver al blog</a>
            <a href="contacto.html" class="btn btn-warning fw-bold">¿Dudas? Contáctanos</a>
        </div>
    `;

    // Artículos relacionados (misma categoría, excluyendo el actual)
    const relacionados = articulosBlog.filter(a => a.categoria === articulo.categoria && a.id !== articulo.id).slice(0, 3);

    if (relacionados.length > 0) {
        const seccionRel = document.getElementById('relacionados-section');
        const containerRel = document.getElementById('relacionados-container');
        seccionRel.style.display = 'block';

        relacionados.forEach(rel => {
            containerRel.innerHTML += `
                <div class="col-12 col-md-4">
                    <div class="card h-100 shadow-sm border-0">
                        <img src="${rel.imagen}" class="card-img-top" alt="${rel.titulo}" style="height: 150px; object-fit: cover;">
                        <div class="card-body">
                            <span class="badge bg-warning text-dark">${rel.categoria}</span>
                            <h6 class="fw-bold mt-2">${rel.titulo}</h6>
                            <a href="blog-detalle.html?id=${rel.id}" class="btn btn-sm btn-outline-warning mt-2">Leer</a>
                        </div>
                    </div>
                </div>
            `;
        });
    }
});