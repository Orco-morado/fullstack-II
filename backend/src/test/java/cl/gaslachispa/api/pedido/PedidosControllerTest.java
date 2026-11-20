package cl.gaslachispa.api.pedido;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import cl.gaslachispa.api.support.ApiTestSupport;

import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.startsWith;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class PedidosControllerTest extends ApiTestSupport {

    private Map<String, Object> pedidoNuevo() {
        return Map.of(
                "cliente", "Cliente de Prueba",
                "fono", "+56 9 0000 0000",
                "comuna", "Santiago",
                "direccion", "Calle de Prueba 123",
                "productoId", "VOL-011",
                "producto", "Cilindro Normal 11 kg",
                "cantidad", 2,
                "total", 50000,
                "clienteId", "U-999",
                "pago", "efectivo");
    }

    @Test
    void clienteSoloVeSusPedidos() throws Exception {
        String token = token("cliente@gmail.com", "cliente123");

        mockMvc.perform(get("/api/v1/pedidos")
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(3))
                .andExpect(jsonPath("$[*].clienteId", everyItem(is("U-004"))));
    }

    @Test
    void repartidorSoloVeSusAsignados() throws Exception {
        String token = token("repartidor@gmail.com", "repart123");

        mockMvc.perform(get("/api/v1/pedidos")
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(3))
                .andExpect(jsonPath("$[*].repartidor", everyItem(is("Carlos Rojas"))));
    }

    @Test
    void vendedorVeTodosLosPedidos() throws Exception {
        String token = token("vendedor@gmail.com", "vendedor1");

        mockMvc.perform(get("/api/v1/pedidos")
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(4));
    }

    @Test
    void adminVeTodosLosPedidos() throws Exception {
        String token = token("admin@gmail.com", "admin123");

        mockMvc.perform(get("/api/v1/pedidos")
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(4));
    }

    @Test
    void listarPedidosSinTokenDevuelve401() throws Exception {
        mockMvc.perform(get("/api/v1/pedidos"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void clienteCreaPedidoConSuPropioId() throws Exception {
        String token = token("cliente@gmail.com", "cliente123");
        String body = objectMapper.writeValueAsString(pedidoNuevo());

        mockMvc.perform(post("/api/v1/pedidos")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", startsWith("GC-")))
                .andExpect(jsonPath("$.clienteId").value("U-004"))
                .andExpect(jsonPath("$.estado").value("recibido"))
                .andExpect(jsonPath("$.pago").value("efectivo"));
    }

    @Test
    void vendedorNoPuedeCrearPedidos() throws Exception {
        String token = token("vendedor@gmail.com", "vendedor1");
        String body = objectMapper.writeValueAsString(pedidoNuevo());

        mockMvc.perform(post("/api/v1/pedidos")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isForbidden());
    }

    @Test
    void clienteVePedidoPropio() throws Exception {
        String token = token("cliente@gmail.com", "cliente123");

        mockMvc.perform(get("/api/v1/pedidos/GC-100001")
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.clienteId").value("U-004"));
    }

    @Test
    void clienteNoVePedidoAjeno() throws Exception {
        String token = token("cliente@gmail.com", "cliente123");

        mockMvc.perform(get("/api/v1/pedidos/GC-100003")
                        .header("Authorization", bearer(token)))
                .andExpect(status().isForbidden());
    }

    @Test
    void repartidorCambiaEstadoDePedidoPropio() throws Exception {
        String token = token("repartidor@gmail.com", "repart123");
        String body = objectMapper.writeValueAsString(Map.of("estado", "entregado"));

        mockMvc.perform(put("/api/v1/pedidos/GC-100002/estado")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("entregado"));
    }

    @Test
    void repartidorNoCambiaEstadoDePedidoAjeno() throws Exception {
        String token = token("repartidor@gmail.com", "repart123");
        String body = objectMapper.writeValueAsString(Map.of("estado", "camino"));

        mockMvc.perform(put("/api/v1/pedidos/GC-100003/estado")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isForbidden());
    }

    @Test
    void adminCambiaEstadoDeCualquierPedido() throws Exception {
        String token = token("admin@gmail.com", "admin123");
        String body = objectMapper.writeValueAsString(Map.of("estado", "asignado"));

        mockMvc.perform(put("/api/v1/pedidos/GC-100003/estado")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("asignado"));
    }

    @Test
    void estadoInvalidoDevuelve400() throws Exception {
        String token = token("admin@gmail.com", "admin123");
        String body = objectMapper.writeValueAsString(Map.of("estado", "volando"));

        mockMvc.perform(put("/api/v1/pedidos/GC-100001/estado")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    void filtrarPorEstado() throws Exception {
        String token = token("admin@gmail.com", "admin123");

        mockMvc.perform(get("/api/v1/pedidos/estado/camino")
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value("GC-100002"));
    }

    @Test
    void adminEliminaPedido() throws Exception {
        String token = token("admin@gmail.com", "admin123");

        mockMvc.perform(delete("/api/v1/pedidos/GC-100004")
                        .header("Authorization", bearer(token)))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/v1/pedidos/GC-100004")
                        .header("Authorization", bearer(token)))
                .andExpect(status().isNotFound());
    }

    @Test
    void clienteNoPuedeEliminarPedido() throws Exception {
        String token = token("cliente@gmail.com", "cliente123");

        mockMvc.perform(delete("/api/v1/pedidos/GC-100001")
                        .header("Authorization", bearer(token)))
                .andExpect(status().isForbidden());
    }
}
