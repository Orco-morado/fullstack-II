package cl.gaslachispa.api.oferta;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ofertas")
@Getter
@Setter
@NoArgsConstructor
public class Oferta {

    @Id
    @Column(length = 20)
    private String id;

    @Column(nullable = false, length = 200)
    private String titulo;

    @Column(length = 500)
    private String descripcion;

    @Column(length = 20)
    private String productoId;

    @Column(nullable = false)
    private Integer descuento;

    @Column(nullable = false)
    private Boolean activo;

    @Column(length = 1000)
    private String imagen;

    @Column(length = 40)
    private String vigencia;
}
