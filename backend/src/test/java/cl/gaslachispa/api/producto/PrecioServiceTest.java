package cl.gaslachispa.api.producto;

import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import cl.gaslachispa.api.support.ApiTestSupport;

import static org.junit.jupiter.api.Assertions.assertEquals;

class PrecioServiceTest extends ApiTestSupport {

    @Autowired
    private PrecioService precioService;

    @Autowired
    private ProductoRepository productoRepository;

    @Test
    void aplicaDescuentoElDiaDeVigenciaYLoQuitaAlSiguiente() {
        Producto producto = productoRepository.findById("VOL-015").orElseThrow();

        assertEquals(22950, precioService.precioFinal(producto, LocalDate.of(2030, 12, 31)));
        assertEquals(27000, precioService.precioFinal(producto, LocalDate.of(2031, 1, 1)));
    }
}
