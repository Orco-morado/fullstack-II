package cl.gaslachispa.api.pedido;

import java.time.Instant;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import cl.gaslachispa.api.producto.PrecioService;
import cl.gaslachispa.api.producto.Producto;
import cl.gaslachispa.api.producto.ProductoRepository;
import cl.gaslachispa.api.usuario.Usuario;
import cl.gaslachispa.api.usuario.UsuarioRepository;

@Service
public class PedidoService {

    private static final Set<String> ESTADOS = Set.of("recibido", "asignado", "camino", "entregado");
    private static final Set<String> PAGOS = Set.of("efectivo", "transferencia");
    private static final Map<String, Set<String>> TRANSICIONES = Map.of(
            "recibido", Set.of("asignado"),
            "asignado", Set.of("camino"),
            "camino", Set.of("entregado"),
            "entregado", Set.of());

    private final PedidoRepository pedidoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;
    private final PrecioService precioService;

    public PedidoService(PedidoRepository pedidoRepository, UsuarioRepository usuarioRepository,
            ProductoRepository productoRepository, PrecioService precioService) {
        this.pedidoRepository = pedidoRepository;
        this.usuarioRepository = usuarioRepository;
        this.productoRepository = productoRepository;
        this.precioService = precioService;
    }

    public List<Pedido> listar(Authentication authentication) {
        Usuario actual = actual(authentication);
        return switch (actual.getRol()) {
            case "Administrador", "Operadora", "Vendedor" -> pedidoRepository.findAll();
            case "Repartidor" -> pedidoRepository.findByRepartidor(actual.getNombre());
            default -> pedidoRepository.findByClienteId(actual.getId());
        };
    }

    public Pedido obtener(String id, Authentication authentication) {
        Pedido pedido = find(id);
        Usuario actual = actual(authentication);
        if (puedeVer(pedido, actual)) {
            return pedido;
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes acceso a este pedido.");
    }

    public List<Pedido> porEstado(String estado, Authentication authentication) {
        return listar(authentication).stream()
                .filter(p -> estado.equals(p.getEstado()))
                .toList();
    }

    @Transactional
    public Pedido crear(Pedido data, Authentication authentication) {
        Usuario actual = actual(authentication);
        require(data.getCliente(), "El nombre del cliente es requerido.");
        require(data.getComuna(), "La comuna es requerida.");
        require(data.getDireccion(), "La dirección es requerida.");
        require(data.getProductoId(), "El producto es requerido.");
        if (data.getCantidad() == null || data.getCantidad() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La cantidad debe ser mayor a cero.");
        }

        Producto producto = productoRepository.findById(data.getProductoId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Producto no encontrado."));
        if (Boolean.FALSE.equals(producto.getActivo())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El producto no está disponible.");
        }
        int stock = producto.getStock() == null ? 0 : producto.getStock();
        if (stock < data.getCantidad()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Stock insuficiente para el producto.");
        }

        int precio = precioService.precioFinal(producto);
        data.setProducto(producto.getNombre());
        data.setTotal(precio * data.getCantidad());
        data.setPago(normalizarPago(data.getPago()));

        if (data.getId() == null || data.getId().isBlank()) {
            data.setId(nextId());
        } else if (pedidoRepository.existsById(data.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El pedido ya existe.");
        }

        if ("Cliente".equals(actual.getRol())) {
            data.setClienteId(actual.getId());
            data.setEstado("recibido");
            data.setRepartidor(null);
            data.setFecha(Instant.now().toString());
        } else {
            if (data.getEstado() == null || data.getEstado().isBlank()) {
                data.setEstado("recibido");
            }
            validarEstado(data.getEstado());
            if (data.getRepartidor() != null && !data.getRepartidor().isBlank()) {
                validarRepartidor(data.getRepartidor());
                if ("recibido".equals(data.getEstado())) {
                    data.setEstado("asignado");
                }
            } else {
                data.setRepartidor(null);
            }
            if ("asignado".equals(data.getEstado()) && data.getRepartidor() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Debes asignar un repartidor.");
            }
            if (data.getFecha() == null || data.getFecha().isBlank()) {
                data.setFecha(Instant.now().toString());
            }
        }

        producto.setStock(stock - data.getCantidad());
        productoRepository.save(producto);
        return pedidoRepository.save(data);
    }

    @Transactional
    public Pedido actualizar(String id, Pedido changes) {
        Pedido pedido = find(id);
        if (changes.getClienteId() != null) {
            pedido.setClienteId(changes.getClienteId());
        }
        if (changes.getCliente() != null) {
            pedido.setCliente(changes.getCliente());
        }
        if (changes.getFono() != null) {
            pedido.setFono(changes.getFono());
        }
        if (changes.getComuna() != null) {
            pedido.setComuna(changes.getComuna());
        }
        if (changes.getDireccion() != null) {
            pedido.setDireccion(changes.getDireccion());
        }
        if (changes.getPago() != null) {
            pedido.setPago(normalizarPago(changes.getPago()));
        }
        if (changes.getFecha() != null) {
            pedido.setFecha(changes.getFecha());
        }

        String nuevoRepartidor = pedido.getRepartidor();
        if (changes.getRepartidor() != null) {
            nuevoRepartidor = changes.getRepartidor().isBlank() ? null : changes.getRepartidor();
            if (nuevoRepartidor != null) {
                validarRepartidor(nuevoRepartidor);
            }
        }

        String nuevoEstado = changes.getEstado() == null ? pedido.getEstado() : changes.getEstado();
        if (changes.getEstado() != null) {
            validarEstado(nuevoEstado);
            validarTransicion(pedido.getEstado(), nuevoEstado);
        }
        if ("asignado".equals(nuevoEstado) && nuevoRepartidor == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Debes asignar un repartidor.");
        }
        if (nuevoRepartidor != null && "recibido".equals(nuevoEstado)) {
            nuevoEstado = "asignado";
        }

        pedido.setRepartidor(nuevoRepartidor);
        pedido.setEstado(nuevoEstado);
        return pedidoRepository.save(pedido);
    }

    public Pedido cambiarEstado(String id, String estado, Authentication authentication) {
        Pedido pedido = find(id);
        Usuario actual = actual(authentication);
        if ("Repartidor".equals(actual.getRol())) {
            if (!actual.getNombre().equals(pedido.getRepartidor())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Este pedido no está asignado a ti.");
            }
        } else if (!"Administrador".equals(actual.getRol()) && !"Operadora".equals(actual.getRol())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes permisos para cambiar el estado.");
        }
        validarEstado(estado);
        validarTransicion(pedido.getEstado(), estado);
        if ("asignado".equals(estado) && pedido.getRepartidor() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Debes asignar un repartidor.");
        }
        pedido.setEstado(estado);
        return pedidoRepository.save(pedido);
    }

    @Transactional
    public void eliminar(String id) {
        Pedido pedido = find(id);
        if (!"entregado".equals(pedido.getEstado())) {
            productoRepository.findById(pedido.getProductoId()).ifPresent(producto -> {
                int stock = producto.getStock() == null ? 0 : producto.getStock();
                producto.setStock(stock + pedido.getCantidad());
                productoRepository.save(producto);
            });
        }
        pedidoRepository.delete(pedido);
    }

    private Pedido find(String id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido no encontrado."));
    }

    private Usuario actual(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No hay una sesión activa.");
        }
        return usuarioRepository.findByEmailIgnoreCase(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sesión no válida."));
    }

    private boolean puedeVer(Pedido pedido, Usuario actual) {
        return switch (actual.getRol()) {
            case "Administrador", "Operadora", "Vendedor" -> true;
            case "Repartidor" -> actual.getNombre().equals(pedido.getRepartidor());
            default -> actual.getId().equals(pedido.getClienteId());
        };
    }

    private void validarEstado(String estado) {
        if (estado == null || !ESTADOS.contains(estado)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Estado inválido.");
        }
    }

    private void validarTransicion(String actual, String nuevo) {
        if (actual.equals(nuevo)) {
            return;
        }
        if (!TRANSICIONES.getOrDefault(actual, Set.of()).contains(nuevo)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Transición de estado inválida.");
        }
    }

    private void validarRepartidor(String nombre) {
        Usuario repartidor = usuarioRepository.findByNombreIgnoreCase(nombre)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Repartidor no encontrado."));
        if (!"Repartidor".equals(repartidor.getRol()) || !"activo".equalsIgnoreCase(repartidor.getEstado())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El repartidor no está disponible.");
        }
    }

    private String normalizarPago(String pago) {
        if (pago == null || pago.isBlank()) {
            return "efectivo";
        }
        String value = pago.trim().toLowerCase(Locale.ROOT);
        if (!PAGOS.contains(value)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Forma de pago inválida.");
        }
        return value;
    }

    private void require(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
    }

    private String nextId() {
        int max = pedidoRepository.findAll().stream()
                .map(Pedido::getId)
                .filter(id -> id != null && id.startsWith("GC-"))
                .map(id -> id.substring(3))
                .mapToInt(value -> {
                    try {
                        return Integer.parseInt(value);
                    } catch (NumberFormatException ex) {
                        return 0;
                    }
                })
                .max()
                .orElse(100000);
        return "GC-" + (max + 1);
    }
}
