package cl.gaslachispa.api.oferta;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface OfertaRepository extends JpaRepository<Oferta, String> {

    List<Oferta> findByActivoTrue();
}
