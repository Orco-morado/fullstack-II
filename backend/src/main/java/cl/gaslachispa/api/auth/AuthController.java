package cl.gaslachispa.api.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cl.gaslachispa.api.usuario.Usuario;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Autenticación", description = "Inicio de sesión, registro y gestión de la sesión")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión", description = "Autentica un usuario activo y devuelve un token JWT.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Inicio de sesión exitoso"),
            @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos"),
            @ApiResponse(responseCode = "401", description = "Credenciales incorrectas o usuario inactivo")
    })
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/registro")
    @Operation(summary = "Registrar cliente", description = "Crea una cuenta de cliente y devuelve un token JWT.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Cuenta creada"),
            @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos"),
            @ApiResponse(responseCode = "409", description = "Correo o RUN ya registrado")
    })
    public ResponseEntity<LoginResponse> registro(@Valid @RequestBody RegistroRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registro(request));
    }

    @PostMapping("/refresh")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Renovar token", description = "Devuelve un token nuevo para un usuario activo.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Token renovado"),
            @ApiResponse(responseCode = "401", description = "Token ausente, inválido o usuario inactivo"),
            @ApiResponse(responseCode = "403", description = "Usuario sin permiso para renovar el token")
    })
    public LoginResponse refresh(Authentication authentication) {
        return authService.refresh(authentication);
    }

    @GetMapping("/me")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Consultar sesión", description = "Devuelve los datos del usuario autenticado.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Datos del usuario"),
            @ApiResponse(responseCode = "401", description = "Token ausente, inválido o usuario inactivo"),
            @ApiResponse(responseCode = "403", description = "Usuario sin permiso")
    })
    public Usuario me(Authentication authentication) {
        return authService.me(authentication);
    }

    @PutMapping("/me")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAnyRole('Administrador', 'Operadora', 'Cliente', 'Repartidor')")
    @Operation(summary = "Actualizar perfil", description = "Actualiza los datos personales del usuario autenticado.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Perfil actualizado"),
            @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos"),
            @ApiResponse(responseCode = "401", description = "No autenticado"),
            @ApiResponse(responseCode = "403", description = "Usuario sin permiso")
    })
    public Usuario actualizarPerfil(@Valid @RequestBody PerfilRequest request, Authentication authentication) {
        return authService.actualizarPerfil(request, authentication);
    }

    @PutMapping("/password")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAnyRole('Administrador', 'Operadora', 'Cliente', 'Repartidor')")
    @Operation(summary = "Cambiar contraseña", description = "Cambia la contraseña del usuario autenticado.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Contraseña actualizada"),
            @ApiResponse(responseCode = "400", description = "Contraseña actual incorrecta o datos inválidos"),
            @ApiResponse(responseCode = "401", description = "No autenticado"),
            @ApiResponse(responseCode = "403", description = "Usuario sin permiso")
    })
    public ResponseEntity<Void> changePassword(@Valid @RequestBody PasswordRequest request,
            Authentication authentication) {
        authService.changePassword(request, authentication);
        return ResponseEntity.noContent().build();
    }
}
