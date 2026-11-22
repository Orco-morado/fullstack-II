# Documento de Integración

**Proyecto:** Gas La Chispa — tienda online de gas doméstico  
**Asignatura:** DSY1104 Desarrollo Fullstack II — Evaluación Parcial 3  
**Documento:** Integración frontend, backend y base de datos  
**Fecha:** noviembre 2026

---

## 1. Introducción

Gas La Chispa es una aplicación full stack para la venta y distribución de gas doméstico. La solución integra una SPA desarrollada en React con una API REST en Spring Boot y una base de datos MySQL. El objetivo de este documento es describir cómo se conectan las capas, qué contratos se usan, cómo se protege la información y qué evidencia respalda el funcionamiento conjunto.

La EP3 consolida el backend real y reemplaza la fuente de datos simulada del frontend por llamadas HTTP a la API. El modo local se conserva únicamente para pruebas automatizadas y para el arranque sin backend.

## 2. Objetivos

- Documentar la arquitectura de la solución y la responsabilidad de cada capa.
- Describir el modelo de datos y las decisiones de persistencia.
- Presentar el contrato REST, los códigos de respuesta y el esquema de seguridad.
- Explicar cómo el frontend consume la API, gestiona la sesión y resuelve los permisos por rol.
- Registrar las pruebas y verificaciones que demuestran la integración.

## 3. Alcance del sistema

| Módulo | Funcionalidad |
|---|---|
| Tienda | Catálogo, búsqueda, detalle, categorías, ofertas y blogs |
| Carrito y checkout | Carrito persistente, validación de stock, creación de pedido y estados de pago |
| Autenticación | Login, registro de clientes, renovación de token, perfil y cambio de contraseña |
| Administración | Productos, categorías, ofertas, blogs, usuarios, pedidos, reportes y perfil |
| Vendedor | Consulta de catálogo y pedidos en modo lectura |
| Repartidor | Consulta de pedidos asignados y avance de estado |
| Documentación | Swagger UI y OpenAPI JSON |

Quedan fuera del alcance de esta entrega el despliegue en la nube, la rotación de refresh tokens, las migraciones formales de base de datos y las pruebas E2E con navegador real.

## 4. Arquitectura de la solución

```text
Navegador
  |
  | React 19 + React Router 6 + Bootstrap 5
  v
Frontend SPA (:3000)
  |
  | fetch HTTP/JSON + Bearer JWT
  v
Spring Security (filtro JWT, CORS, autorización)
  |
  v
API REST Spring Boot (:8081) -> Controllers -> Services -> Repositories
  |
  v
MySQL 8 (:3307 en Docker)
```

### 4.1 Capas del backend

| Capa | Responsabilidad |
|---|---|
| `security` | Validación del token, carga del usuario, autenticación stateless y respuestas 401/403 |
| `controller` | Expone los endpoints REST, valida permisos y documenta con Swagger |
| `service` | Reglas de negocio: stock, precios, estados de pedido, usuarios y autenticación |
| `repository` | Acceso a datos con Spring Data JPA |
| `config` | Seguridad, CORS, OpenAPI y carga de datos de demostración |
| `common` | Manejo global de errores y formato uniforme de respuesta |

### 4.2 Capas del frontend

| Capa | Responsabilidad |
|---|---|
| `pages/` | Vistas de tienda, administración, vendedor y repartidor |
| `components/` | Navegación, rutas protegidas, tarjetas y badges |
| `context/` | Sesión, carrito y datos compartidos |
| `api.js` | Cliente HTTP centralizado, tokens, errores y evento de sesión expirada |
| `data/db.js` | Fuente local usada solo en pruebas y en el modo sin backend |
| `utils/ofertas.js` | Vigencia, formato de fecha y cálculo de precio final |

### 4.3 Flujo de una petición

1. El usuario interactúa con una página React.
2. La página invoca una función de `DataContext` o `AuthContext`.
3. El contexto llama a `api.js`, que agrega el token y serializa el cuerpo JSON.
4. Spring Security valida el token y los permisos del endpoint.
5. El controlador delega en el servicio y este aplica las reglas de negocio.
6. El repositorio lee o escribe en MySQL.
7. La respuesta JSON vuelve al frontend y actualiza el estado de React.

## 5. Tecnologías y entorno de ejecución

| Capa | Tecnología | Versión |
|---|---|---|
| Frontend | React | 19 |
| Frontend | react-router-dom | 6.30 |
| Frontend | Bootstrap / react-bootstrap | 5.3 / 2.10 |
| Backend | Java | 17 |
| Backend | Spring Boot | 3.4.5 |
| Backend | Spring Security, Data JPA, Validation | Incluidas en Spring Boot |
| Backend | Springdoc OpenAPI | 2.8.9 |
| Backend | JJWT | 0.12.6 |
| Base de datos | MySQL | 8.0 |
| Pruebas backend | JUnit 5, MockMvc, H2 | Incluidas en Spring Boot |
| Pruebas frontend | Jest, React Testing Library, Jasmine, Karma | Según `package.json` |

### 5.1 Puesta en marcha local

```powershell
# 1. Base de datos
cd backend
docker compose up -d

# 2. Backend
.\mvnw.cmd spring-boot:run

# 3. Frontend
cd ..\frontend
npm install
npm start
```

Servicios:

- Frontend: `http://localhost:3000`
- API: `http://localhost:8081/api/v1`
- Health: `http://localhost:8081/api/v1/health`
- Swagger UI: `http://localhost:8081/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8081/v3/api-docs`

### 5.2 Configuración relevante

| Archivo | Configuración |
|---|---|
| `backend/src/main/resources/application.yml` | Puerto 8081, MySQL en 3307, JWT de 8 horas, CORS para `localhost:3000`, rutas de Swagger |
| `backend/docker-compose.yml` | MySQL 8.0, base `gaslachispa`, usuario `gasla`, volumen persistente |
| `frontend/src/api.js` | URL base por `REACT_APP_API_URL` o `http://localhost:8081/api/v1` |
| `frontend/.env.local` | URL alternativa de la API para desarrollo |

## 6. Modelo de datos

La base `gaslachispa` usa seis tablas. Los identificadores son cadenas legibles (`U-001`, `VOL-011`, `GC-100001`, etc.) para facilitar la trazabilidad entre frontend, backend y datos de demostración.

### 6.1 Usuarios (`usuarios`)

| Campo | Tipo | Regla |
|---|---|---|
| `id` | String(20) | Clave primaria |
| `run` | String(20) | Único |
| `nombre` | String(200) | Obligatorio |
| `email` | String(120) | Obligatorio y único |
| `password` | String(100) | Hash BCrypt, no se serializa al cliente |
| `telefono` | String(40) | Opcional |
| `rol` | String(30) | Administrador, Operadora, Vendedor, Repartidor o Cliente |
| `estado` | String(20) | `activo` o `inactivo` |
| `comuna` | String(60) | Opcional |
| `direccion` | String(300) | Opcional |
| `creado_en` | String(40) | Fecha ISO-8601 |

### 6.2 Productos (`productos`)

| Campo | Tipo | Regla |
|---|---|---|
| `id` | String(20) | Clave primaria |
| `nombre` | String(150) | Obligatorio |
| `categoria` | String(60) | Nombre de la categoría |
| `peso` | Integer | Opcional |
| `precio` | Integer | Precio base en pesos |
| `stock` | Integer | Obligatorio |
| `imagen` | String(1000) | URL externa |
| `descripcion` | String(500) | Opcional |
| `activo` | Boolean | Visible en tienda |
| `precioFinal` | Integer | Campo transitorio calculado, no persistido |

### 6.3 Categorías (`categorias`)

| Campo | Tipo | Regla |
|---|---|---|
| `id` | String(20) | Clave primaria |
| `nombre` | String(120) | Obligatorio |
| `descripcion` | String(300) | Opcional |
| `activo` | Boolean | Visible en tienda |

### 6.4 Pedidos (`pedidos`)

| Campo | Tipo | Regla |
|---|---|---|
| `id` | String(20) | Clave primaria |
| `clienteId` | String(20) | Referencia lógica al usuario |
| `cliente` | String(200) | Nombre al momento de la compra |
| `fono` | String(40) | Teléfono de contacto |
| `comuna` | String(60) | Obligatorio |
| `direccion` | String(300) | Obligatorio |
| `productoId` | String(20) | Referencia lógica al producto |
| `producto` | String(150) | Nombre al momento de la compra |
| `cantidad` | Integer | Mayor a cero |
| `total` | Integer | Calculado en el servidor |
| `estado` | String(30) | `recibido`, `asignado`, `camino` o `entregado` |
| `repartidor` | String(200) | Nombre del repartidor asignado |
| `pago` | String(30) | `efectivo` o `transferencia` |
| `fecha` | String(40) | Fecha ISO-8601 |

### 6.5 Ofertas (`ofertas`)

| Campo | Tipo | Regla |
|---|---|---|
| `id` | String(20) | Clave primaria |
| `titulo` | String(200) | Obligatorio |
| `descripcion` | String(500) | Opcional |
| `productoId` | String(20) | Producto asociado; puede ser nulo |
| `descuento` | Integer | Porcentaje entre 0 y 100 |
| `activo` | Boolean | Visible y aplicable |
| `imagen` | String(1000) | URL externa |
| `vigencia` | String(40) | Fecha `YYYY-MM-DD` inclusive |

### 6.6 Blogs (`blogs`)

| Campo | Tipo | Regla |
|---|---|---|
| `id` | String(20) | Clave primaria |
| `titulo` | String(200) | Obligatorio |
| `categoria` | String(60) | Obligatorio |
| `fecha` | String(40) | Obligatorio |
| `resumen` | String(500) | Opcional |
| `contenido` | String(4000) | Opcional |
| `autor` | String(150) | Opcional |
| `activo` | Boolean | Visible en tienda |

### 6.7 Decisiones de persistencia

- No se usan claves foráneas JPA entre entidades: el frontend y los datos de demostración trabajan con referencias lógicas por identificador o nombre.
- El pedido guarda una copia del nombre y del total del producto para conservar el histórico aunque el catálogo cambie.
- `precioFinal` no se persiste: se calcula en cada respuesta a partir de las ofertas activas y vigentes.
- Los precios se almacenan como enteros en pesos chilenos para evitar errores de punto flotante.
- La contraseña se almacena con BCrypt y se excluye de la serialización JSON.

## 7. API REST, seguridad y documentación

### 7.1 Endpoints principales

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/v1/health` | Público | Estado de la API |
| POST | `/api/v1/auth/login` | Público | Login y token JWT |
| POST | `/api/v1/auth/registro` | Público | Registro de Cliente |
| POST | `/api/v1/auth/refresh` | JWT | Renueva el token |
| GET | `/api/v1/auth/me` | JWT | Datos de la sesión |
| PUT | `/api/v1/auth/me` | JWT | Actualiza el perfil |
| PUT | `/api/v1/auth/password` | JWT | Cambia la contraseña |
| GET | `/api/v1/productos` | Público | Lista productos con `precioFinal` |
| GET | `/api/v1/productos/{id}` | Público | Detalle de producto |
| POST/PUT/DELETE | `/api/v1/productos` | Administrador u Operadora | Administración de productos |
| GET | `/api/v1/categorias` | Público | Lista categorías |
| GET | `/api/v1/categorias/{id}` | Público | Detalle de categoría |
| POST/PUT/DELETE | `/api/v1/categorias` | Administrador u Operadora | Administración de categorías |
| GET | `/api/v1/ofertas` | Público | Lista ofertas |
| GET | `/api/v1/ofertas/{id}` | Público | Detalle de oferta |
| POST/PUT/DELETE | `/api/v1/ofertas` | Administrador u Operadora | Administración de ofertas |
| GET | `/api/v1/blogs` | Público | Lista publicaciones |
| GET | `/api/v1/blogs/{id}` | Público | Detalle de publicación |
| POST/PUT/DELETE | `/api/v1/blogs` | Administrador u Operadora | Administración de blogs |
| GET | `/api/v1/usuarios` | Administrador u Operadora | Lista usuarios |
| GET | `/api/v1/usuarios/{id}` | Administrador u Operadora | Detalle de usuario |
| GET | `/api/v1/usuarios/rol/{rol}` | Administrador u Operadora | Usuarios por rol |
| POST/PUT/DELETE | `/api/v1/usuarios` | Administrador u Operadora | Administración de usuarios |
| GET | `/api/v1/pedidos` | JWT | Pedidos filtrados por rol |
| GET | `/api/v1/pedidos/{id}` | JWT | Detalle con control de acceso |
| GET | `/api/v1/pedidos/estado/{estado}` | JWT | Pedidos por estado |
| POST | `/api/v1/pedidos` | Cliente, Administrador u Operadora | Crea pedido y descuenta stock |
| PUT | `/api/v1/pedidos/{id}` | Administrador u Operadora | Edita pedido o asigna repartidor |
| PUT | `/api/v1/pedidos/{id}/estado` | Administrador, Operadora o Repartidor asignado | Avanza el estado |
| DELETE | `/api/v1/pedidos/{id}` | Administrador u Operadora | Elimina y repone stock si corresponde |

### 7.2 Códigos de respuesta

| Código | Uso |
|---|---|
| 200 | Consulta o actualización correcta |
| 201 | Recurso creado |
| 204 | Eliminación o cambio de contraseña sin cuerpo |
| 400 | Datos inválidos, stock insuficiente o transición de estado no permitida |
| 401 | Token ausente, inválido, expirado o usuario inactivo |
| 403 | Autenticado sin permisos suficientes |
| 404 | Recurso no encontrado |
| 409 | Correo, RUN o identificador duplicado |

Los errores usan el formato uniforme:

```json
{
  "status": 403,
  "error": "Acceso denegado",
  "message": "No tienes permisos para realizar esta acción."
}
```

### 7.3 Seguridad

- Autenticación **stateless** con JWT firmado por HMAC; el token incluye email, id y rol, y expira a las 8 horas.
- Contraseñas con BCrypt.
- El filtro JWT solo autentica si el token es válido y el usuario está `activo`.
- Un usuario inactivo recibe `403` al intentar iniciar sesión y `401` al intentar renovar el token o usar un token previo.
- Autorización por ruta en `SecurityConfig` y por método con `@PreAuthorize`.
- La Operadora puede administrar el sistema, pero no puede crear, editar, eliminar ni promover usuarios con rol Administrador.
- El Repartidor solo puede ver y avanzar sus propios pedidos asignados.
- El Vendedor solo consulta catálogo y pedidos.
- CORS restringido a `http://localhost:3000` por configuración.
- Swagger y OpenAPI quedan públicos para revisión académica.

### 7.4 Documentación OpenAPI

La API se documenta con Springdoc:

- `@Tag` identifica cada módulo.
- `@Operation` describe cada endpoint.
- `@ApiResponses` y `@ApiResponse` declaran los códigos posibles.
- `@SecurityRequirement(name = "bearerAuth")` marca los endpoints protegidos.

Swagger UI: `http://localhost:8081/swagger-ui.html`  
OpenAPI JSON: `http://localhost:8081/v3/api-docs`

## 8. Integración frontend-backend

### 8.1 Cliente HTTP

`frontend/src/api.js` centraliza la comunicación:

- `API_BASE` toma `REACT_APP_API_URL` o usa `http://localhost:8081/api/v1`.
- `request()` agrega `Content-Type: application/json` y `Authorization: Bearer <token>`.
- Las respuestas `204` se convierten en `null`.
- Los errores del backend se propagan con `status` y `message`.
- Un `401` en una petición autenticada dispara el evento `auth:expired`.
- `getToken()`, `setToken()` y `clearToken()` administran `localStorage` y `sessionStorage`.
- El código tolera la ausencia de `process` para funcionar en Jest, Karma y el navegador.

### 8.2 Sesión

`AuthContext` implementa:

1. Login contra `/auth/login` y almacenamiento del token según "recordarme".
2. Persistencia del usuario en `localStorage` o `sessionStorage`.
3. Renovación automática con `/auth/refresh` al recargar la aplicación.
4. Cierre de sesión y limpieza de almacenamiento al recibir `auth:expired`.
5. Redirección por rol mediante `homePathFor`.

### 8.3 Datos

`DataContext` carga:

- Productos, categorías, ofertas y blogs desde endpoints públicos.
- Pedidos solo con sesión iniciada.
- Usuarios solo para Administrador u Operadora.

Las mutaciones llaman a la API y luego refrescan el estado. En modo de prueba, las mismas operaciones se resuelven contra `data/db.js`.

### 8.4 Precios y ofertas

- El backend calcula `precioFinal` con la oferta activa y vigente de mayor descuento.
- La vigencia se evalúa con `LocalDate.now(ZoneId.of("America/Santiago"))`.
- El frontend compara fechas `YYYY-MM-DD` como strings, sin `new Date('YYYY-MM-DD')`, para evitar desfases UTC.
- El formulario administrativo muestra y guarda el precio base; el precio final es solo de vitrina y de pedido.
- El total del pedido se calcula en el servidor y se muestra en la pantalla de pago.

### 8.5 Permisos en la interfaz

- `ProtectedRoute` bloquea rutas por rol.
- La navegación muestra solo las opciones disponibles para la sesión.
- La Operadora no ve acciones de edición ni desactivación sobre usuarios Administradores.
- Los formularios de usuario filtran el rol Administrador cuando la sesión es de Operadora.
- El Vendedor no ve botones de compra ni acciones de administración.
- El Repartidor solo ve sus pedidos asignados.

### 8.6 Ejemplo de integración: checkout

1. El Cliente agrega productos al carrito.
2. `Checkout` valida los datos de entrega.
3. `DataContext.crearPedido` llama a `POST /api/v1/pedidos`.
4. El backend valida producto, stock y cantidad; calcula el total con `precioFinal`; descuenta stock y guarda el pedido.
5. El frontend recibe el pedido y navega a la pantalla de pago con el total del servidor.
6. La pantalla de éxito muestra la suma informada por el backend, no el total local del carrito.

## 9. Pruebas y validación de la integración

### 9.1 Backend

| Clase de prueba | Tests |
|---|---:|
| `ApiApplicationTests` | 1 |
| `AuthControllerTest` | 15 |
| `AuthServiceTest` | 1 |
| `PedidosControllerTest` | 24 |
| `PrecioServiceTest` | 1 |
| `ProductosControllerTest` | 14 |
| `UsuariosControllerTest` | 17 |
| **Total** | **73** |

Cobertura funcional principal:

- Login, registro, refresh, perfil y cambio de contraseña.
- Bloqueo de usuarios inactivos.
- CRUD de productos con precio final.
- Creación de pedidos con descuento, stock y total en servidor.
- Transiciones de estado y asignación de repartidor.
- Permisos de Administrador, Operadora, Vendedor, Repartidor y Cliente.
- Restricción de la Operadora sobre usuarios Administradores.

Las pruebas usan `MockMvc`, H2 en memoria y `@Transactional` para aislar cada caso.

### 9.2 Frontend

| Corredor | Resultado |
|---|---|
| Jest + React Testing Library | 117 tests en 18 suites |
| Jasmine + Karma | 117 tests, TOTAL: 117 SUCCESS |
| Cobertura Jest | 58.05% statements, 55.96% branches, 52.53% functions, 60.52% lines |

La suite cubre tienda, carrito, checkout, login, rutas protegidas, panel administrativo, usuarios, ofertas, pedidos, reportes, vendedor y cliente HTTP. El detalle está en `documentos/Cobertura_de_Testing.md`.

### 9.3 Comandos de verificación

```powershell
cd backend
.\mvnw.cmd test

cd ..\frontend
npm run test:jest
npm run test:jasmine
npm run test:coverage
npm run build
```

### 9.4 Verificación manual sugerida

1. Iniciar MySQL, backend y frontend.
2. Entrar como Cliente y completar una compra con un producto en oferta.
3. Verificar que el total del pedido use el precio final.
4. Entrar como Administrador y revisar el pedido, el stock y el reporte.
5. Entrar como Operadora e intentar editar un Administrador: debe recibir `403`.
6. Entrar como Vendedor y confirmar el modo solo lectura.
7. Entrar como Repartidor y avanzar un pedido asignado.
8. Intentar login con `lucia@gmail.com`: debe recibir `403` por estar inactiva.
9. Abrir Swagger y revisar los endpoints y esquemas.

## 10. Conclusiones, limitaciones y trabajo futuro

### 10.1 Conclusiones

- La SPA consume la API real y mantiene un modo local solo para pruebas.
- La autenticación JWT, los permisos por rol y el bloqueo de inactivos funcionan de extremo a extremo.
- El cálculo de precios con ofertas se resuelve en el backend y se refleja en el frontend.
- La Operadora queda limitada en la gestión de Administradores, tanto en API como en interfaz.
- Swagger documenta los endpoints y sus respuestas.
- La integración está respaldada por 73 pruebas de backend y 117 pruebas de frontend en dos corredores.

### 10.2 Limitaciones

- Las pruebas de backend usan H2, no MySQL real; pueden existir diferencias menores de SQL.
- No hay migraciones formales; Hibernate usa `ddl-auto: update`.
- No se implementó rotación de refresh tokens ni revocación centralizada.
- No hay pruebas E2E con navegador real ni despliegue en nube.
- El modelo usa referencias lógicas sin claves foráneas.
- Algunas vistas del frontend siguen sin cobertura completa (blogs, registro, perfil, repartidor).
- Las imágenes de productos y ofertas dependen de URLs externas.

### 10.3 Trabajo futuro

- Incorporar Flyway o Liquibase para migraciones versionadas.
- Agregar pruebas E2E con Playwright o Cypress.
- Implementar refresh tokens rotativos y revocación.
- Migrar a DTOs para desacoplar entidades de la API.
- Agregar claves foráneas y validaciones de integridad en la base.
- Desplegar frontend, backend y base de datos en un entorno cloud.
- Completar la cobertura de las vistas restantes y de los flujos de administración de pedidos.
- Incorporar observabilidad: logs estructurados, métricas y health checks ampliados.

## Referencias

- `README.md` del repositorio.
- `documentos/Cobertura_de_Testing.md`.
- `documentos/ERS_V2_Planilla_de_Requerimientos_GasLaChispa.xlsx`.
- Swagger UI: `http://localhost:8081/swagger-ui.html`.
