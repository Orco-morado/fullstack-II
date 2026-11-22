package cl.gaslachispa.api.usuario;

import java.nio.charset.StandardCharsets;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;

import cl.gaslachispa.api.support.ApiTestSupport;

import static org.hamcrest.Matchers.startsWith;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Transactional
class UsuariosControllerTest extends ApiTestSupport {

    private String crearUsuario(String token, String email, String run) throws Exception {
        return crearUsuario(token, email, run, "Vendedor");
    }

    private String crearUsuario(String token, String email, String run, String rol) throws Exception {
        String body = objectMapper.writeValueAsString(Map.of(
                "run", run,
                "nombre", "Usuario de Prueba",
                "email", email,
                "password", "prueba123",
                "telefono", "+56 9 1234 5678",
                "rol", rol,
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

    @Test
    void operadoraPuedeCrearVendedor() throws Exception {
        String token = token("operadora@gmail.com", "oper1234");
        String body = objectMapper.writeValueAsString(Map.of(
                "run", "90.000.001-1",
                "nombre", "Vendedor de Operadora",
                "email", "vendedor.operadora@test.cl",
                "password", "vendedor9",
                "rol", "Vendedor"));

        mockMvc.perform(post("/api/v1/usuarios")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.rol").value("Vendedor"));
    }

    @Test
    void operadoraNoPuedeCrearAdministrador() throws Exception {
        String token = token("operadora@gmail.com", "oper1234");
        String body = objectMapper.writeValueAsString(Map.of(
                "run", "90.000.002-2",
                "nombre", "Administrador de Operadora",
                "email", "admin.operadora@test.cl",
                "password", "admin9999",
                "rol", "Administrador"));

        mockMvc.perform(post("/api/v1/usuarios")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isForbidden());
    }

    @Test
    void operadoraNoPuedeEditarAdministrador() throws Exception {
        String adminToken = token("admin@gmail.com", "admin123");
        String id = crearUsuario(adminToken, "admin.editar@test.cl", "90.000.003-3", "Administrador");
        String token = token("operadora@gmail.com", "oper1234");

        mockMvc.perform(put("/api/v1/usuarios/" + id)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("nombre", "Editado"))))
                .andExpect(status().isForbidden());
    }

    @Test
    void operadoraNoPuedePromoverUsuarioAAdministrador() throws Exception {
        String adminToken = token("admin@gmail.com", "admin123");
        String id = crearUsuario(adminToken, "vendedor.promover@test.cl", "90.000.004-4");
        String token = token("operadora@gmail.com", "oper1234");

        mockMvc.perform(put("/api/v1/usuarios/" + id)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("rol", "Administrador"))))
                .andExpect(status().isForbidden());
    }

    @Test
    void operadoraNoPuedeEliminarAdministrador() throws Exception {
        String adminToken = token("admin@gmail.com", "admin123");
        String id = crearUsuario(adminToken, "admin.eliminar@test.cl", "90.000.005-5", "Administrador");
        String token = token("operadora@gmail.com", "oper1234");

        mockMvc.perform(delete("/api/v1/usuarios/" + id)
                        .header("Authorization", bearer(token)))
                .andExpect(status().isForbidden());
    }

    @Test
    void operadoraPuedeEditarVendedor() throws Exception {
        String adminToken = token("admin@gmail.com", "admin123");
        String id = crearUsuario(adminToken, "vendedor.editar@test.cl", "90.000.006-6");
        String token = token("operadora@gmail.com", "oper1234");

        mockMvc.perform(put("/api/v1/usuarios/" + id)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("nombre", "Vendedor Editado"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Vendedor Editado"));
    }

    @Test
    void operadoraPuedeEliminarVendedor() throws Exception {
        String adminToken = token("admin@gmail.com", "admin123");
        String id = crearUsuario(adminToken, "vendedor.eliminar@test.cl", "90.000.007-7");
        String token = token("operadora@gmail.com", "oper1234");

        mockMvc.perform(delete("/api/v1/usuarios/" + id)
                        .header("Authorization", bearer(token)))
                .andExpect(status().isNoContent());
    }
}
