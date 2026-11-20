package cl.gaslachispa.api.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {

    @NotBlank(message = "El correo es requerido.")
    private String email;

    @NotBlank(message = "La contraseña es requerida.")
    private String password;
}
