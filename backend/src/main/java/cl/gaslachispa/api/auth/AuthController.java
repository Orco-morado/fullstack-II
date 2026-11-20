package cl.gaslachispa.api.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cl.gaslachispa.api.usuario.Usuario;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/registro")
    public ResponseEntity<LoginResponse> registro(@Valid @RequestBody RegistroRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registro(request));
    }

    @GetMapping("/me")
    @SecurityRequirement(name = "bearerAuth")
    public Usuario me(Authentication authentication) {
        return authService.me(authentication);
    }

    @PutMapping("/me")
    @SecurityRequirement(name = "bearerAuth")
    public Usuario actualizarPerfil(@Valid @RequestBody PerfilRequest request, Authentication authentication) {
        return authService.actualizarPerfil(request, authentication);
    }

    @PutMapping("/password")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody PasswordRequest request,
            Authentication authentication) {
        authService.changePassword(request, authentication);
        return ResponseEntity.noContent().build();
    }
}
