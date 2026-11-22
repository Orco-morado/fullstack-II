package cl.gaslachispa.api.common;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Salud", description = "Estado de disponibilidad de la API")
public class HealthController {

    @GetMapping("/health")
    @Operation(summary = "Consultar salud", description = "Devuelve el estado básico de la API.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "API disponible")
    })
    public Map<String, Object> health() {
        return Map.of(
                "status", "ok",
                "service", "gas-la-chispa-api",
                "version", "v1");
    }
}
