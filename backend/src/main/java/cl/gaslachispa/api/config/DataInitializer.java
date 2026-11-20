package cl.gaslachispa.api.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import cl.gaslachispa.api.blog.Blog;
import cl.gaslachispa.api.blog.BlogRepository;
import cl.gaslachispa.api.categoria.Categoria;
import cl.gaslachispa.api.categoria.CategoriaRepository;
import cl.gaslachispa.api.oferta.Oferta;
import cl.gaslachispa.api.oferta.OfertaRepository;
import cl.gaslachispa.api.pedido.Pedido;
import cl.gaslachispa.api.pedido.PedidoRepository;
import cl.gaslachispa.api.producto.Producto;
import cl.gaslachispa.api.producto.ProductoRepository;
import cl.gaslachispa.api.usuario.Usuario;
import cl.gaslachispa.api.usuario.UsuarioRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedData(UsuarioRepository usuarios, CategoriaRepository categorias,
            ProductoRepository productos, PedidoRepository pedidos,
            OfertaRepository ofertas, BlogRepository blogs, PasswordEncoder passwordEncoder) {
        return args -> {
            if (usuarios.count() == 0) {
                usuarios.saveAll(List.of(
                        usuario("U-001", "12345678-9", "Ana García", "admin@gmail.com", "admin123",
                                "+56 9 1111 1111", "Administrador", "activo", "Chillan", "",
                                "2026-01-10T09:00:00Z", passwordEncoder),
                        usuario("U-002", "23456789-0", "María López", "operadora@gmail.com", "oper1234",
                                "+56 9 2222 2222", "Operadora", "activo", "Chillan", "",
                                "2026-01-12T09:00:00Z", passwordEncoder),
                        usuario("U-003", "34567890-1", "Carlos Rojas", "repartidor@gmail.com", "repart123",
                                "+56 9 3333 3333", "Repartidor", "activo", "Chillan", "Los Alerces 123",
                                "2026-01-15T09:00:00Z", passwordEncoder),
                        usuario("U-004", "45678901-2", "Pedro Muñoz", "cliente@gmail.com", "cliente123",
                                "+56 9 4444 4444", "Cliente", "activo", "ChillanViejo", "Independencia 987",
                                "2026-02-01T09:00:00Z", passwordEncoder),
                        usuario("U-005", "56789012-3", "Lucía Herrera", "lucia@gmail.com", "lucia1234",
                                "+56 9 5555 5555", "Cliente", "inactivo", "Chillan", "San Martín 321",
                                "2026-02-10T09:00:00Z", passwordEncoder),
                        usuario("U-006", "67890123-4", "Valentina Soto", "vendedor@gmail.com", "vendedor1",
                                "+56 9 6666 6666", "Vendedor", "activo", "Chillan", "",
                                "2026-02-15T09:00:00Z", passwordEncoder)));
            }

            if (categorias.count() == 0) {
                categorias.saveAll(List.of(
                        categoria("CAT-01", "Normal", "Cilindros estándar para hogar", true),
                        categoria("CAT-02", "Industrial", "Cilindros de gran capacidad para comercios", true),
                        categoria("CAT-03", "Catalítico", "Tecnología de combustión limpia", true),
                        categoria("CAT-04", "Aluminio", "Cilindros ligeros de aluminio", true),
                        categoria("CAT-05", "Granel", "Gas a granel por litro", true)));
            }

            if (productos.count() == 0) {
                productos.saveAll(List.of(
                        producto("VOL-005", "Cilindro Normal 5 kg", "Normal", 5, 11500, 120,
                                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoe4VQoRhPj4pnXVzeMl7dfOL_t0bSW9E7JPCUWHix0w&s=10",
                                "Ideal para estufas pequeñas y uso doméstico básico", true),
                        producto("VOL-011", "Cilindro Normal 11 kg", "Normal", 11, 20000, 85,
                                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3yhfKiRlMS5LKhPyFcbW4Yi5tR997lJt8xglXm9CFiw&s=10",
                                "El clásico para hogar, uso estándar familiar", true),
                        producto("VOL-015", "Cilindro Normal 15 kg", "Normal", 15, 27000, 35,
                                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRCy_n2hs5Ea6SM_6z-hf18XYC_6biqbxJYTjBBgB3LA&s=10",
                                "Mayor duración, ideal para familias grandes", true),
                        producto("VOL-045", "Cilindro Normal 45 kg", "Industrial", 45, 60000, 8,
                                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1uHGeEXlfTHDrT_VTpdKe08_5YWXQiDyLT2RQchm4OQ&s",
                                "El más grande, para uso comercial e industrial", true),
                        producto("VOL-CAT", "Cilindro Catalítico 11 kg", "Catalítico", 11, 22000, 40,
                                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3yhfKiRlMS5LKhPyFcbW4Yi5tR997lJt8xglXm9CFiw&s=10",
                                "Tecnología catalítica para mayor eficiencia y seguridad", true),
                        producto("VOL-ALU", "Cilindro Aluminio 15 kg", "Aluminio", 15, 35000, 28,
                                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRCy_n2hs5Ea6SM_6z-hf18XYC_6biqbxJYTjBBgB3LA&s=10",
                                "Ligero y resistente, ideal para transporte frecuente", true),
                        producto("GR-100", "Carga a Granel (desde 100 litros)", "Granel", null, 500, 9999,
                                "https://www.csc-trucks.com/uploads/201921798/10cbm-lp-gas-tank-truck56176327375.jpg",
                                "Entrega a granel para industrias. Precio por litro. Mínimo 100 litros.", true)));
            }

            if (pedidos.count() == 0) {
                pedidos.saveAll(List.of(
                        pedido("GC-100001", "U-004", "Pedro Muñoz", "+56 9 4444 4444", "Chillan",
                                "Av. Argentina 123", "VOL-011", "Cilindro Normal 11 kg", 1, 20000,
                                "entregado", "Carlos Rojas", "efectivo", "2026-10-07T10:00:00Z"),
                        pedido("GC-100002", "U-004", "Pedro Muñoz", "+56 9 4444 4444", "Chillan",
                                "O'Higgins 456", "VOL-015", "Cilindro Normal 15 kg", 2, 54000,
                                "camino", "Carlos Rojas", "efectivo", "2026-10-08T08:30:00Z"),
                        pedido("GC-100003", "U-005", "Lucía Herrera", "+56 9 5555 5555", "ChillanViejo",
                                "Pedro Aguirre Cerda 789", "VOL-005", "Cilindro Normal 5 kg", 1, 11500,
                                "recibido", null, "transferencia", "2026-10-08T09:15:00Z"),
                        pedido("GC-100004", "U-004", "Pedro Muñoz", "+56 9 4444 4444", "Chillan",
                                "San Martín 321", "VOL-045", "Cilindro Normal 45 kg", 1, 60000,
                                "asignado", "Carlos Rojas", "efectivo", "2026-10-08T09:45:00Z")));
            }

            if (ofertas.count() == 0) {
                ofertas.saveAll(List.of(
                        oferta("OF-01", "2x1 en Cilindros de 5 kg",
                                "Lleva dos cilindros de 5 kg y paga solo uno. Válido solo los lunes.",
                                "VOL-005", 50, true,
                                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoe4VQoRhPj4pnXVzeMl7dfOL_t0bSW9E7JPCUWHix0w&s=10",
                                "2026-10-31"),
                        oferta("OF-02", "15% dcto. en Cilindro 15 kg",
                                "Descuento especial para hogares con mayor consumo.",
                                "VOL-015", 15, true,
                                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRCy_n2hs5Ea6SM_6z-hf18XYC_6biqbxJYTjBBgB3LA&s=10",
                                "2026-11-15"),
                        oferta("OF-03", "Envío gratis en primera compra",
                                "Para clientes nuevos de Chillán y Chillán Viejo.",
                                null, 100, true,
                                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJRQ6Nv_yCS37RUzZMViwHElJCfdDFFC90BPc0g_Edog&s=10",
                                "2026-12-31")));
            }

            if (blogs.count() == 0) {
                blogs.saveAll(List.of(
                        blog("BLOG-01", "5 Reglas de Oro para el Uso Seguro de Gas en Casa", "Seguridad",
                                "2026-09-15",
                                "Ventilación, revisión de conexiones, detector de fugas, cierre de llave y plan de emergencia.",
                                "El gas licuado es seguro si se maneja correctamente. Ventila siempre, revisa conexiones anualmente, instala un detector de fugas, cierra la llave de paso al terminar y ten un plan de emergencia: llama a Bomberos al 132 desde fuera del ambiente.",
                                "Ana García", true),
                        blog("BLOG-02", "¿Qué Cilindro Elegir para Ahorrar en tu Hogar?", "Ahorro",
                                "2026-09-08",
                                "Comparamos consumo según tamaño de familia y tipo de uso.",
                                "1-2 personas: 5 kg. 3-4 personas: 11 kg. 5-6 personas: 15 kg. 7+ o uso intenso: 45 kg. Si cocinas a diario con horno a gas, sube un tamaño.",
                                "María López", true),
                        blog("BLOG-03", "Revisión Anual Obligatoria: Qué Revisa el Técnico", "Mantenimiento",
                                "2026-09-01",
                                "La normativa exige revisión anual de instalaciones.",
                                "El técnico verifica mangueras, prueba de hermeticidad, presión del regulador, ventilación, llaves de paso y emite certificado de conformidad. Guárdalo por 3 años.",
                                "Ana García", true),
                        blog("BLOG-04", "15 Años de Gas La Chispa: Historia y Compromiso", "Empresa",
                                "2026-08-10",
                                "De un camión a la distribuidora de referencia de Ñuble.",
                                "Desde 2009 con un solo camión hasta flota propia y seguimiento en tiempo real. El compromiso sigue igual: llegar a tiempo, entregar seguro y tratar con respeto.",
                                "Ana García", true)));
            }
        };
    }

    private static Usuario usuario(String id, String run, String nombre, String email, String password,
            String telefono, String rol, String estado, String comuna, String direccion, String creadoEn,
            PasswordEncoder encoder) {
        Usuario usuario = new Usuario();
        usuario.setId(id);
        usuario.setRun(run);
        usuario.setNombre(nombre);
        usuario.setEmail(email);
        usuario.setPassword(encoder.encode(password));
        usuario.setTelefono(telefono);
        usuario.setRol(rol);
        usuario.setEstado(estado);
        usuario.setComuna(comuna);
        usuario.setDireccion(direccion);
        usuario.setCreadoEn(creadoEn);
        return usuario;
    }

    private static Categoria categoria(String id, String nombre, String descripcion, boolean activo) {
        Categoria categoria = new Categoria();
        categoria.setId(id);
        categoria.setNombre(nombre);
        categoria.setDescripcion(descripcion);
        categoria.setActivo(activo);
        return categoria;
    }

    private static Producto producto(String id, String nombre, String categoria, Integer peso, Integer precio,
            Integer stock, String imagen, String descripcion, boolean activo) {
        Producto producto = new Producto();
        producto.setId(id);
        producto.setNombre(nombre);
        producto.setCategoria(categoria);
        producto.setPeso(peso);
        producto.setPrecio(precio);
        producto.setStock(stock);
        producto.setImagen(imagen);
        producto.setDescripcion(descripcion);
        producto.setActivo(activo);
        return producto;
    }

    private static Pedido pedido(String id, String clienteId, String cliente, String fono, String comuna,
            String direccion, String productoId, String producto, int cantidad, int total, String estado,
            String repartidor, String pago, String fecha) {
        Pedido pedido = new Pedido();
        pedido.setId(id);
        pedido.setClienteId(clienteId);
        pedido.setCliente(cliente);
        pedido.setFono(fono);
        pedido.setComuna(comuna);
        pedido.setDireccion(direccion);
        pedido.setProductoId(productoId);
        pedido.setProducto(producto);
        pedido.setCantidad(cantidad);
        pedido.setTotal(total);
        pedido.setEstado(estado);
        pedido.setRepartidor(repartidor);
        pedido.setPago(pago);
        pedido.setFecha(fecha);
        return pedido;
    }

    private static Oferta oferta(String id, String titulo, String descripcion, String productoId, int descuento,
            boolean activo, String imagen, String vigencia) {
        Oferta oferta = new Oferta();
        oferta.setId(id);
        oferta.setTitulo(titulo);
        oferta.setDescripcion(descripcion);
        oferta.setProductoId(productoId);
        oferta.setDescuento(descuento);
        oferta.setActivo(activo);
        oferta.setImagen(imagen);
        oferta.setVigencia(vigencia);
        return oferta;
    }

    private static Blog blog(String id, String titulo, String categoria, String fecha, String resumen,
            String contenido, String autor, boolean activo) {
        Blog blog = new Blog();
        blog.setId(id);
        blog.setTitulo(titulo);
        blog.setCategoria(categoria);
        blog.setFecha(fecha);
        blog.setResumen(resumen);
        blog.setContenido(contenido);
        blog.setAutor(autor);
        blog.setActivo(activo);
        return blog;
    }
}
