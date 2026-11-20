package cl.gaslachispa.api.usuario;

import java.nio.charset.StandardCharsets;
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

class UsuariosControllerTest extends ApiTestSupport {

    private String crearUsuario(String token, String email, String run) throws Exception {
        String body = objectMapper.writeValueAsString(Map.of(
                "run", run,
                "nombre", "Usuario de Prueba",
                "email", email,
                "password", "prueba123",
                "telefono", "+56 9 1234 5678",
                "rol", "Vendedor",
                "estado", "activo"));

        String json = mockMvc.perform(post("/api/v1/usuarios")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(StandardCharsets.UTF_8);
        return objectMapper.readTree(json).get("id").asText();
    }

    @Test
    void listarUsuariosComoAdmin() throws Exception {
        String token = token("admin@gmail.com", "admin123");

        mockMvc.perform(get("/api/v1/usuarios")
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(6));
    }

    @Test
    void listarUsuariosComoClienteDevuelve403() throws Exception {
        String token = token("cliente@gmail.com", "cliente123");

        mockMvc.perform(get("/api/v1/usuarios")
                        .header("Authorization", bearer(token)))
                .andExpect(status().isForbidden());
    }

    @Test
    void listarUsuariosSinTokenDevuelve401() throws Exception {
        mockMvc.perform(get("/api/v1/usuarios"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void listarUsuariosPorRol() throws Exception {
        String token = token("admin@gmail.com", "admin123");

        mockMvc.perform(get("/api/v1/usuarios/rol/Vendedor")
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].email").value("vendedor@gmail.com"));
    }

    @Test
    void crearUsuarioComoAdmin() throws Exception {
        String token = token("admin@gmail.com", "admin123");
        String body = objectMapper.writeValueAsString(Map.of(
                "run", "33.333.333-3",
                "nombre", "Nuevo Vendedor",
                "email", "nuevo.vendedor@test.cl",
                "password", "vendedor9",
                "telefono", "+56 9 3333 4444",
                "rol", "Vendedor",
                "estado", "activo"));

        mockMvc.perform(post("/api/v1/usuarios")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", startsWith("U-")))
                .andExpect(jsonPath("$.rol").value("Vendedor"))
                .andExpect(jsonPath("$.password").doesNotExist());
    }

    @Test
    void crearUsuarioConEmailDuplicadoDevuelve409() throws Exception {
        String token = token("admin@gmail.com", "admin123");
        String body = objectMapper.writeValueAsString(Map.of(
                "run", "44.444.444-4",
                "nombre", "Duplicado",
                "email", "admin@gmail.com",
                "password", "duplicado1"));

        mockMvc.perform(post("/api/v1/usuarios")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isConflict());
    }

    @Test
    void crearUsuarioSinPasswordDevuelve400() throws Exception {
        String token = token("admin@gmail.com", "admin123");
        String body = objectMapper.writeValueAsString(Map.of(
                "run", "55.555.555-5",
                "nombre", "Sin Clave",
                "email", "sin.clave@test.cl"));

        mockMvc.perform(post("/api/v1/usuarios")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    void crearUsuarioConRolInvalidoDevuelve400() throws Exception {
        String token = token("admin@gmail.com", "admin123");
        String body = objectMapper.writeValueAsString(Map.of(
                "run", "66.666.666-6",
                "nombre", "Rol Malo",
                "email", "rol.malo@test.cl",
                "password", "rolmalo12",
                "rol", "Gerente"));

        mockMvc.perform(post("/api/v1/usuarios")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    void actualizarUsuarioComoAdmin() throws Exception {
        String token = token("admin@gmail.com", "admin123");
        String id = crearUsuario(token, "editar.usuario@test.cl", "77.777.777-7");
        String body = objectMapper.writeValueAsString(
                Map.of("nombre", "Usuario Editado", "rol", "Repartidor"));

        mockMvc.perform(put("/api/v1/usuarios/" + id)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Usuario Editado"))
                .andExpect(jsonPath("$.rol").value("Repartidor"));
    }

    @Test
    void eliminarUsuarioComoAdmin() throws Exception {
        String token = token("admin@gmail.com", "admin123");
        String id = crearUsuario(token, "borrar.usuario@test.cl", "88.888.888-8");

        mockMvc.perform(delete("/api/v1/usuarios/" + id)
                        .header("Authorization", bearer(token)))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/v1/usuarios/" + id)
                        .header("Authorization", bearer(token)))
                .andExpect(status().isNotFound());
    }
}
