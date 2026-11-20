package cl.gaslachispa.api.pedido;

import java.time.Instant;
import java.util.List;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import cl.gaslachispa.api.usuario.Usuario;
import cl.gaslachispa.api.usuario.UsuarioRepository;

@Service
public class PedidoService {

    private static final Set<String> ESTADOS = Set.of("recibido", "asignado", "camino", "entregado");

    private final PedidoRepository pedidoRepository;
    private final UsuarioRepository usuarioRepository;

    public PedidoService(PedidoRepository pedidoRepository, UsuarioRepository usuarioRepository) {
        this.pedidoRepository = pedidoRepository;
        this.usuarioRepository = usuarioRepository;
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

    public Pedido crear(Pedido data, Authentication authentication) {
        Usuario actual = actual(authentication);
        require(data.getCliente(), "El nombre del cliente es requerido.");
        require(data.getComuna(), "La comuna es requerida.");
        require(data.getDireccion(), "La dirección es requerida.");
        require(data.getProductoId(), "El producto es requerido.");
        require(data.getProducto(), "El nombre del producto es requerido.");
        if (data.getCantidad() == null || data.getCantidad() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La cantidad debe ser mayor a cero.");
        }
        if (data.getTotal() == null || data.getTotal() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El total no es válido.");
        }

        if (data.getId() == null || data.getId().isBlank()) {
            data.setId(nextId());
        } else if (pedidoRepository.existsById(data.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El pedido ya existe.");
        }

        if ("Cliente".equals(actual.getRol())) {
            data.setClienteId(actual.getId());
        }
        if (data.getEstado() == null || data.getEstado().isBlank()) {
            data.setEstado("recibido");
        }
        validarEstado(data.getEstado());
        if (data.getPago() == null || data.getPago().isBlank()) {
            data.setPago("efectivo");
        }
        if (data.getFecha() == null || data.getFecha().isBlank()) {
            data.setFecha(Instant.now().toString());
        }
        if (data.getRepartidor() != null && data.getRepartidor().isBlank()) {
            data.setRepartidor(null);
        }
        return pedidoRepository.save(data);
    }

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
        if (changes.getProductoId() != null) {
            pedido.setProductoId(changes.getProductoId());
        }
        if (changes.getProducto() != null) {
            pedido.setProducto(changes.getProducto());
        }
        if (changes.getCantidad() != null) {
            pedido.setCantidad(changes.getCantidad());
        }
        if (changes.getTotal() != null) {
            pedido.setTotal(changes.getTotal());
        }
        if (changes.getEstado() != null) {
            validarEstado(changes.getEstado());
            pedido.setEstado(changes.getEstado());
        }
        if (changes.getRepartidor() != null) {
            pedido.setRepartidor(changes.getRepartidor().isBlank() ? null : changes.getRepartidor());
        }
        if (changes.getPago() != null) {
            pedido.setPago(changes.getPago());
        }
        if (changes.getFecha() != null) {
            pedido.setFecha(changes.getFecha());
        }
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
        pedido.setEstado(estado);
        return pedidoRepository.save(pedido);
    }

    public void eliminar(String id) {
        if (!pedidoRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido no encontrado.");
        }
        pedidoRepository.deleteById(id);
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
