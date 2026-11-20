package cl.gaslachispa.api.auth;

import cl.gaslachispa.api.usuario.Usuario;

public record LoginResponse(String token, Usuario usuario) {
}
