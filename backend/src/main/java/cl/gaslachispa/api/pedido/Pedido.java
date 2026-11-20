package cl.gaslachispa.api.pedido;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "pedidos")
@Getter
@Setter
@NoArgsConstructor
public class Pedido {

    @Id
    @Column(length = 20)
    private String id;

    @Column(length = 20)
    private String clienteId;

    @Column(nullable = false, length = 200)
    private String cliente;

    @Column(length = 40)
    private String fono;

    @Column(nullable = false, length = 60)
    private String comuna;

    @Column(nullable = false, length = 300)
    private String direccion;

    @Column(nullable = false, length = 20)
    private String productoId;

    @Column(nullable = false, length = 150)
    private String producto;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(nullable = false)
    private Integer total;

    @Column(nullable = false, length = 30)
    private String estado;

    @Column(length = 200)
    private String repartidor;

    @Column(nullable = false, length = 30)
    private String pago;

    @Column(nullable = false, length = 40)
    private String fecha;
}
