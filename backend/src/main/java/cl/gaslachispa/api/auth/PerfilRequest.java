package cl.gaslachispa.api.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PerfilRequest {

    @NotBlank(message = "El nombre es requerido.")
    private String nombre;

    private String telefono;

    private String comuna;

    private String direccion;
}
