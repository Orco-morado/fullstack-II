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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/usuarios")
@PreAuthorize("hasAnyRole('Administrador', 'Operadora')")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Usuarios", description = "Administración de usuarios y roles")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    @Operation(summary = "Listar usuarios", description = "Devuelve todos los usuarios. Requiere rol Administrador u Operadora.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de usuarios"),
            @ApiResponse(responseCode = "401", description = "No autenticado"),
            @ApiResponse(responseCode = "403", description = "Usuario sin permiso")
    })
    public List<Usuario> listar() {
        return usuarioService.listar();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener usuario", description = "Devuelve un usuario por su identificador.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Usuario encontrado"),
            @ApiResponse(responseCode = "401", description = "No autenticado"),
            @ApiResponse(responseCode = "403", description = "Usuario sin permiso"),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    public Usuario obtener(@PathVariable String id) {
        return usuarioService.obtener(id);
    }

    @GetMapping("/rol/{rol}")
    @Operation(summary = "Listar usuarios por rol", description = "Devuelve los usuarios que tienen el rol indicado.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de usuarios"),
            @ApiResponse(responseCode = "401", description = "No autenticado"),
            @ApiResponse(responseCode = "403", description = "Usuario sin permiso")
    })
    public List<Usuario> porRol(@PathVariable String rol) {
        return usuarioService.porRol(rol);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Crear usuario", description = "Crea un usuario. La Operadora no puede crear Administradores.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Usuario creado"),
            @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos"),
            @ApiResponse(responseCode = "401", description = "No autenticado"),
            @ApiResponse(responseCode = "403", description = "Usuario sin permiso o intento de crear un Administrador"),
            @ApiResponse(responseCode = "409", description = "Correo, RUN o identificador ya registrado")
    })
    public Usuario crear(@RequestBody Usuario usuario, Authentication authentication) {
        validarOperadoraSobreAdmin(authentication, usuario.getRol());
        return usuarioService.crear(usuario);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar usuario", description = "Actualiza un usuario. La Operadora no puede editar Administradores ni promoverlos.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Usuario actualizado"),
            @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos"),
            @ApiResponse(responseCode = "401", description = "No autenticado"),
            @ApiResponse(responseCode = "403", description = "Usuario sin permiso o intento de gestionar un Administrador"),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
            @ApiResponse(responseCode = "409", description = "Correo o RUN ya registrado")
    })
    public Usuario actualizar(@PathVariable String id, @RequestBody Usuario changes,
            Authentication authentication) {
        Usuario objetivo = usuarioService.obtener(id);
        validarOperadoraSobreAdmin(authentication, objetivo.getRol());
        validarOperadoraSobreAdmin(authentication, changes.getRol());
        return usuarioService.actualizar(id, changes);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Eliminar usuario", description = "Elimina un usuario. La Operadora no puede eliminar Administradores.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Usuario eliminado"),
            @ApiResponse(responseCode = "401", description = "No autenticado"),
            @ApiResponse(responseCode = "403", description = "Usuario sin permiso o intento de eliminar un Administrador"),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
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
