package cl.gaslachispa.api.usuario;

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
import org.springframework.web.server.ResponseStatusException;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/v1/usuarios")
@PreAuthorize("hasAnyRole('Administrador', 'Operadora')")
@SecurityRequirement(name = "bearerAuth")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public List<Usuario> listar() {
        return usuarioService.listar();
    }

    @GetMapping("/{id}")
    public Usuario obtener(@PathVariable String id) {
        return usuarioService.obtener(id);
    }

    @GetMapping("/rol/{rol}")
    public List<Usuario> porRol(@PathVariable String rol) {
        return usuarioService.porRol(rol);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Usuario crear(@RequestBody Usuario usuario, Authentication authentication) {
        validarOperadoraSobreAdmin(authentication, usuario.getRol());
        return usuarioService.crear(usuario);
    }

    @PutMapping("/{id}")
    public Usuario actualizar(@PathVariable String id, @RequestBody Usuario changes,
            Authentication authentication) {
        Usuario objetivo = usuarioService.obtener(id);
        validarOperadoraSobreAdmin(authentication, objetivo.getRol());
        validarOperadoraSobreAdmin(authentication, changes.getRol());
        return usuarioService.actualizar(id, changes);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable String id, Authentication authentication) {
        Usuario objetivo = usuarioService.obtener(id);
        validarOperadoraSobreAdmin(authentication, objetivo.getRol());
        usuarioService.eliminar(id);
    }

    private void validarOperadoraSobreAdmin(Authentication authentication, String rol) {
        if (esOperadora(authentication) && "Administrador".equals(rol)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "La Operadora no puede gestionar usuarios Administradores.");
        }
    }

    private boolean esOperadora(Authentication authentication) {
        return authentication != null && authentication.getAuthorities().stream()
                .anyMatch(authority -> "ROLE_Operadora".equals(authority.getAuthority()));
    }
}
