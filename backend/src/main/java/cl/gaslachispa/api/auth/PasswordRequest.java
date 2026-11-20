package cl.gaslachispa.api.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordRequest {

    @NotBlank(message = "La contraseña actual es requerida.")
    private String actual;

    @NotBlank(message = "La nueva contraseña es requerida.")
    @Size(min = 4, max = 10, message = "La nueva contraseña debe tener entre 4 y 10 caracteres.")
    private String nueva;
}
