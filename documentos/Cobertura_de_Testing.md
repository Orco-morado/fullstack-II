# Documento de Cobertura de Testing

**Proyecto:** Gas La Chispa — tienda online de gas doméstico  
**Asignatura:** DSY1104 Desarrollo Fullstack II — Evaluación Parcial 2  
**Entregable:** Documento de cobertura de testing (Situación evaluativa 1, indicadores IE2.2.1 e IE2.3.1)  
**Fecha:** octubre 2026

---

## 1. Objetivo

Documentar el proceso de testeo del frontend React de Gas La Chispa: configuración de las herramientas, diseño de las pruebas, mocks y aislamiento, resultados de ejecución y cobertura alcanzada, dando evidencia a los indicadores:

- **IE2.2.1** Crea pruebas unitarias con Jasmine y Karma (12%).
- **IE2.3.1** Implementa proceso de testeo: configuración, mocks y cobertura (8%).

## 2. Estrategia de pruebas

| Aspecto | Decisión |
|---|---|
| Nivel | Pruebas unitarias/de componente (React Testing Library + Jasmine) |
| Alcance | Componentes de la tienda, control de acceso, CRUD de la fuente de datos simulada y un smoke de integración del router |
| Tipos cubiertos | Los 5 tipos requeridos: renderizado de listas, renderizado condicional, props, estado y eventos, más lógica pura (CRUD) y comportamiento de rutas |
| Doble corredor | **Jest + @testing-library/react** como corredor principal y **Jasmine + Karma** como segundo corredor, con la misma suite de specs |
| Red | Ninguna prueba depende de red: los datos vienen de `src/data/db.js` y el estado se siembra en `localStorage` |

Los specs se escriben con un subconjunto de matchers compatibles con ambos runners (`toBe`, `toEqual`, `toBeNull`, `toBeTruthy`, `toBeGreaterThan`) y sin `jest.fn()`, de modo que **el mismo archivo corre sin cambios en Jest y en Jasmine**.

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
  - `preprocessors`: los specs se empaquetan con **webpack + babel-loader** (`@babel/preset-env` + `@babel/preset-react` con `runtime: 'automatic'`) para soportar JSX/modernos
  - `files: ['src/**/*.test.js']`, `singleRun: true` (una corrida, ideal para CI)
- **`src/setupKarma.js`**: define `window.IS_REACT_ACT_ENVIRONMENT = true` para que React actúe fuera de `act()` de Jest.
- Comando: `npm run test:jasmine`
- Nota: `App.test.js` usa `window.history.replaceState({}, '', '/')` porque en Karma la URL base es `/context.html`, distinta de Jest (`/`).

### 3.3 Scripts definidos en `package.json`

| Script | Qué ejecuta |
|---|---|
| `npm test` | Jest en modo corrida única |
| `npm run test:jest` | Jest (`--watchAll=false`) |
| `npm run test:jasmine` | Karma + Jasmine |
| `npm run test:coverage` | Jest con reporte de cobertura |
| `npm run test:all` | Ambos corredores en secuencia |

### 3.4 Restricción registrada

`react-router-dom` quedó en **v6**: el Jest 27 de react-scripts no resuelve los subpath exports de v7 (`react-router/dom`) y v7 exige `TextEncoder`, ausente en el jsdom de Jest 27. El router se configura con `future={{ v7_startTransition: true, v7_relativeSplatPath: true }}` para heredar el comportamiento v7.

## 4. Mocks y aislamiento

- **Estado aislado por test:** `clearStorage()` en `beforeEach` limpia `localStorage` (`gasLaChispaDB`, sesión y carrito) para que no haya fugas entre pruebas.
- **Semillas controladas:** helpers `seedSession(user)` y `seedCart(items)` siembran el estado exacto que el test necesita (por ejemplo, sesión de Administrador o carrito con stock insuficiente).
- **Providers reales, no mocks del producto:** los tests envuelven la UI con `AuthProvider`, `CartProvider`, `DataProvider` y `MemoryRouter` (`renderWithProviders`) — se prueba el código real, aislándolo solo del entorno (storage y ruta).
- **Sin red y sin tiempo real:** fuente de datos en memoria (`db.js`) y persistencia local; no hay fetch, timers ni websockets que desestabilicen la corrida.
- **Simulación de errores:** flujos con resultado fallido (pago rechazado, stock insuficiente) se provocan con condiciones de datos, no con mocks de red.

## 5. Catálogo de pruebas (87 pruebas, 13 suites)

| Archivo | Tests | Tipos de prueba (rúbrica) | Qué verifica / funcionalidad cubierta |
|---|---:|---|---|
| `src/tests/ProductCard.test.js` | 4 | Props, renderizado condicional, lógica | Renderiza nombre, precio, imagen y categoría desde props; badge "Sin stock" cuando `stock = 0`; estado calculado (Disponible/Poco stock/Sin stock); `onClick` añade al carrito |
| `src/tests/Products.test.js` | 5 | Listas, estado, eventos, condicional | Lista los 7 productos de la fuente de datos; búsqueda por texto filtra; mensaje "no hay resultados"; ordenamiento; botón "Limpiar" restaura filtros |
| `src/tests/Contact.test.js` | 4 | Estado, eventos, condicional | Validación del formulario (errores al enviar incompleto); envío correcto limpia campos y muestra confirmación |
| `src/tests/Cart.test.js` | 6 | Listas, eventos, condicional | Carrito vacío → mensaje condicional; aumentar/disminuir cantidad; eliminar ítem; vaciar carrito; totales correctos |
| `src/tests/Checkout.test.js` | 4 | Condional, eventos, estado | Bloqueo si el carrito está vacío; validación de datos de entrega; confirmar pedido → pantalla de pago correcto; pago con error → pantalla de pago error |
| `src/tests/Login.test.js` | 6 | Estado, eventos, condicional | Credenciales inválidas → error condicional; login con cada rol redirige a su panel (`homePathFor`); campos obligatorios |
| `src/tests/ProtectedRoute.test.js` | 3 | Comportamiento/condicional | Sin sesión → `/login`; rol sin permiso → redirige; rol autorizado → renderiza la ruta (usando `ROLES_ADMIN`) |
| `src/tests/Admin.test.js` | 7 | Listas, condicional, estado, eventos | Tabla de productos y usuarios; pestaña "Críticos" muestra solo faltantes; filtros por texto; KPIs del dashboard |
| `src/tests/db.test.js` | 10 | Lógica (CRUD puro) | Requisito 2: crear, leer, actualizar y borrar productos/categorías/usuarios/pedidos; autenticación por credenciales; persistencia en `localStorage` |
| `src/tests/CategoryAdmin.test.js` | 9 | CRUD (formulario), condicional, eventos | Alta de categoría: renderizado, nombre obligatorio, duplicados case-insensitive, `maxLength`, limpieza del formulario, cancelar |
| `src/tests/ProductAdmin.test.js` | 12 | CRUD (formulario), validación, eventos | Alta y edición de producto: campos requeridos, formato de código, errores al vacío, edición de datos, switch de visibilidad, producto no encontrado |
| `src/tests/UserAdmin.test.js` | 16 | CRUD (formulario), validación, eventos | Alta y edición de usuario: RUN (7-8 dígitos + k), email, contraseña (4-10), roles/comuna/estado, cambio de contraseña opcional, usuario no encontrado |
| `src/App.test.js` | 1 | Integración (smoke) | La SPA arranca, renderiza Home y navega al clickear enlaces |

**Total: 87 pruebas — los 5 tipos requeridos + CRUD + control de acceso + CRUD de formularios admin.**

### Uso de mocks

- No se mockea el código de la aplicación: se siembra `localStorage` y se usan providers reales (sección 4).
- El único doble de testeo es el **entorno** (storage, ruta) — estrategia recomendada para probar componentes con estado real.

## 6. Resultados de ejecución (corredores duales)

| Corredor | Comando | Resultado |
|---|---|---|
| Jest + React Testing Library | `npm run test:jest` | **87/87 pruebas OK, 13 suites** |
| Jasmine + Karma (jsdom) | `npm run test:jasmine` | **87/87 pruebas OK (TOTAL: 87 SUCCESS)** |
| Cobertura | `npm run test:coverage` | Reporte generado en `coverage/` |

Ambos corredores ejecutan la **misma suite** y ambos quedan en verde.

## 7. Cobertura de código (Jest, Istanbul)

### 7.1 Resumen global

| Métrica | Cobertura |
|---|---|
| Statements | **55.61%** |
| Branches | **48.02%** |
| Functions | **48.76%** |
| Lines | **56.48%** |

### 7.2 Por área (las de mayor cobertura primero)

| Archivo | % Stmts | Comentario |
|---|---:|---|
| `src/App.js` | 100 | Rutas y layout cubiertos por el smoke |
| `pages/Home.js` | 100 | Completa |
| `components/ProtectedRoute.js` | 100 | Completa |
| `components/StatusBadge.js` | 100 | Completa |
| `pages/admin/Dashboard.js` | 100 | KPIs |
| `pages/admin/ProductNew.js` | 100 | Alta de producto completa |
| `pages/admin/UserNew.js` | 100 | Alta de usuario completa |
| `pages/admin/UserEdit.js` | 97.2 | Edición de usuario y cambio de contraseña |
| `pages/Checkout.js` | 97.9 | Flujo completo de compra |
| `pages/admin/CategoryNew.js` | 96.2 | Alta de categoría completa |
| `pages/Contact.js` | 93.9 | Formulario y validaciones |
| `pages/admin/ProductEdit.js` | 93.9 | Edición, validaciones y switch |
| `pages/Login.js` | 90.9 | Sesión y errores |
| `pages/Cart.js` | 90 | Carrito |
| `components/ProductCard.js` | 85.7 | Props y estado |
| `pages/admin/Products.js` | 80 | Lista, críticos, filtros |
| `pages/Products.js` | 78.1 | Tienda, búsqueda, orden |
| `pages/admin/Users.js` | 76.2 | Lista y filtros |
| `components/Navigation.js` | 77.8 | Menú por sesión y rol |
| `context/CartContext.js` | 72.5 | Lógica de carrito |
| `context/AuthContext.js` | 64 | Sesión |
| `data/db.js` | 55.4 | CRUD probado en su núcleo (10 tests) |
| `src/tests/helpers.js` | 100 | — |

### 7.3 Cobertura de funcionalidades principales (rúbrica: "cobertura de las funcionalidades principales")

- ✅ **Catálogo y búsqueda de productos** (Products, ProductCard, Home)
- ✅ **Carrito de compras** (Cart, CartContext)
- ✅ **Checkout y estados de pago** (Checkout, PaymentSuccess, PaymentError)
- ✅ **Autenticación y roles** (Login, AuthContext, ProtectedRoute)
- ✅ **Panel administrativo: productos, usuarios y dashboard** (Admin)
- ✅ **CRUD de productos, usuarios y categorías desde los formularios del admin** (ProductNew/Edit, UserNew/Edit, CategoryNew)
- ✅ **CRUD de la fuente de datos simulada** (db.js — Requisito 2)
- ✅ **Ruteo y 404** (App)
- ⚠️ **Sin cobertura todavía:** Blogs, BlogPost, Ofertas, Categorías (lista), Detalle de producto, Registro, Reportes, Perfil, Órdenes, panel del repartidor.

### 7.4 Plan de ampliación (limitaciones declaradas)

La suite prioriza las **funcionalidades principales del flujo de compra y de operación** (indicador IE2.3.1). Para subir la cobertura global se recomienda, en orden:

1. Specs de `ProductDetail`, `Offers` y `Categories` (mismo patrón que `Products.test.js`).
2. Spec del panel `repartidor/Panel.js` (flujo Tomar → Entregado con `db.js`).
3. Spec de `Register` y `Reports`, `Orders` y `Profile`.
4. Specs de `Blog`/`BlogPost` (listado y detalle de entradas).

## 8. Trazabilidad con la rúbrica

| Indicador | Evidencia en este documento |
|---|---|
| **IE2.2.1** Pruebas unitarias con Jasmine y Karma | Sección 5 (catálogo de 87 pruebas con los 5 tipos + CRUD admin) y sección 6 (Karma/Jasmine en verde: 87/87) |
| **IE2.3.1** Proceso de testeo: configuración, mocks, cobertura | Sección 3 (configuración de ambos corredores), sección 4 (mocks/aislamiento) y sección 7 (cobertura) |
| **IE2.2.2 / IE2.3.2** (presentación) | Se pueden demostrar en vivo con `npm run test:jasmine` y `npm run test:coverage` |

## 9. Cómo reproducir

```bash
cd frontend
npm install
npm run test:jest        # corredor principal (Jest)
npm run test:jasmine     # corredor alternativo (Karma + Jasmine)
npm run test:coverage    # reporte de cobertura en coverage/
```
