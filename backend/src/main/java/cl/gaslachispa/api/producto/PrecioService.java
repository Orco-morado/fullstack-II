package cl.gaslachispa.api.producto;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeParseException;

import org.springframework.stereotype.Service;

import cl.gaslachispa.api.oferta.Oferta;
import cl.gaslachispa.api.oferta.OfertaRepository;

@Service
public class PrecioService {

    private static final ZoneId ZONA = ZoneId.of("America/Santiago");

    private final OfertaRepository ofertaRepository;

    public PrecioService(OfertaRepository ofertaRepository) {
        this.ofertaRepository = ofertaRepository;
    }

    public int precioFinal(Producto producto) {
        return precioFinal(producto, LocalDate.now(ZONA));
    }

    int precioFinal(Producto producto, LocalDate hoy) {
        if (producto == null) {
            return 0;
        }
        int precio = producto.getPrecio() == null ? 0 : producto.getPrecio();
        int descuento = ofertaRepository.findByActivoTrue().stream()
                .filter(oferta -> producto.getId() != null && producto.getId().equals(oferta.getProductoId()))
                .filter(oferta -> vigente(oferta, hoy))
                .map(Oferta::getDescuento)
                .filter(valor -> valor != null)
                .max(Integer::compareTo)
                .orElse(0);
        descuento = Math.max(0, Math.min(100, descuento));
        return (int) Math.round(precio * (100 - descuento) / 100.0);
    }

    private boolean vigente(Oferta oferta, LocalDate hoy) {
        if (oferta.getVigencia() == null || oferta.getVigencia().isBlank()) {
            return false;
        }
        try {
            return !LocalDate.parse(oferta.getVigencia()).isBefore(hoy);
        } catch (DateTimeParseException ex) {
            return false;
        }
    }
}
