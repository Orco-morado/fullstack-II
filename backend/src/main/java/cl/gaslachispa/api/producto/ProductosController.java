package cl.gaslachispa.api.producto;

import java.util.List;
import java.util.Locale;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/v1/productos")
public class ProductosController {

    private final ProductoRepository productoRepository;

    public ProductosController(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @GetMapping
    public List<Producto> listar(@RequestParam(required = false) String categoria,
            @RequestParam(required = false) String buscar) {
        List<Producto> productos = categoria != null && !categoria.isBlank()
                ? productoRepository.findByCategoria(categoria)
                : productoRepository.findAll();

        if (buscar != null && !buscar.isBlank()) {
            String q = buscar.trim().toLowerCase(Locale.ROOT);
            productos = productos.stream()
                    .filter(p -> contiene(p.getNombre(), q) || contiene(p.getDescripcion(), q)
                            || contiene(p.getId(), q))
                    .toList();
        }
        return productos;
    }

    @GetMapping("/{id}")
    public Producto obtener(@PathVariable String id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado."));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('Administrador', 'Operadora')")
    @SecurityRequirement(name = "bearerAuth")
    public Producto crear(@RequestBody Producto producto) {
        if (producto.getNombre() == null || producto.getNombre().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre del producto es requerido.");
        }
        if (producto.getId() == null || producto.getId().isBlank()) {
            producto.setId(nextId());
        }
        if (productoRepository.existsById(producto.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El producto ya existe.");
        }
        if (producto.getCategoria() == null || producto.getCategoria().isBlank()) {
            producto.setCategoria("Normal");
        }
        if (producto.getPrecio() == null) {
            producto.setPrecio(0);
        }
        if (producto.getStock() == null) {
            producto.setStock(0);
        }
        if (producto.getActivo() == null) {
            producto.setActivo(true);
        }
        return productoRepository.save(producto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('Administrador', 'Operadora')")
    @SecurityRequirement(name = "bearerAuth")
    public Producto actualizar(@PathVariable String id, @RequestBody Producto changes) {
        Producto producto = obtener(id);
        if (changes.getNombre() != null) {
            producto.setNombre(changes.getNombre());
        }
        if (changes.getCategoria() != null) {
            producto.setCategoria(changes.getCategoria());
        }
        producto.setPeso(changes.getPeso());
        if (changes.getPrecio() != null) {
            producto.setPrecio(changes.getPrecio());
        }
        if (changes.getStock() != null) {
            producto.setStock(changes.getStock());
        }
        if (changes.getImagen() != null) {
            producto.setImagen(changes.getImagen());
        }
        if (changes.getDescripcion() != null) {
            producto.setDescripcion(changes.getDescripcion());
        }
        if (changes.getActivo() != null) {
            producto.setActivo(changes.getActivo());
        }
        return productoRepository.save(producto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyRole('Administrador', 'Operadora')")
    @SecurityRequirement(name = "bearerAuth")
    public void eliminar(@PathVariable String id) {
        if (!productoRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado.");
        }
        productoRepository.deleteById(id);
    }

    private boolean contiene(String value, String q) {
        return value != null && value.toLowerCase(Locale.ROOT).contains(q);
    }

    private String nextId() {
        int max = productoRepository.findAll().stream()
                .map(Producto::getId)
                .filter(id -> id != null && id.startsWith("VOL-"))
                .map(id -> id.substring(4))
                .mapToInt(value -> {
                    try {
                        return Integer.parseInt(value);
                    } catch (NumberFormatException ex) {
                        return 0;
                    }
                })
                .max()
                .orElse(0);
        return String.format(Locale.ROOT, "VOL-%03d", max + 1);
    }
}
