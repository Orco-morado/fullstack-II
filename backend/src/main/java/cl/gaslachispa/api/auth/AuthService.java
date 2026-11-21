package cl.gaslachispa.api.auth;

import java.time.Instant;
import java.util.Locale;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import cl.gaslachispa.api.security.JwtService;
import cl.gaslachispa.api.usuario.Usuario;
import cl.gaslachispa.api.usuario.UsuarioRepository;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(AuthenticationManager authenticationManager, UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        Usuario usuario = findByEmail(authentication.getName());
        return new LoginResponse(jwtService.generateToken(usuario), usuario);
    }

    public LoginResponse refresh(Authentication authentication) {
        Usuario usuario = me(authentication);
        return new LoginResponse(jwtService.generateToken(usuario), usuario);
    }

    public LoginResponse registro(RegistroRequest request) {
        if (usuarioRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El correo ya está registrado.");
        }
        if (usuarioRepository.existsByRun(request.getRun())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El RUN ya está registrado.");
        }

        Usuario usuario = new Usuario();
        usuario.setId(nextUserId());
        usuario.setRun(request.getRun());
        usuario.setNombre(request.getNombre());
        usuario.setEmail(request.getEmail());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setTelefono(request.getTelefono());
        usuario.setRol("Cliente");
        usuario.setEstado("activo");
        usuario.setComuna(request.getComuna());
        usuario.setDireccion(request.getDireccion());
        usuario.setCreadoEn(Instant.now().toString());
        usuarioRepository.save(usuario);

        return new LoginResponse(jwtService.generateToken(usuario), usuario);
    }

    public Usuario me(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No hay una sesión activa.");
        }
        return findByEmail(authentication.getName());
    }

    public Usuario actualizarPerfil(PerfilRequest request, Authentication authentication) {
        Usuario usuario = me(authentication);
        usuario.setNombre(request.getNombre());
        usuario.setTelefono(request.getTelefono());
        usuario.setComuna(request.getComuna());
        usuario.setDireccion(request.getDireccion());
        return usuarioRepository.save(usuario);
    }

    public void changePassword(PasswordRequest request, Authentication authentication) {
        Usuario usuario = me(authentication);
        if (!passwordEncoder.matches(request.getActual(), usuario.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La contraseña actual no coincide.");
        }
        usuario.setPassword(passwordEncoder.encode(request.getNueva()));
        usuarioRepository.save(usuario);
    }

    private Usuario findByEmail(String email) {
        return usuarioRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado."));
    }

    private String nextUserId() {
        int max = usuarioRepository.findAll().stream()
                .map(Usuario::getId)
                .filter(id -> id != null && id.startsWith("U-"))
                .map(id -> id.substring(2))
                .mapToInt(value -> {
                    try {
                        return Integer.parseInt(value);
                    } catch (NumberFormatException ex) {
                        return 0;
                    }
                })
                .max()
                .orElse(0);
        return String.format(Locale.ROOT, "U-%03d", max + 1);
    }
}
