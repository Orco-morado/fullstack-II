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

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/v1/pedidos")
@SecurityRequirement(name = "bearerAuth")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @GetMapping
    public List<Pedido> listar(Authentication authentication) {
        return pedidoService.listar(authentication);
    }

    @GetMapping("/{id}")
    public Pedido obtener(@PathVariable String id, Authentication authentication) {
        return pedidoService.obtener(id, authentication);
    }

    @GetMapping("/estado/{estado}")
    public List<Pedido> porEstado(@PathVariable String estado, Authentication authentication) {
        return pedidoService.porEstado(estado, authentication);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('Cliente', 'Administrador', 'Operadora')")
    public Pedido crear(@RequestBody Pedido pedido, Authentication authentication) {
        return pedidoService.crear(pedido, authentication);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('Administrador', 'Operadora')")
    public Pedido actualizar(@PathVariable String id, @RequestBody Pedido changes) {
        return pedidoService.actualizar(id, changes);
    }

    @PutMapping("/{id}/estado")
    @PreAuthorize("hasAnyRole('Administrador', 'Operadora', 'Repartidor')")
    public Pedido cambiarEstado(@PathVariable String id, @RequestBody EstadoRequest request,
            Authentication authentication) {
        return pedidoService.cambiarEstado(id, request.estado(), authentication);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyRole('Administrador', 'Operadora')")
    public void eliminar(@PathVariable String id) {
        pedidoService.eliminar(id);
    }
}
