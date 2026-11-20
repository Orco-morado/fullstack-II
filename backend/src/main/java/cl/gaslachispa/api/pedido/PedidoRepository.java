package cl.gaslachispa.api.pedido;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoRepository extends JpaRepository<Pedido, String> {

    List<Pedido> findByClienteId(String clienteId);

    List<Pedido> findByRepartidor(String repartidor);

    List<Pedido> findByEstado(String estado);
}
