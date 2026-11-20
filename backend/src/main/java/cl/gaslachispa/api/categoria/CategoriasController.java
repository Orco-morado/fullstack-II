package cl.gaslachispa.api.categoria;

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
@RequestMapping("/api/v1/categorias")
public class CategoriasController {

    private final CategoriaRepository categoriaRepository;

    public CategoriasController(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    @GetMapping
    public List<Categoria> listar(@RequestParam(required = false) Boolean activo) {
        List<Categoria> categorias = categoriaRepository.findAll();
        if (activo == null) {
            return categorias;
        }
        return categorias.stream().filter(c -> activo.equals(c.getActivo())).toList();
    }

    @GetMapping("/{id}")
    public Categoria obtener(@PathVariable String id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoría no encontrada."));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('Administrador', 'Operadora')")
    @SecurityRequirement(name = "bearerAuth")
    public Categoria crear(@RequestBody Categoria categoria) {
        if (categoria.getNombre() == null || categoria.getNombre().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre de la categoría es requerido.");
        }
        if (categoria.getId() == null || categoria.getId().isBlank()) {
            categoria.setId(nextId());
        }
        if (categoriaRepository.existsById(categoria.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "La categoría ya existe.");
        }
        if (categoria.getActivo() == null) {
            categoria.setActivo(true);
        }
        return categoriaRepository.save(categoria);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('Administrador', 'Operadora')")
    @SecurityRequirement(name = "bearerAuth")
    public Categoria actualizar(@PathVariable String id, @RequestBody Categoria changes) {
        Categoria categoria = obtener(id);
        if (changes.getNombre() != null) {
            categoria.setNombre(changes.getNombre());
        }
        if (changes.getDescripcion() != null) {
            categoria.setDescripcion(changes.getDescripcion());
        }
        if (changes.getActivo() != null) {
            categoria.setActivo(changes.getActivo());
        }
        return categoriaRepository.save(categoria);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyRole('Administrador', 'Operadora')")
    @SecurityRequirement(name = "bearerAuth")
    public void eliminar(@PathVariable String id) {
        if (!categoriaRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoría no encontrada.");
        }
        categoriaRepository.deleteById(id);
    }

    private String nextId() {
        int max = categoriaRepository.findAll().stream()
                .map(Categoria::getId)
                .filter(id -> id != null && id.startsWith("CAT-"))
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
        return String.format(Locale.ROOT, "CAT-%02d", max + 1);
    }
}
