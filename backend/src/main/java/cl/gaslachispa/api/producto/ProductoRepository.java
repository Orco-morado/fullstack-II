package cl.gaslachispa.api.producto;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<Producto, String> {

    List<Producto> findByCategoria(String categoria);
}
