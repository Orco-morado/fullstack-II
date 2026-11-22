package cl.gaslachispa.api.auth;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.server.ResponseStatusException;

import cl.gaslachispa.api.support.ApiTestSupport;
import cl.gaslachispa.api.usuario.Usuario;
import cl.gaslachispa.api.usuario.UsuarioRepository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class AuthServiceTest extends ApiTestSupport {

    @Autowired
    private AuthService authService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Test
    void refreshRechazaUsuarioInactivo() {
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase("cliente@gmail.com").orElseThrow();
        usuario.setEstado("inactivo");
        usuarioRepository.saveAndFlush(usuario);

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                "cliente@gmail.com", null, List.of());

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> authService.refresh(authentication));

        assertEquals(HttpStatus.FORBIDDEN, exception.getStatusCode());
    }
}
