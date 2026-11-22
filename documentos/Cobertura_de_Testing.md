# Documento de Cobertura de Testing

**Proyecto:** Gas La Chispa — tienda online de gas doméstico  
**Asignatura:** DSY1104 Desarrollo Fullstack II — Evaluación Parcial 3  
**Entregable:** Documento de cobertura de testing del frontend  
**Fecha:** noviembre 2026

---

## 1. Objetivo

Documentar el proceso de testeo del frontend React de Gas La Chispa: configuración de las herramientas, diseño de las pruebas, mocks y aislamiento, resultados de ejecución y cobertura alcanzada, como evidencia de los criterios de testing de la EP3.

## 2. Estrategia de pruebas

| Aspecto | Decisión |
|---|---|
| Nivel | Pruebas unitarias y de componente (React Testing Library + Jasmine) |
| Alcance | Tienda, carrito, checkout, autenticación, control de acceso, panel administrativo, panel del vendedor, pedidos, reportes, ofertas y cliente HTTP |
| Tipos cubiertos | Renderizado de listas, renderizado condicional, props, estado y eventos, lógica pura, CRUD y comportamiento de rutas |
| Doble corredor | **Jest + @testing-library/react** como corredor principal y **Jasmine + Karma** como segundo corredor, con la misma suite de specs |
| Red | Ninguna prueba depende de red: los datos vienen de `src/data/db.js`, el estado se siembra en `localStorage` y el cliente HTTP usa un `fetch` simulado |

Los specs se escriben con un subconjunto de matchers compatible con ambos runners (`toBe`, `toEqual`, `toBeNull`, `toBeTruthy`, `toBeGreaterThan`) y sin `jest.fn()`, de modo que **el mismo archivo corre sin cambios en Jest y en Jasmine**.

## 3. Proceso de testeo: configuración

### 3.1 Corredor principal — Jest (via react-scripts)

- Jest viene con create-react-app; arranque de entorno en `src/setupTests.js`.
- Comandos:
  - `npm run test` / `npm run test:jest` → `react-scripts test --watchAll=false`
  - `npm run test:coverage` → `react-scripts test --watchAll=false --coverage`
- Librería: `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`.

### 3.2 Segundo corredor — Jasmine + Karma

Archivos de configuración:

- **`karma.conf.js`**
  - `frameworks: ['jasmine']`
  - `plugins`: `karma-jasmine`, `karma-jsdom-launcher`, `karma-webpack`
  - `browsers: ['jsdom']` (entorno de navegador simulado, sin navegador real)
  - `preprocessors`: los specs se empaquetan con **webpack + babel-loader** (`@babel/preset-env` + `@babel/preset-react` con `runtime: 'automatic'`) para soportar JSX y módulos modernos
  - `files: ['src/**/*.test.js']`, `singleRun: true` (una corrida, ideal para CI)
- **`src/setupKarma.js`**: define `window.IS_REACT_ACT_ENVIRONMENT = true` para que React actúe fuera de `act()` de Jest.
- Comando: `npm run test:jasmine`
- Nota: `App.test.js` usa `window.history.replaceState({}, '', '/')` porque en Karma la URL base es `/context.html`, distinta de Jest (`/`).

### 3.3 Correcciones de compatibilidad aplicadas en la EP3

- `src/api.js` ya no asume que `process` existe: usa `typeof process !== 'undefined'` antes de leer `process.env` y detecta Karma con `window.__karma__`. Así el mismo archivo funciona en Jest, Karma y el build de producción.
- `src/tests/api.test.js` reemplazó `jest.fn()` y los matchers exclusivos de Jest por un mock manual de `fetch` y aserciones comunes, por lo que la suite del cliente HTTP también corre en Jasmine.

### 3.4 Scripts definidos en `package.json`

| Script | Qué ejecuta |
|---|---|
| `npm test` | Jest en modo corrida única |
| `npm run test:jest` | Jest (`--watchAll=false`) |
| `npm run test:jasmine` | Karma + Jasmine |
| `npm run test:coverage` | Jest con reporte de cobertura |
| `npm run test:all` | Ambos corredores en secuencia |

### 3.5 Restricción registrada

`react-router-dom` quedó en **v6**: el Jest 27 de react-scripts no resuelve los subpath exports de v7 (`react-router/dom`) y v7 exige `TextEncoder`, ausente en el jsdom de Jest 27. El router se configura con `future={{ v7_startTransition: true, v7_relativeSplatPath: true }}` para heredar el comportamiento v7.

## 4. Mocks y aislamiento

- **Estado aislado por test:** `clearStorage()` en `beforeEach` limpia `localStorage` (`gasLaChispaDB`, sesión y carrito) para que no haya fugas entre pruebas.
- **Semillas controladas:** helpers `seedSession(user)` y `seedCart(items)` siembran el estado exacto que el test necesita (por ejemplo, sesión de Administrador, Operadora o carrito con stock insuficiente).
- **Providers reales, no mocks del producto:** los tests envuelven la UI con `AuthProvider`, `CartProvider`, `DataProvider` y `MemoryRouter` (`renderWithProviders`); se prueba el código real y se aísla solo el entorno (storage y ruta).
- **Sin red:** la fuente de datos es local (`db.js`) y el único mock es un `fetch` simulado para `api.test.js`; no hay peticiones reales, timers ni websockets que desestabilicen la corrida.
- **Simulación de errores:** los flujos fallidos (pago rechazado, stock insuficiente, respuestas 401/409) se provocan con condiciones de datos o respuestas simuladas, sin servicios externos.

## 5. Catálogo de pruebas (117 pruebas, 18 suites)

| Archivo | Tests | Tipos de prueba | Qué verifica / funcionalidad cubierta |
|---|---:|---|---|
| `src/tests/ProductCard.test.js` | 5 | Props, renderizado condicional, lógica | Nombre, precio, imagen y categoría desde props; badge "Sin stock"; estado calculado; precio final con descuento y precio original; `onClick` agrega al carrito |
| `src/tests/Products.test.js` | 5 | Listas, estado, eventos, condicional | Lista de productos; búsqueda por texto; mensaje "no hay resultados"; ordenamiento; botón "Limpiar" restaura filtros |
| `src/tests/Contact.test.js` | 4 | Estado, eventos, condicional | Validación del formulario; envío correcto limpia campos y muestra confirmación |
| `src/tests/Cart.test.js` | 6 | Listas, eventos, condicional | Carrito vacío; aumentar/disminuir cantidad; eliminar ítem; vaciar carrito; totales correctos con precio final |
| `src/tests/Checkout.test.js` | 5 | Condicional, eventos, estado | Bloqueo con carrito vacío; validación de entrega; total con descuento; pantalla de pago correcto; pago rechazado |
| `src/tests/Login.test.js` | 6 | Estado, eventos, condicional | Credenciales inválidas; login por rol redirige a su panel (`homePathFor`); campos obligatorios |
| `src/tests/ProtectedRoute.test.js` | 3 | Comportamiento y condicional | Sin sesión redirige a `/login`; rol sin permiso redirige; rol autorizado renderiza la ruta |
| `src/tests/Admin.test.js` | 9 | Listas, condicional, estado, eventos | Tabla de productos y usuarios; pestaña "Críticos"; filtros; KPIs; Operadora no ve acciones sobre Administradores |
| `src/tests/db.test.js` | 10 | Lógica pura (CRUD) | Crear, leer, actualizar y borrar productos, categorías, usuarios y pedidos; autenticación; persistencia en `localStorage` |
| `src/tests/CategoryAdmin.test.js` | 9 | CRUD de formulario, condicional, eventos | Alta de categoría; nombre obligatorio; duplicados sin distinguir mayúsculas; `maxLength`; limpieza; cancelar |
| `src/tests/ProductAdmin.test.js` | 14 | CRUD de formulario, validación, eventos | Alta y edición de producto; campos requeridos; formato de código; switch de visibilidad; el formulario muestra y guarda el precio base, no el precio con descuento |
| `src/tests/UserAdmin.test.js` | 19 | CRUD de formulario, validación, eventos | Alta y edición de usuario; RUN, email, contraseña, roles, comuna y estado; Operadora no puede crear ni editar Administradores |
| `src/tests/Offers.test.js` | 3 | Lógica pura, renderizado condicional | Vigencia comparada por fecha local sin desfase UTC; formato `DD-MM-YYYY`; oculta ofertas vencidas |
| `src/tests/Orders.test.js` | 2 | Condicional, eventos | El vendedor no ve crear, asignar ni avanzar pedidos; apertura del detalle de un pedido |
| `src/tests/Reports.test.js` | 2 | Lógica, listas | Reporte muestra "recibido" y no "pendiente"; ventas agrupadas por categoría |
| `src/tests/Vendedor.test.js` | 6 | Listas, condicional, rutas | Métricas y pedidos del vendedor; navegación sin perfil ni carrito; catálogo sin botones de compra; detalle en modo consulta; permisos de ruta |
| `src/tests/api.test.js` | 8 | Lógica, eventos | Token en `localStorage`/`sessionStorage`; header `Authorization`; respuestas 204; errores con status y mensaje; evento `auth:expired` en 401 |
| `src/App.test.js` | 1 | Integración (smoke) | La SPA arranca, renderiza Home y navega al hacer clic en enlaces |

**Total: 117 pruebas en 18 suites — los 5 tipos requeridos, CRUD, control de acceso, ofertas, pedidos, reportes, panel del vendedor y cliente HTTP.**

### Uso de mocks

- No se mockea el código de la aplicación: se siembra `localStorage` y se usan providers reales (sección 4).
- El único doble de testeo es el entorno (storage, ruta y `fetch` en la suite del cliente HTTP).

## 6. Resultados de ejecución (corredores duales)

| Corredor | Comando | Resultado |
|---|---|---|
| Jest + React Testing Library | `npm run test:jest` | **117/117 pruebas OK, 18 suites** |
| Jasmine + Karma (jsdom) | `npm run test:jasmine` | **117/117 pruebas OK (TOTAL: 117 SUCCESS)** |
| Cobertura | `npm run test:coverage` | Reporte generado en `coverage/` |

Ambos corredores ejecutan la **misma suite** y ambos quedan en verde.

## 7. Cobertura de código (Jest, Istanbul)

### 7.1 Resumen global

| Métrica | Cobertura |
|---|---|
| Statements | **58.05%** |
| Branches | **55.96%** |
| Functions | **52.53%** |
| Lines | **60.52%** |

### 7.2 Por área (las de mayor cobertura primero)

| Archivo | % Stmts | Comentario |
|---|---:|---|
| `src/App.js` | 100 | Rutas y layout cubiertos por el smoke |
| `pages/Home.js` | 100 | Completa |
| `pages/Offers.js` | 100 | Ofertas vigentes y formato de fecha |
| `pages/PaymentSuccess.js` | 100 | Total del pedido desde el backend |
| `pages/vendedor/Panel.js` | 100 | Panel y pedidos del vendedor |
| `components/StatusBadge.js` | 100 | Estados de pedido |
| `pages/admin/Dashboard.js` | 100 | KPIs |
| `pages/admin/Reports.js` | 96.77 | Reportes y agrupación por categoría |
| `pages/Contact.js` | 93.93 | Formulario y validaciones |
| `pages/admin/UserNew.js` | 92.85 | Alta de usuario y roles filtrados |
| `pages/admin/UserEdit.js` | 92.59 | Edición de usuario y bloqueo de Administradores |
| `pages/admin/ProductNew.js` | 91.89 | Alta de producto con precio base |
| `pages/Checkout.js` | 91.37 | Flujo completo de compra y total con descuento |
| `src/api.js` | 90.9 | Cliente HTTP, tokens y errores |
| `pages/Cart.js` | 90 | Carrito con precio final |
| `src/utils/ofertas.js` | 89.47 | Vigencia y precio final |
| `components/ProtectedRoute.js` | 88.88 | Control de acceso |
| `pages/admin/ProductEdit.js` | 88.37 | Edición con precio base |
| `components/ProductCard.js` | 87.5 | Props, stock y descuento |
| `pages/admin/CategoryNew.js` | 87.5 | Alta de categoría |
| `components/Navigation.js` | 80 | Menú por sesión y rol |
| `pages/admin/Products.js` | 80 | Lista, críticos y filtros |
| `pages/Products.js` | 78.78 | Tienda, búsqueda y orden |
| `pages/admin/Users.js` | 78.26 | Lista, filtros y permisos de Operadora |
| `pages/Login.js` | 75.6 | Sesión y errores |
| `context/CartContext.js` | 72.5 | Lógica de carrito |
| `pages/ProductDetail.js` | 62.5 | Detalle parcialmente cubierto |
| `data/db.js` | 55.43 | CRUD probado en su núcleo (10 tests) |
| `context/DataContext.js` | 41.48 | Carga y persistencia parcial |
| `context/AuthContext.js` | 39.66 | Sesión parcial |
| `pages/admin/Orders.js` | 26.13 | Detalle cubierto; acciones administrativas sin cobertura |
| `pages/Register.js` | 3.63 | Sin cobertura relevante |
| `pages/Blog.js`, `pages/BlogPost.js`, `pages/Categories.js` | 0 | Sin cobertura |
| `pages/admin/Profile.js`, `pages/admin/UserHistory.js` | 0 | Sin cobertura |
| `pages/repartidor/Panel.js` | 0 | Sin cobertura |

### 7.3 Cobertura de funcionalidades principales

- Cubierto: catálogo y búsqueda de productos.
- Cubierto: carrito de compras con precio final.
- Cubierto: checkout, total con descuento y estados de pago.
- Cubierto: autenticación, roles y control de acceso.
- Cubierto: panel administrativo de productos, usuarios y dashboard.
- Cubierto: CRUD de productos, usuarios y categorías desde formularios.
- Cubierto: CRUD de la fuente de datos simulada.
- Cubierto: ruteo, 404 y smoke de la SPA.
- Cubierto: ofertas vigentes, formato de fecha y cálculo de precio final.
- Cubierto: panel y pedidos del vendedor en modo consulta.
- Cubierto: reportes y detalle de pedidos.
- Parcial: detalle de producto, administración de pedidos, autenticación y carga de datos.
- Sin cobertura: Blogs, BlogPost, listado de categorías, Registro, Perfil, historial de usuario y panel del repartidor.

### 7.4 Plan de ampliación

La suite prioriza las funcionalidades principales del flujo de compra y de operación. Para subir la cobertura global se recomienda, en orden:

1. Specs de `repartidor/Panel.js` y de las acciones restantes de `admin/Orders.js`.
2. Specs de `Register`, `Profile` y `UserHistory`.
3. Specs de `Blog`, `BlogPost` y `Categories`.
4. Completar `ProductDetail` y los flujos restantes de `AuthContext` y `DataContext`.

## 8. Trazabilidad con la rúbrica

| Criterio | Evidencia en este documento |
|---|---|
| Pruebas unitarias con Jasmine y Karma | Sección 5 (catálogo de 117 pruebas) y sección 6 (Karma/Jasmine en verde: 117/117) |
| Proceso de testeo: configuración, mocks y cobertura | Sección 3 (configuración de ambos corredores y correcciones de compatibilidad), sección 4 (mocks y aislamiento) y sección 7 (cobertura) |
| Demostración en vivo | `npm run test:jasmine` y `npm run test:coverage` |

## 9. Cómo reproducir

```bash
cd frontend
npm install
npm run test:jest        # corredor principal (Jest)
npm run test:jasmine     # corredor alternativo (Karma + Jasmine)
npm run test:coverage    # reporte de cobertura en coverage/
```
