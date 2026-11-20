package cl.gaslachispa.api.blog;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "blogs")
@Getter
@Setter
@NoArgsConstructor
public class Blog {

    @Id
    @Column(length = 20)
    private String id;

    @Column(nullable = false, length = 200)
    private String titulo;

    @Column(nullable = false, length = 60)
    private String categoria;

    @Column(nullable = false, length = 40)
    private String fecha;

    @Column(length = 500)
    private String resumen;

    @Column(length = 4000)
    private String contenido;

    @Column(length = 150)
    private String autor;

    @Column(nullable = false)
    private Boolean activo;
}
