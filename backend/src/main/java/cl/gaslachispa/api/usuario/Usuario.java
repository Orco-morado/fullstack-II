package cl.gaslachispa.api.usuario;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
public class Usuario {

    @Id
    @Column(length = 20)
    private String id;

    @Column(length = 20, unique = true)
    private String run;

    @Column(nullable = false, length = 200)
    private String nombre;

    @Column(nullable = false, unique = true, length = 120)
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false, length = 100)
    private String password;

    @Column(length = 40)
    private String telefono;

    @Column(nullable = false, length = 30)
    private String rol;

    @Column(nullable = false, length = 20)
    private String estado;

    @Column(length = 60)
    private String comuna;

    @Column(length = 300)
    private String direccion;

    @Column(name = "creado_en", length = 40)
    private String creadoEn;
}
