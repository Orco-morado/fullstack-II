package cl.gaslachispa.api.oferta;

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
@RequestMapping("/api/v1/ofertas")
@Tag(name = "Ofertas", description = "Catálogo y administración de ofertas")
public class OfertasController {

    private final OfertaRepository ofertaRepository;

    public OfertasController(OfertaRepository ofertaRepository) {
        this.ofertaRepository = ofertaRepository;
    }

    @GetMapping
    @Operation(summary = "Listar ofertas", description = "Devuelve las ofertas, con filtro opcional por estado activo.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de ofertas")
    })
    public List<Oferta> listar(@RequestParam(required = false) Boolean activo) {
        List<Oferta> ofertas = ofertaRepository.findAll();
        if (activo == null) {
            return ofertas;
        }
        return ofertas.stream().filter(o -> activo.equals(o.getActivo())).toList();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener oferta", description = "Devuelve una oferta por su identificador.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Oferta encontrada"),
            @ApiResponse(responseCode = "404", description = "Oferta no encontrada")
    })
    public Oferta obtener(@PathVariable String id) {
        return ofertaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Oferta no encontrada."));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('Administrador', 'Operadora')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Crear oferta", description = "Crea una oferta. Requiere rol Administrador u Operadora.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Oferta creada"),
            @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos"),
            @ApiResponse(responseCode = "401", description = "No autenticado"),
            @ApiResponse(responseCode = "403", description = "Usuario sin permiso"),
            @ApiResponse(responseCode = "409", description = "Oferta ya existente")
    })
    public Oferta crear(@RequestBody Oferta oferta) {
        if (oferta.getTitulo() == null || oferta.getTitulo().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El título de la oferta es requerido.");
        }
        if (oferta.getId() == null || oferta.getId().isBlank()) {
            oferta.setId(nextId());
        }
        if (ofertaRepository.existsById(oferta.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "La oferta ya existe.");
        }
        if (oferta.getDescuento() == null) {
            oferta.setDescuento(0);
        }
        if (oferta.getActivo() == null) {
            oferta.setActivo(true);
        }
        return ofertaRepository.save(oferta);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('Administrador', 'Operadora')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Actualizar oferta", description = "Actualiza una oferta. Requiere rol Administrador u Operadora.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Oferta actualizada"),
            @ApiResponse(responseCode = "401", description = "No autenticado"),
            @ApiResponse(responseCode = "403", description = "Usuario sin permiso"),
            @ApiResponse(responseCode = "404", description = "Oferta no encontrada")
    })
    public Oferta actualizar(@PathVariable String id, @RequestBody Oferta changes) {
        Oferta oferta = obtener(id);
        if (changes.getTitulo() != null) {
            oferta.setTitulo(changes.getTitulo());
        }
        if (changes.getDescripcion() != null) {
            oferta.setDescripcion(changes.getDescripcion());
        }
        if (changes.getProductoId() != null) {
            oferta.setProductoId(changes.getProductoId());
        }
        if (changes.getDescuento() != null) {
            oferta.setDescuento(changes.getDescuento());
        }
        if (changes.getImagen() != null) {
            oferta.setImagen(changes.getImagen());
        }
        if (changes.getVigencia() != null) {
            oferta.setVigencia(changes.getVigencia());
        }
        if (changes.getActivo() != null) {
            oferta.setActivo(changes.getActivo());
        }
        return ofertaRepository.save(oferta);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyRole('Administrador', 'Operadora')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Eliminar oferta", description = "Elimina una oferta. Requiere rol Administrador u Operadora.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Oferta eliminada"),
            @ApiResponse(responseCode = "401", description = "No autenticado"),
            @ApiResponse(responseCode = "403", description = "Usuario sin permiso"),
            @ApiResponse(responseCode = "404", description = "Oferta no encontrada")
    })
    public void eliminar(@PathVariable String id) {
        if (!ofertaRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Oferta no encontrada.");
        }
        ofertaRepository.deleteById(id);
    }

    private String nextId() {
        int max = ofertaRepository.findAll().stream()
                .map(Oferta::getId)
                .filter(id -> id != null && id.startsWith("OF-"))
                .map(id -> id.substring(3))
                .mapToInt(value -> {
                    try {
                        return Integer.parseInt(value);
                    } catch (NumberFormatException ex) {
                        return 0;
                    }
                })
                .max()
                .orElse(0);
        return String.format(Locale.ROOT, "OF-%02d", max + 1);
    }
}
