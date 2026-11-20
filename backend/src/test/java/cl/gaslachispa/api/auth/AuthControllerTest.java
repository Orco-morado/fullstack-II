package cl.gaslachispa.api.auth;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import cl.gaslachispa.api.support.ApiTestSupport;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AuthControllerTest extends ApiTestSupport {

    @Test
    void loginExitosoDevuelveTokenYUsuario() throws Exception {
        String body = objectMapper.writeValueAsString(
                Map.of("email", "admin@gmail.com", "password", "admin123"));

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.usuario.email").value("admin@gmail.com"))
                .andExpect(jsonPath("$.usuario.rol").value("Administrador"))
                .andExpect(jsonPath("$.usuario.password").doesNotExist());
    }

    @Test
    void loginConPasswordIncorrectaDevuelve401() throws Exception {
        String body = objectMapper.writeValueAsString(
                Map.of("email", "admin@gmail.com", "password", "incorrecta"));

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    void loginUsuarioInactivoDevuelve403() throws Exception {
        String body = objectMapper.writeValueAsString(
                Map.of("email", "lucia@gmail.com", "password", "lucia1234"));

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403));
    }

    @Test
    void meConTokenDevuelveUsuario() throws Exception {
        mockMvc.perform(get("/api/v1/auth/me")
                        .header("Authorization", bearer(token("admin@gmail.com", "admin123"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("admin@gmail.com"))
                .andExpect(jsonPath("$.password").doesNotExist());
    }

    @Test
    void meSinTokenDevuelve401() throws Exception {
        mockMvc.perform(get("/api/v1/auth/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void registroCreaClienteYDevuelveToken() throws Exception {
        String body = objectMapper.writeValueAsString(Map.of(
                "run", "11.111.111-1",
                "nombre", "Nuevo Cliente",
                "email", "nuevo.cliente@test.cl",
                "password", "nuevo1234",
                "telefono", "+56 9 1234 0000",
                "comuna", "Chillan",
                "direccion", "Calle Nueva 123"));

        mockMvc.perform(post("/api/v1/auth/registro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.usuario.rol").value("Cliente"))
                .andExpect(jsonPath("$.usuario.email").value("nuevo.cliente@test.cl"))
                .andExpect(jsonPath("$.usuario.password").doesNotExist());

        token("nuevo.cliente@test.cl", "nuevo1234");
    }

    @Test
    void registroConEmailDuplicadoDevuelve409() throws Exception {
        String body = objectMapper.writeValueAsString(Map.of(
                "run", "22.222.222-2",
                "nombre", "Duplicado",
                "email", "admin@gmail.com",
                "password", "duplicado1"));

        mockMvc.perform(post("/api/v1/auth/registro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isConflict());
    }

    @Test
    void cambioPasswordActualizaCredenciales() throws Exception {
        String token = token("cliente@gmail.com", "cliente123");
        String body = objectMapper.writeValueAsString(
                Map.of("actual", "cliente123", "nueva", "nueva1234"));

        mockMvc.perform(put("/api/v1/auth/password")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isNoContent());

        String oldPassword = objectMapper.writeValueAsString(
                Map.of("email", "cliente@gmail.com", "password", "cliente123"));
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(oldPassword))
                .andExpect(status().isUnauthorized());

        token("cliente@gmail.com", "nueva1234");
    }

    @Test
    void cambioPasswordConActualIncorrectaDevuelve400() throws Exception {
        String token = token("cliente@gmail.com", "cliente123");
        String body = objectMapper.writeValueAsString(
                Map.of("actual", "otraclave", "nueva", "nueva1234"));

        mockMvc.perform(put("/api/v1/auth/password")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    void actualizarPerfilActualizaDatos() throws Exception {
        String token = token("cliente@gmail.com", "cliente123");
        String body = objectMapper.writeValueAsString(Map.of(
                "nombre", "Pedro Actualizado",
                "telefono", "+56 9 0000 0000",
                "comuna", "Chillan",
                "direccion", "Nueva 123"));

        mockMvc.perform(put("/api/v1/auth/me")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Pedro Actualizado"))
                .andExpect(jsonPath("$.telefono").value("+56 9 0000 0000"));

        mockMvc.perform(get("/api/v1/auth/me")
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.direccion").value("Nueva 123"));
    }

    @Test
    void actualizarPerfilSinTokenDevuelve401() throws Exception {
        String body = objectMapper.writeValueAsString(Map.of("nombre", "X"));

        mockMvc.perform(put("/api/v1/auth/me")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isUnauthorized());
    }
}
