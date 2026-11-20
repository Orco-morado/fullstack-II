package cl.gaslachispa.api.usuario;

import java.time.Instant;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UsuarioService {

    private static final Set<String> ROLES = Set.of(
            "Administrador", "Operadora", "Vendedor", "Repartidor", "Cliente");

    private static final Set<String> ESTADOS = Set.of("activo", "inactivo");

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Usuario> listar() {
        return usuarioRepository.findAll();
    }

    public Usuario obtener(String id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado."));
    }

    public List<Usuario> porRol(String rol) {
        return usuarioRepository.findByRolIgnoreCase(rol);
    }

    public Usuario crear(Usuario data) {
        require(data.getNombre(), "El nombre es requerido.");
        require(data.getEmail(), "El correo es requerido.");
        require(data.getRun(), "El RUN es requerido.");
        require(data.getPassword(), "La contraseña es requerida.");

        if (usuarioRepository.existsByEmailIgnoreCase(data.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El correo ya está registrado.");
        }
        if (usuarioRepository.existsByRun(data.getRun())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El RUN ya está registrado.");
        }

        if (data.getId() == null || data.getId().isBlank()) {
            data.setId(nextId());
        } else if (usuarioRepository.existsById(data.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El usuario ya existe.");
        }

        if (data.getRol() == null || data.getRol().isBlank()) {
            data.setRol("Cliente");
        }
        validarRol(data.getRol());

        if (data.getEstado() == null || data.getEstado().isBlank()) {
            data.setEstado("activo");
        }
        validarEstado(data.getEstado());

        if (data.getCreadoEn() == null || data.getCreadoEn().isBlank()) {
            data.setCreadoEn(Instant.now().toString());
        }

        data.setPassword(passwordEncoder.encode(data.getPassword()));
        return usuarioRepository.save(data);
    }

    public Usuario actualizar(String id, Usuario changes) {
        Usuario usuario = obtener(id);

        if (changes.getNombre() != null) {
            require(changes.getNombre(), "El nombre no puede estar vacío.");
            usuario.setNombre(changes.getNombre());
        }
        if (changes.getRun() != null && !changes.getRun().equals(usuario.getRun())) {
            require(changes.getRun(), "El RUN no puede estar vacío.");
            if (usuarioRepository.existsByRun(changes.getRun())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "El RUN ya está registrado.");
            }
            usuario.setRun(changes.getRun());
        }
        if (changes.getEmail() != null && !changes.getEmail().equalsIgnoreCase(usuario.getEmail())) {
            require(changes.getEmail(), "El correo no puede estar vacío.");
            if (usuarioRepository.existsByEmailIgnoreCase(changes.getEmail())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "El correo ya está registrado.");
            }
            usuario.setEmail(changes.getEmail());
        }
        if (changes.getTelefono() != null) {
            usuario.setTelefono(changes.getTelefono());
        }
        if (changes.getRol() != null) {
            validarRol(changes.getRol());
            usuario.setRol(changes.getRol());
        }
        if (changes.getEstado() != null) {
            validarEstado(changes.getEstado());
            usuario.setEstado(changes.getEstado());
        }
        if (changes.getComuna() != null) {
            usuario.setComuna(changes.getComuna());
        }
        if (changes.getDireccion() != null) {
            usuario.setDireccion(changes.getDireccion());
        }
        if (changes.getCreadoEn() != null) {
            usuario.setCreadoEn(changes.getCreadoEn());
        }
        if (changes.getPassword() != null && !changes.getPassword().isBlank()) {
            usuario.setPassword(passwordEncoder.encode(changes.getPassword()));
        }
        return usuarioRepository.save(usuario);
    }

    public void eliminar(String id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado.");
        }
        usuarioRepository.deleteById(id);
    }

    private void validarRol(String rol) {
        if (!ROLES.contains(rol)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rol inválido.");
        }
    }

    private void validarEstado(String estado) {
        if (!ESTADOS.contains(estado)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Estado inválido.");
        }
    }

    private void require(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
    }

    private String nextId() {
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
