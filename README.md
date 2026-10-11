# Gas La Chispa — Evaluación Parcial 2 (DSY1104)

Prototipo de tienda online de gas doméstico, migrado de HTML/CSS/JS estático a una **SPA en React + Bootstrap**, con fuente de datos simulada (CRUD), autenticación con roles y **pruebas unitarias en doble corredor (Jest y Jasmine/Karma)**.

## Estructura

```
gas-la-chispa/
├── vistas-estaticas/         # prototipo HTML/CSS/JS sin React (Parcial 1, solo referencia)
│   ├── *.html                # las 17 vistas originales
│   ├── js/, css/, img/       # estilos, scripts e imágenes del prototipo
│   └── package.json          # live-server para servirlo (npm install && npx live-server)
├── frontend/                 # aplicación React (la entrega del Parcial 2)
│   ├── src/
│   │   ├── components/       # componentes reutilizables (Navigation, Footer, ProductCard, ProtectedRoute…)
│   │   ├── pages/            # tienda, admin/ y repartidor/
│   │   ├── context/          # AuthContext, CartContext, DataContext (estado global)
│   │   ├── data/db.js        # fuente de datos simulada con CRUD + persistencia localStorage
│   │   ├── tests/            # 50 pruebas (Jest + Jasmine/Karma)
│   │   └── App.js            # ruteo, layout y rutas protegidas por rol
│   └── karma.conf.js         # configuración Karma + Jasmine
└── documentos/               # entregables informales (ERS V2, cobertura de testing)
```

## Requisitos

- Node.js 18+ (probado con Node 24)
- npm 11+

## Ejecutar

```bash
cd frontend
npm install
npm start          # http://localhost:3000
```

## Pruebas

```bash
npm run test:jest        # corredor principal (Jest + React Testing Library) — 50/50
npm run test:jasmine     # corredor alternativo (Karma + Jasmine)           — 50/50
npm run test:coverage    # reporte de cobertura (coverage/)
```

Los mismos specs corren en ambos runners: están escritos con matchers compatibles con Jest y Jasmine.

## Usuarios demo (auth simulada)

| Correo | Contraseña | Rol |
|---|---|---|
| admin@gmail.com | admin123 | Administrador |
| operadora@gmail.com | oper1234 | Operadora |
| repartidor@gmail.com | repart123 | Repartidor |
| cliente@gmail.com | cliente123 | Cliente |
| lucia@gmail.com | lucia1234 | Cliente (inactivo) |

- Administrador/Operadora → `/admin`
- Repartidor → `/repartidor`
- Cliente → `/` (tienda) y `/checkout`

## Cambio de usuario

La autenticación es simulada (mock) sin backend real. Para cambiar de usuario:

1. **Logout**: Click en el botón "Salir" / "Logout" en la barra de navegación (o navega a `/logout`).
2. **Login**: Serás redirigido a `/login`. Ingresa las credenciales del nuevo usuario (tabla arriba).
3. **Redirección automática** según rol:
   - Administrador / Operadora → `/admin`
   - Repartidor → `/repartidor`
   - Cliente → `/` (home tienda)

> **Nota**: No hay "cambio rápido" ni sesiones simultáneas. Cada login reemplaza la sesión anterior en `localStorage`/`sessionStorage`. El usuario `lucia@gmail.com` está `inactivo` y no podrá loguearse.

## Stack

- React 19 + react-scripts 5 (create-react-app)
- react-router-dom v6 (compatibilidad con Jest 27; flags `future` v7 activados)
- Bootstrap 5 + react-bootstrap
- Estado: Context API; datos: `src/data/db.js` + `localStorage`
- Testing: Jest, @testing-library/react, Jasmine + Karma (jsdom)
