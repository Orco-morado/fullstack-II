# Gas La Chispa - EP3 DSY1104

Aplicación full stack para la venta y distribución de gas doméstico. El proyecto integra una SPA en React con una API REST en Spring Boot, autenticación JWT, base de datos MySQL y permisos por rol.

Esta versión corresponde a la **Evaluación Parcial 3 (EP3)** e incluye el backend real, la integración del frontend con la API y los flujos de Cliente, Vendedor, Administrador, Operadora y Repartidor.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 19, react-router-dom 6, Bootstrap 5, react-bootstrap |
| Backend | Java 17, Spring Boot 3.4, Spring Security, Spring Data JPA |
| Base de datos | MySQL 8 en Docker |
| Autenticación | JWT con expiración de 8 horas y renovación mediante `POST /auth/refresh` |
| Documentación API | Springdoc OpenAPI / Swagger UI |
| Pruebas | JUnit + MockMvc (backend), Jest + React Testing Library (frontend) |

## Arquitectura

```text
Navegador (React :3000)
        |
        | HTTP + JWT
        v
API REST (Spring Boot :8081) ---> MySQL 8 (:3307 en Docker)
        |
        +--> Swagger UI: /swagger-ui.html
```

El frontend consume la API en `http://localhost:8081/api/v1` por defecto. La URL se puede cambiar con la variable `REACT_APP_API_URL`.

## Estructura del repositorio

```text
gas-la-chispa/
├── backend/                     API REST Spring Boot
│   ├── src/main/java/cl/gaslachispa/api/
│   │   ├── auth/                login, registro, refresh, perfil
│   │   ├── pedido/              pedidos, estados, asignación y stock
│   │   ├── producto/            catálogo y administración
│   │   ├── categoria/           categorías
│   │   ├── oferta/              ofertas
│   │   ├── blog/                publicaciones
│   │   ├── usuario/             usuarios y roles
│   │   ├── security/            filtro y servicio JWT
│   │   └── config/              seguridad, CORS, seed y OpenAPI
│   ├── src/main/resources/application.yml
│   ├── docker-compose.yml       MySQL 8 en el puerto 3307
│   └── pom.xml
├── frontend/                    SPA React
│   ├── src/
│   │   ├── components/          navegación, rutas protegidas, tarjetas
│   │   ├── context/             AuthContext, CartContext, DataContext
│   │   ├── pages/               tienda, admin/, vendedor/, repartidor/
│   │   ├── data/db.js           datos locales usados por Jest
│   │   └── tests/               pruebas con Jest
│   └── package.json
├── documentos/                  ERS y documentación de testing
└── vistas-estaticas/            prototipo HTML/CSS/JS de la EP1
```

## Requisitos

- Java 17
- Node.js 18 o superior
- npm 9 o superior
- Docker Desktop con el motor iniciado

## Puesta en marcha

### 1. Base de datos MySQL

Desde `backend/`:

```powershell
docker compose up -d
```

Esto inicia el contenedor **`db-gas-la-chispa`** con MySQL 8 en el puerto **3307**.

Verificar:

```powershell
docker ps
```

La primera vez se crea la base `gaslachispa` y el usuario `gasla`. Los datos quedan en el volumen `gaslachispa_mysql_data`.

### 2. Backend

Desde `backend/`:

```powershell
# Windows PowerShell
.\mvnw.cmd spring-boot:run
```

```bash
# Linux / macOS
./mvnw spring-boot:run
```

Servicios disponibles:

- API: `http://localhost:8081/api/v1`
- Health: `http://localhost:8081/api/v1/health`
- Swagger UI: `http://localhost:8081/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8081/v3/api-docs`

Al arrancar, `DataInitializer` carga usuarios, productos, pedidos, ofertas y blogs de demostración si la base está vacía.

### 3. Frontend

Desde `frontend/`:

```powershell
npm install
npm start
```

La aplicación queda disponible en `http://localhost:3000`.

Si la API se ejecuta en otra URL:

```powershell
$env:REACT_APP_API_URL="http://localhost:8081/api/v1"
npm start
```

También se puede crear `frontend/.env.local` con:

```env
REACT_APP_API_URL=http://localhost:8081/api/v1
```

## Usuarios de prueba

| Correo | Contraseña | Rol | Acceso |
|---|---|---|---|
| `admin@gmail.com` | `admin123` | Administrador | `/admin` |
| `operadora@gmail.com` | `oper1234` | Operadora | `/admin` |
| `vendedor@gmail.com` | `vendedor1` | Vendedor | `/vendedor` |
| `repartidor@gmail.com` | `repart123` | Repartidor | `/repartidor` |
| `cliente@gmail.com` | `cliente123` | Cliente | Tienda y checkout |
| `lucia@gmail.com` | `lucia1234` | Cliente inactivo | No puede iniciar sesión |

## Roles y permisos

| Rol | Puede hacer |
|---|---|
| **Administrador** | Gestionar productos, categorías, ofertas, blogs, usuarios y pedidos; asignar repartidores; cambiar estados; ver reportes y perfil. |
| **Operadora** | Mismas funciones operativas que el Administrador, excepto crear, editar o eliminar usuarios con rol Administrador. |
| **Vendedor** | Consultar el catálogo y la lista/detalle de pedidos en modo solo lectura. No puede editar productos, crear pedidos, asignar repartidores ni acceder a Perfil. |
| **Repartidor** | Ver únicamente sus pedidos asignados y avanzar el estado de `asignado` a `camino` y de `camino` a `entregado`. |
| **Cliente** | Comprar en la tienda, pagar y registrarse. La interfaz actual no expone historial ni edición de perfil para este rol. |

Rutas principales:

- Tienda: `/`, `/productos`, `/productos/:id`, `/carrito`, `/checkout`
- Administración: `/admin`, `/admin/pedidos`, `/admin/productos`, `/admin/usuarios`, `/admin/reportes`, `/admin/perfil`
- Vendedor: `/vendedor`, `/vendedor/pedidos`
- Repartidor: `/repartidor`

## Flujo de un pedido

1. El Cliente agrega productos al carrito y confirma el checkout.
2. El backend valida el producto, el stock y la cantidad; calcula el total en el servidor y descuenta stock.
3. El pedido nace en estado `recibido`.
4. El Administrador u Operadora asigna un repartidor y el pedido pasa a `asignado`.
5. El Repartidor lo marca `camino` y luego `entregado`.
6. El Administrador puede consultar el detalle, los reportes y el historial del cliente.

Estados permitidos: `recibido -> asignado -> camino -> entregado`. No se permiten saltos ni retrocesos.

## Precios y ofertas

El backend calcula el `precioFinal` de cada producto con la oferta activa y vigente de mayor descuento. Las ofertas vencidas o inactivas no modifican el precio. El total del pedido se calcula en el servidor con ese precio final, y el frontend muestra el precio original tachado cuando corresponde.

La vigencia se compara por fecha local en `America/Santiago`; no se usa `new Date('YYYY-MM-DD')` para evitar desfases de zona horaria.

## API principal

Base URL: `http://localhost:8081/api/v1`

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/health` | Público |
| POST | `/auth/login` | Público |
| POST | `/auth/registro` | Público; crea un Cliente |
| POST | `/auth/refresh` | JWT vigente; devuelve un token nuevo |
| GET | `/auth/me` | JWT |
| PUT | `/auth/me` | Administrador, Operadora, Cliente o Repartidor |
| PUT | `/auth/password` | Administrador, Operadora, Cliente o Repartidor |
| GET | `/productos`, `/categorias`, `/ofertas`, `/blogs` | Público |
| POST/PUT/DELETE | `/productos`, `/categorias`, `/ofertas`, `/blogs` | Administrador u Operadora |
| GET/POST/PUT/DELETE | `/usuarios` | Administrador u Operadora; la Operadora no puede gestionar Administradores |
| GET | `/pedidos`, `/pedidos/{id}`, `/pedidos/estado/{estado}` | JWT; el resultado se filtra según el rol |
| POST | `/pedidos` | Cliente, Administrador u Operadora |
| PUT | `/pedidos/{id}` | Administrador u Operadora |
| PUT | `/pedidos/{id}/estado` | Administrador, Operadora o Repartidor asignado |
| DELETE | `/pedidos/{id}` | Administrador u Operadora |

La referencia completa, con esquemas de entrada y salida, está en Swagger UI.

## Autenticación JWT

1. `POST /auth/login` recibe `email` y `password` y devuelve:

```json
{
  "token": "eyJ...",
  "usuario": {
    "id": "U-001",
    "nombre": "Ana García",
    "email": "admin@gmail.com",
    "rol": "Administrador",
    "estado": "activo"
  }
}
```

2. El frontend guarda el token en `localStorage` o `sessionStorage` según la opción "recordarme".
3. Cada solicitud protegida envía `Authorization: Bearer <token>`.
4. Al recargar la aplicación, el frontend llama a `POST /auth/refresh` para renovar el token y recuperar la sesión.
5. Si una solicitud autenticada responde `401`, el frontend limpia la sesión y redirige al login.

El token expira a las 8 horas. La renovación es explícita y requiere un token vigente; no se persiste un refresh token separado. Los usuarios con estado `inactivo` no pueden iniciar sesión (`403`) ni renovar el token (`401`).

## Pruebas

Backend:

```powershell
cd backend
.\mvnw.cmd test
```

Resultado de referencia: **73 pruebas OK**.

Frontend:

```powershell
cd frontend
npm run test:jest
npm run test:jasmine
```

Resultado de referencia: **117 pruebas OK en 18 suites** en Jest y **117 SUCCESS** en Jasmine + Karma.

Compilación de producción:

```powershell
cd frontend
npm run build
```

Las pruebas del frontend usan el modo local de `src/data/db.js` para no depender de la API durante Jest y Karma. En desarrollo y producción el frontend consume la API real.

## Datos de demostración

El backend carga automáticamente:

- 6 usuarios con los roles del sistema.
- 5 categorías y 7 productos.
- 4 pedidos en distintos estados.
- 3 ofertas y 4 publicaciones de blog.

Para reiniciar la base desde cero:

```powershell
cd backend
docker compose down -v
docker compose up -d
```

Advertencia: `down -v` elimina el volumen y todos los datos guardados.

## Solución de problemas

- **Docker no inicia:** abrir Docker Desktop y esperar a que el motor esté activo antes de ejecutar `docker compose up -d`.
- **El contenedor no aparece:** verificar con `docker ps` que exista `db-gas-la-chispa` y que el puerto `3307` esté publicado.
- **Puerto ocupado:** cambiar el puerto en `backend/docker-compose.yml` y en `backend/src/main/resources/application.yml`.
- **El frontend no conecta:** confirmar que el backend responde en `http://localhost:8081/api/v1/health` y que `REACT_APP_API_URL` apunta a esa base.
- **Error de CORS:** el backend permite `http://localhost:3000` por defecto; si el frontend usa otro puerto, ajustar `app.cors.allowed-origins`.
- **Login fallido:** verificar que la base tenga los usuarios seed y que el backend haya arrancado sin errores.

## Documentación

- `documentos/ERS_V2_Planilla_de_Requerimientos_GasLaChispa.xlsx`: planilla de requerimientos.
- `documentos/Cobertura_de_Testing.md`: cobertura y criterios de pruebas.
- `vistas-estaticas/`: prototipo original de la EP1, conservado como referencia.

## Notas

- Proyecto académico de DSY1104.
- Las credenciales y la clave JWT incluidas son locales y de demostración; deben reemplazarse antes de un despliegue real.
- El backend usa `ddl-auto: update` para facilitar el desarrollo. En producción se recomienda un esquema gestionado con migraciones.
