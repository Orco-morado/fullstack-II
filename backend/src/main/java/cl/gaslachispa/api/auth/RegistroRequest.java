package cl.gaslachispa.api.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegistroRequest {

    @NotBlank(message = "El RUN es requerido.")
    private String run;

    @NotBlank(message = "El nombre es requerido.")
    private String nombre;

    @NotBlank(message = "El correo es requerido.")
    @Email(message = "El correo no es válido.")
    private String email;

    @NotBlank(message = "La contraseña es requerida.")
    @Size(min = 4, max = 10, message = "La contraseña debe tener entre 4 y 10 caracteres.")
    private String password;

    private String telefono;

    private String comuna;

    private String direccion;
}
