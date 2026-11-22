package cl.gaslachispa.api.blog;

import java.time.LocalDate;
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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/blogs")
@Tag(name = "Blogs", description = "Publicaciones y administración del blog")
public class BlogsController {

    private final BlogRepository blogRepository;

    public BlogsController(BlogRepository blogRepository) {
        this.blogRepository = blogRepository;
    }

    @GetMapping
    @Operation(summary = "Listar publicaciones", description = "Devuelve las publicaciones, con filtro opcional por estado activo.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de publicaciones")
    })
    public List<Blog> listar(@RequestParam(required = false) Boolean activo) {
        List<Blog> blogs = blogRepository.findAll();
        if (activo == null) {
            return blogs;
        }
        return blogs.stream().filter(b -> activo.equals(b.getActivo())).toList();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener publicación", description = "Devuelve una publicación por su identificador.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Publicación encontrada"),
            @ApiResponse(responseCode = "404", description = "Publicación no encontrada")
    })
    public Blog obtener(@PathVariable String id) {
        return blogRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Publicación no encontrada."));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('Administrador', 'Operadora')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Crear publicación", description = "Crea una publicación. Requiere rol Administrador u Operadora.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Publicación creada"),
            @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos"),
            @ApiResponse(responseCode = "401", description = "No autenticado"),
            @ApiResponse(responseCode = "403", description = "Usuario sin permiso"),
            @ApiResponse(responseCode = "409", description = "Publicación ya existente")
    })
    public Blog crear(@RequestBody Blog blog) {
        if (blog.getTitulo() == null || blog.getTitulo().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El título de la publicación es requerido.");
        }
        if (blog.getId() == null || blog.getId().isBlank()) {
            blog.setId(nextId());
        }
        if (blogRepository.existsById(blog.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "La publicación ya existe.");
        }
        if (blog.getCategoria() == null || blog.getCategoria().isBlank()) {
            blog.setCategoria("Empresa");
        }
        if (blog.getFecha() == null || blog.getFecha().isBlank()) {
            blog.setFecha(LocalDate.now().toString());
        }
        if (blog.getAutor() == null || blog.getAutor().isBlank()) {
            blog.setAutor("Equipo Gas La Chispa");
        }
        if (blog.getActivo() == null) {
            blog.setActivo(true);
        }
        return blogRepository.save(blog);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('Administrador', 'Operadora')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Actualizar publicación", description = "Actualiza una publicación. Requiere rol Administrador u Operadora.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Publicación actualizada"),
            @ApiResponse(responseCode = "401", description = "No autenticado"),
            @ApiResponse(responseCode = "403", description = "Usuario sin permiso"),
            @ApiResponse(responseCode = "404", description = "Publicación no encontrada")
    })
    public Blog actualizar(@PathVariable String id, @RequestBody Blog changes) {
        Blog blog = obtener(id);
        if (changes.getTitulo() != null) {
            blog.setTitulo(changes.getTitulo());
        }
        if (changes.getCategoria() != null) {
            blog.setCategoria(changes.getCategoria());
        }
        if (changes.getFecha() != null) {
            blog.setFecha(changes.getFecha());
        }
        if (changes.getResumen() != null) {
            blog.setResumen(changes.getResumen());
        }
        if (changes.getContenido() != null) {
            blog.setContenido(changes.getContenido());
        }
        if (changes.getAutor() != null) {
            blog.setAutor(changes.getAutor());
        }
        if (changes.getActivo() != null) {
            blog.setActivo(changes.getActivo());
        }
        return blogRepository.save(blog);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyRole('Administrador', 'Operadora')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Eliminar publicación", description = "Elimina una publicación. Requiere rol Administrador u Operadora.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Publicación eliminada"),
            @ApiResponse(responseCode = "401", description = "No autenticado"),
            @ApiResponse(responseCode = "403", description = "Usuario sin permiso"),
            @ApiResponse(responseCode = "404", description = "Publicación no encontrada")
    })
    public void eliminar(@PathVariable String id) {
        if (!blogRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Publicación no encontrada.");
        }
        blogRepository.deleteById(id);
    }

    private String nextId() {
        int max = blogRepository.findAll().stream()
                .map(Blog::getId)
                .filter(id -> id != null && id.startsWith("BLOG-"))
                .map(id -> id.substring(5))
                .mapToInt(value -> {
                    try {
                        return Integer.parseInt(value);
                    } catch (NumberFormatException ex) {
                        return 0;
                    }
                })
                .max()
                .orElse(0);
        return String.format(Locale.ROOT, "BLOG-%02d", max + 1);
    }
}
