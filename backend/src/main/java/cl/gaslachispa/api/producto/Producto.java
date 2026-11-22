package cl.gaslachispa.api.producto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "productos")
@Getter
@Setter
@NoArgsConstructor
public class Producto {

    @Id
    @Column(length = 20)
    private String id;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(nullable = false, length = 60)
    private String categoria;

    private Integer peso;

    @Column(nullable = false)
    private Integer precio;

    @Column(nullable = false)
    private Integer stock;

    @Column(length = 1000)
    private String imagen;

    @Column(length = 500)
    private String descripcion;

    @Column(nullable = false)
    private Boolean activo;

    @Transient
    private Integer precioFinal;
}
