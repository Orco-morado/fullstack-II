package cl.gaslachispa.api.producto;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import cl.gaslachispa.api.support.ApiTestSupport;

import static org.hamcrest.Matchers.startsWith;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class ProductosControllerTest extends ApiTestSupport {

    @Test
    void listarEsPublico() throws Exception {
        mockMvc.perform(get("/api/v1/productos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(7))
                .andExpect(jsonPath("$[0].id").isNotEmpty());
    }

    @Test
    void filtrarPorCategoria() throws Exception {
        mockMvc.perform(get("/api/v1/productos").param("categoria", "Normal"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(3));
    }

    @Test
    void buscarPorTexto() throws Exception {
        mockMvc.perform(get("/api/v1/productos").param("buscar", "cilindro"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(6));
    }

    @Test
    void obtenerProducto() throws Exception {
        mockMvc.perform(get("/api/v1/productos/VOL-011"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Cilindro Normal 11 kg"))
                .andExpect(jsonPath("$.precio").value(20000));
    }

    @Test
    void obtenerProductoInexistenteDevuelve404() throws Exception {
        mockMvc.perform(get("/api/v1/productos/VOL-999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void crearProductoComoAdmin() throws Exception {
        String token = token("admin@gmail.com", "admin123");
        String body = objectMapper.writeValueAsString(Map.of(
                "nombre", "Cilindro de Prueba",
                "categoria", "Normal",
                "peso", 10,
                "precio", 15000,
                "stock", 5,
                "imagen", "",
                "descripcion", "Producto creado en test"));

        mockMvc.perform(post("/api/v1/productos")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", startsWith("VOL-")))
                .andExpect(jsonPath("$.activo").value(true));
    }

    @Test
    void crearProductoComoClienteDevuelve403() throws Exception {
        String token = token("cliente@gmail.com", "cliente123");
        String body = objectMapper.writeValueAsString(Map.of("nombre", "No permitido"));

        mockMvc.perform(post("/api/v1/productos")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isForbidden());
    }

    @Test
    void crearProductoSinNombreDevuelve400() throws Exception {
        String token = token("admin@gmail.com", "admin123");
        String body = objectMapper.writeValueAsString(Map.of("precio", 1000));

        mockMvc.perform(post("/api/v1/productos")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    void actualizarProductoComoAdmin() throws Exception {
        String token = token("admin@gmail.com", "admin123");
        String body = objectMapper.writeValueAsString(Map.of("precio", 11900, "activo", false));

        mockMvc.perform(put("/api/v1/productos/VOL-005")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.precio").value(11900))
                .andExpect(jsonPath("$.activo").value(false));
    }

    @Test
    void eliminarProductoComoAdmin() throws Exception {
        String token = token("admin@gmail.com", "admin123");

        mockMvc.perform(delete("/api/v1/productos/VOL-005")
                        .header("Authorization", bearer(token)))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/v1/productos/VOL-005"))
                .andExpect(status().isNotFound());
    }

    @Test
    void eliminarProductoComoClienteDevuelve403() throws Exception {
        String token = token("cliente@gmail.com", "cliente123");

        mockMvc.perform(delete("/api/v1/productos/VOL-005")
                        .header("Authorization", bearer(token)))
                .andExpect(status().isForbidden());
    }

    @Test
    void obtenerProductoConOfertaVigenteDevuelvePrecioFinal() throws Exception {
        mockMvc.perform(get("/api/v1/productos/VOL-015"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.precio").value(27000))
                .andExpect(jsonPath("$.precioFinal").value(22950));
    }

    @Test
    void obtenerProductoConOfertaVencidaMantienePrecioBase() throws Exception {
        mockMvc.perform(get("/api/v1/productos/VOL-005"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.precio").value(11500))
                .andExpect(jsonPath("$.precioFinal").value(11500));
    }

    @Test
    void aplicarMayorDescuentoEntreOfertasVigentes() throws Exception {
        String token = token("admin@gmail.com", "admin123");
        String body = objectMapper.writeValueAsString(Map.of(
                "titulo", "20% dcto. en Cilindro 15 kg",
                "productoId", "VOL-015",
                "descuento", 20,
                "activo", true,
                "vigencia", "2030-12-31"));

        mockMvc.perform(post("/api/v1/ofertas")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/v1/productos/VOL-015"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.precioFinal").value(21600));
    }
}
