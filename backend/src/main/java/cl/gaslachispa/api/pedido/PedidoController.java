package cl.gaslachispa.api.pedido;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/pedidos")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Pedidos", description = "Gestión y seguimiento de pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @GetMapping
    @Operation(summary = "Listar pedidos", description = "Devuelve los pedidos visibles para el usuario autenticado según su rol.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de pedidos"),
            @ApiResponse(responseCode = "401", description = "No autenticado")
    })
    public List<Pedido> listar(Authentication authentication) {
        return pedidoService.listar(authentication);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener pedido", description = "Devuelve un pedido si el usuario tiene acceso a él.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Pedido encontrado"),
            @ApiResponse(responseCode = "401", description = "No autenticado"),
            @ApiResponse(responseCode = "403", description = "Sin acceso al pedido"),
            @ApiResponse(responseCode = "404", description = "Pedido no encontrado")
    })
    public Pedido obtener(@PathVariable String id, Authentication authentication) {
        return pedidoService.obtener(id, authentication);
    }

    @GetMapping("/estado/{estado}")
    @Operation(summary = "Listar pedidos por estado", description = "Devuelve los pedidos de un estado, filtrados por el rol del usuario.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de pedidos"),
            @ApiResponse(responseCode = "401", description = "No autenticado")
    })
    public List<Pedido> porEstado(@PathVariable String estado, Authentication authentication) {
        return pedidoService.porEstado(estado, authentication);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('Cliente', 'Administrador', 'Operadora')")
    @Operation(summary = "Crear pedido", description = "Crea un pedido, valida stock y calcula el total en el servidor.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Pedido creado"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos, stock insuficiente o producto inactivo"),
            @ApiResponse(responseCode = "401", description = "No autenticado"),
            @ApiResponse(responseCode = "403", description = "Usuario sin permiso")
    })
    public Pedido crear(@RequestBody Pedido pedido, Authentication authentication) {
        return pedidoService.crear(pedido, authentication);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('Administrador', 'Operadora')")
    @Operation(summary = "Actualizar pedido", description = "Actualiza los datos operativos de un pedido. Requiere rol Administrador u Operadora.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Pedido actualizado"),
            @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos"),
            @ApiResponse(responseCode = "401", description = "No autenticado"),
            @ApiResponse(responseCode = "403", description = "Usuario sin permiso"),
            @ApiResponse(responseCode = "404", description = "Pedido no encontrado")
    })
    public Pedido actualizar(@PathVariable String id, @RequestBody Pedido changes) {
        return pedidoService.actualizar(id, changes);
    }

    @PutMapping("/{id}/estado")
    @PreAuthorize("hasAnyRole('Administrador', 'Operadora', 'Repartidor')")
    @Operation(summary = "Cambiar estado del pedido", description = "Avanza el estado del pedido según las reglas del rol autenticado.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Estado actualizado"),
            @ApiResponse(responseCode = "400", description = "Transición de estado inválida"),
            @ApiResponse(responseCode = "401", description = "No autenticado"),
            @ApiResponse(responseCode = "403", description = "Usuario sin permiso"),
            @ApiResponse(responseCode = "404", description = "Pedido no encontrado")
    })
    public Pedido cambiarEstado(@PathVariable String id, @RequestBody EstadoRequest request,
            Authentication authentication) {
        return pedidoService.cambiarEstado(id, request.estado(), authentication);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyRole('Administrador', 'Operadora')")
    @Operation(summary = "Eliminar pedido", description = "Elimina un pedido. Requiere rol Administrador u Operadora.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Pedido eliminado"),
            @ApiResponse(responseCode = "401", description = "No autenticado"),
            @ApiResponse(responseCode = "403", description = "Usuario sin permiso"),
            @ApiResponse(responseCode = "404", description = "Pedido no encontrado")
    })
    public void eliminar(@PathVariable String id) {
        pedidoService.eliminar(id);
    }
}
