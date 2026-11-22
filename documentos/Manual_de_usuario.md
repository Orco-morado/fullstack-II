# Manual de Usuario

**Proyecto:** Gas La Chispa — tienda online de gas doméstico
**Asignatura:** DSY1104 Desarrollo Fullstack II — Evaluación Parcial 3
**Versión del manual:** 1.0 — noviembre 2026

---

## Índice

1. Introducción
2. Acceso al sistema
3. Usuarios de prueba
4. Roles del sistema
5. Navegación general
6. Visitante y Cliente
7. Administrador
8. Operadora
9. Vendedor
10. Repartidor
11. Ciclo de vida de un pedido
12. Mensajes frecuentes y solución de problemas
13. Anexo: pantallazos por sacar

---

## 1. Introducción

Gas La Chispa es una tienda online para comprar cilindros de gas con despacho a domicilio en Chillán y comunas cercanas. Además de la tienda, el sistema tiene paneles internos para administrar el negocio: pedidos, productos, usuarios, reportes y entregas.

Este manual explica, paso a paso y con imágenes, cómo usar cada pantalla según el tipo de usuario. Está pensado para personas sin conocimientos técnicos.

**Convenciones del manual**

- Los nombres de botones, menús y campos aparecen en **negrita**, tal como se ven en pantalla.
- Los campos marcados con **\*** en los formularios son obligatorios.
- Cada sección indica qué tipo de usuario puede usarla.

## 2. Acceso al sistema

1. Abre un navegador actualizado (Chrome, Edge o Firefox).
2. Escribe la dirección **http://localhost:3000** y presiona Enter.
3. Verás la página de inicio de la tienda. Puedes navegar como visitante sin iniciar sesión.

> El sistema debe estar en funcionamiento (base de datos, servidor y tienda). Las instrucciones técnicas para levantarlo están en el archivo `README.md` del proyecto.

## 3. Usuarios de prueba

El sistema incluye estos usuarios para probar cada rol:

| Nombre | Correo | Contraseña | Rol |
|---|---|---|---|
| Ana García | admin@gmail.com | admin123 | Administrador |
| María López | operadora@gmail.com | oper1234 | Operadora |
| Valentina Soto | vendedor@gmail.com | vendedor1 | Vendedor |
| Carlos Rojas | repartidor@gmail.com | repart123 | Repartidor |
| Pedro Muñoz | cliente@gmail.com | cliente123 | Cliente |
| Lucía Herrera | lucia@gmail.com | lucia1234 | Cliente inactivo (no puede entrar) |

## 4. Roles del sistema

| Rol | Qué puede hacer | Pantalla inicial al entrar |
|---|---|---|
| Visitante | Ver la tienda, productos, ofertas, blog y contacto; armar un carrito | Inicio |
| Cliente | Todo lo del visitante, más comprar y confirmar pedidos | Inicio |
| Administrador | Gestionar pedidos, productos, categorías, usuarios, reportes y su perfil | Dashboard |
| Operadora | Lo mismo que el Administrador, excepto gestionar usuarios Administradores | Dashboard |
| Vendedor | Consultar el catálogo y los pedidos, sin modificar nada | Panel de ventas |
| Repartidor | Ver los pedidos que tiene asignados y avanzar su estado | Mis entregas |

## 5. Navegación general

La barra superior cambia según quién haya iniciado sesión:

- **Visitante y Cliente:** Home, Productos, Categorías, Ofertas, Nosotros, Blogs y Contacto, más el botón del carrito (**Cart**) con la cantidad de productos agregados.
- **Administrador y Operadora:** Dashboard, Órdenes, Productos, Usuarios, Reportes y Perfil.
- **Vendedor:** Panel de ventas, Productos y Pedidos.
- **Repartidor:** Mis Entregas.

A la derecha aparece:

- **Iniciar sesión**, si no has entrado.
- Tu **nombre y rol**, si ya entraste. Al hacer clic se abre un menú con **Mi panel** (vuelve a tu pantalla inicial), **Perfil** (solo Administrador y Operadora) y **Cerrar sesión**.

![Menú de usuario abierto](img/manual/17-menu-usuario.png)

Si intentas abrir una página que tu rol no tiene permitida, el sistema te devuelve a tu pantalla inicial. Si la página requiere iniciar sesión, te lleva primero a **Inicio de Sesión**.

---

## 6. Visitante y Cliente

### 6.1 Página de inicio

La página de inicio muestra el mensaje principal de la tienda, los cilindros disponibles y las ofertas de la semana.

- **Ver Productos** abre el catálogo completo.
- **Ver Ofertas** abre las promociones vigentes.

![Página de inicio](img/manual/01-inicio.png)

### 6.2 Catálogo de productos

En **Productos** verás todos los cilindros activos. Puedes:

1. **Buscar:** escribe parte del nombre o la descripción en el campo **Buscar**.
2. **Filtrar por categoría:** elige una opción en **Categoría** (por ejemplo, Normal, Catalítico o Industrial).
3. **Ordenar:** en **Ordenar por** elige Código, Precio (menor a mayor o mayor a menor) o Peso.
4. Presiona **Limpiar** para borrar la búsqueda y volver a ver todo.

Cada tarjeta muestra el precio. Si el producto tiene una oferta vigente, aparece el precio normal tachado y, al lado, el precio con descuento.

![Catálogo de productos](img/manual/02-catalogo.png)

![Catálogo con búsqueda y filtro aplicados](img/manual/03-catalogo-busqueda.png)

### 6.3 Detalle de un producto y agregar al carrito

1. En el catálogo, haz clic en un producto.
2. Revisa la descripción, el precio y la disponibilidad:
   - **Disponible:** hay stock suficiente.
   - **Últimas unidades:** queda poco stock.
   - **Sin stock:** no se puede comprar por ahora.
3. Ajusta la **Cantidad** con los botones **−** y **+**. No puedes pedir más unidades que el stock disponible.
4. Presiona **Añadir al carrito**. Aparecerá el mensaje **Producto añadido al carrito**.
5. Presiona **Ir al carrito** para revisar tu compra, o sigue navegando.

Si el producto tiene una oferta vigente, el precio que ves ya incluye el descuento, y es el mismo que se cobra al confirmar el pedido.

![Detalle de producto con oferta](img/manual/04-detalle-producto.png)

### 6.4 Ofertas

En **Ofertas** se muestran solo las promociones activas y vigentes, con el porcentaje de descuento, el precio rebajado y la fecha **Válido hasta**. Las ofertas vencidas no aparecen.

![Página de ofertas](img/manual/05-ofertas.png)

### 6.5 Categorías, Blog, Nosotros y Contacto

- **Categorías:** muestra los tipos de cilindro disponibles.
- **Blogs:** artículos y novedades. Presiona **Leer artículo** para ver uno completo y **Volver al blog** para regresar.
- **Nosotros:** historia de la empresa, certificaciones, cobertura de entrega y equipo.
- **Contacto:** preguntas frecuentes y un formulario. Completa **Nombre completo**, **Correo electrónico** y **Describe tu problema o consulta** (máximo 500 caracteres) y presiona **Enviar Mensaje**. Verás el aviso **Mensaje enviado. Te responderemos a la brevedad.**

![Categorías](img/manual/06-categorias.png)

![Blog y novedades](img/manual/07-blog.png)

![Centro de ayuda y contacto](img/manual/08-contacto.png)

### 6.6 Crear una cuenta (registro)

1. Presiona **Iniciar sesión** y luego el enlace **Regístrate**, o entra directo a **http://localhost:3000/registro**.
2. Completa el formulario **Registro de Usuario**:
   - **RUN:** sin puntos ni guion, por ejemplo `19011022k`.
   - **Nombre** y **Apellidos**.
   - **Correo electrónico:** debe tener un formato válido.
   - **Contraseña** y **Confirmar:** entre 4 y 10 caracteres, y ambas iguales.
   - **Región**, **Comuna** y **Dirección**.
3. Presiona **Registrarse**.
4. Verás **Cuenta creada con éxito** y el sistema te llevará al inicio de sesión.

Si algún dato está mal, el campo se marca en rojo con el motivo (por ejemplo, **RUN inválido** o **Las contraseñas no coinciden**). Las cuentas creadas desde el registro siempre tienen rol Cliente.

![Formulario de registro](img/manual/09-registro.png)

![Registro con errores de validación](img/manual/10-registro-errores.png)

### 6.7 Iniciar sesión

1. Presiona **Iniciar sesión** en la barra superior.
2. Escribe tu **Correo electrónico** y tu **Contraseña**.
3. Marca **Mantener sesión iniciada** si quieres seguir conectado aunque cierres el navegador. Si no la marcas, la sesión termina al cerrar la pestaña.
4. Presiona **Ingresar**.

El sistema te lleva automáticamente a la pantalla de tu rol. Si venías desde el pago, te devuelve a **Finalizar compra**.

Por seguridad, la sesión dura un máximo de 8 horas. Si expira, el sistema te pedirá iniciar sesión de nuevo.

![Inicio de sesión](img/manual/11-login.png)

Una cuenta desactivada por la empresa no puede entrar: el sistema muestra **Tu cuenta está desactivada.**

![Intento de ingreso con cuenta desactivada](img/manual/12-login-inactivo.png)

### 6.8 Carrito de compras

En **Cart** (arriba a la derecha) verás **Mi carrito de compras**:

- Cambia la cantidad de cada producto con **−** y **+**.
- Quita un producto con el botón de eliminar (papelero).
- **Vaciar carrito** elimina todo.
- **Seguir comprando** vuelve al catálogo.
- El **TOTAL** se actualiza solo.
- Presiona **Ir a pagar** para continuar.

El carrito se guarda en tu navegador, así que no se pierde si recargas la página.

![Carrito de compras](img/manual/13-carrito.png)

### 6.9 Finalizar compra

Para confirmar un pedido debes haber iniciado sesión como **Cliente**. Si no lo has hecho, el sistema te pedirá entrar y luego te devolverá a esta pantalla.

1. En **Datos de entrega** completa:
   - **Nombre completo**, **Teléfono** y, si quieres, **Correo electrónico**.
   - **Comuna** y **Dirección exacta**.
   - **Referencia** (opcional), por ejemplo "portón verde".
   - **Horario** preferido: Mañana, Tarde o Indiferente.
   - **Pago:** Efectivo o Transferencia. El pago se realiza al recibir el pedido.
2. Revisa el **Resumen del pedido** a la derecha.
3. Marca **Acepto los términos y condiciones**.
4. Presiona **Confirmar Pedido**.

**Importante:** si tu carrito tiene varios productos distintos, el sistema registra **un pedido por cada producto**. Cada uno tiene su propio número de seguimiento.

El sistema revisa que haya stock suficiente. Si un producto se agotó mientras comprabas, verás un aviso y deberás ajustar la cantidad.

![Finalizar compra](img/manual/14-checkout.png)

### 6.10 Resultado de la compra

- **¡Pago correcto!:** el pedido quedó registrado. La pantalla muestra el **Total** calculado por el sistema y la dirección de entrega. Desde aquí puedes seguir comprando o volver al inicio.
- **Pago con error:** el pedido no se registró y no se hizo ningún cobro. Tus productos siguen en el carrito. Puedes reintentar, volver al carrito o ir a contacto.

![Pago correcto](img/manual/15-pago-correcto.png)

![Pago con error](img/manual/16-pago-error.png)

### 6.11 Cerrar sesión

Haz clic en tu nombre (arriba a la derecha) y elige **Cerrar sesión**.

---

## 7. Administrador

Entra con un usuario Administrador (por ejemplo, admin@gmail.com). El sistema abre el **Dashboard**.

### 7.1 Dashboard

Muestra un saludo y el resumen del negocio:

- **Pedidos totales**, **Ventas entregadas**, **Usuarios activos** y **Productos con stock bajo**.
- **Accesos rápidos** a Órdenes, Productos, Producto nuevo, Usuarios, Categoría nueva, Reportes y Perfil.
- **Últimos pedidos** registrados.
- **Stock crítico:** productos con menos de 10 unidades.

![Dashboard del administrador](img/manual/18-admin-dashboard.png)

### 7.2 Órdenes (gestión de pedidos)

En **Órdenes** verás **Órdenes del día**:

1. **Filtrar:** haz clic en las tarjetas o botones **Total**, **Pendientes**, **Asignados**, **En camino** o **Entregados**.
2. **Ver detalle:** presiona **Ver** en un pedido para ver cliente, teléfono, dirección, producto, cantidad, total, forma de pago, estado y repartidor.
3. **Asignar repartidor** (pedidos Pendientes): presiona **Asignar**, elige un repartidor en **Seleccionar repartidor** y confirma con **Asignar**. El pedido pasa a **Asignado**.
4. **Iniciar ruta** (pedidos Asignados): marca que el pedido salió a reparto. Pasa a **En camino**.
5. **Entregado** (pedidos En camino): marca el pedido como entregado. Aparece **Completado**.

El sistema no permite saltarse pasos: por ejemplo, no se puede marcar como entregado un pedido que todavía no sale a ruta.

![Órdenes del día](img/manual/19-admin-ordenes.png)

![Detalle de un pedido](img/manual/20-admin-detalle-pedido.png)

![Asignar repartidor](img/manual/21-admin-asignar-repartidor.png)

**Crear un pedido manualmente** (por ejemplo, uno recibido por teléfono):

1. Presiona **+ Nuevo Pedido**.
2. Completa **Cliente**, **Teléfono**, **Comuna**, **Dirección**, **Producto**, **Cantidad** y, si quieres, el **Repartidor**.
3. Presiona **Guardar Pedido**. El sistema valida el stock y calcula el total.

![Nuevo pedido manual](img/manual/22-admin-nuevo-pedido.png)

### 7.3 Productos

En **Productos** hay dos pestañas:

- **Lista:** todos los productos con Código, Nombre, Categoría, Precio, Stock y Estado de stock (**OK**, **Bajo** o **Agotado**).
  - Usa el buscador para filtrar por nombre o código.
  - El botón de lápiz abre la edición.
  - El botón de papelero elimina el producto (pide confirmación).
- **Críticos:** productos con menos de 10 unidades. El botón **Reponer stock** abre directamente la edición del producto.

El precio que se ve y se edita en el panel es el **precio base**. Los descuentos de las ofertas se aplican solos en la tienda y en los pedidos.

![Lista de productos](img/manual/23-admin-productos.png)

![Productos con stock crítico](img/manual/24-admin-productos-criticos.png)

### 7.4 Crear y editar productos

**Crear:**

1. Presiona **+ Producto nuevo** (o el acceso rápido **Producto nuevo** del Dashboard).
2. Completa **Nombre**, **Precio** y **Stock** (obligatorios). Opcionalmente: **Código** (si lo dejas vacío, se genera solo), **Categoría**, **Peso (kg)**, **URL de imagen** y **Descripción**.
3. Presiona **Guardar producto**.

**Editar:**

1. En la lista, presiona el botón de lápiz.
2. Modifica los datos. La casilla **Visible en tienda** permite ocultar un producto sin borrarlo.
3. Presiona **Guardar cambios**.

![Producto nuevo](img/manual/25-admin-producto-nuevo.png)

![Editar producto](img/manual/26-admin-producto-editar.png)

### 7.5 Crear una categoría

1. En el Dashboard, presiona el acceso rápido **Categoría nueva**.
2. Escribe el **Nombre** y, si quieres, una **Descripción**. A la derecha verás las **Categorías existentes**.
3. Presiona **Crear categoría**. Si el nombre ya existe, el sistema lo avisa.

![Nueva categoría](img/manual/27-admin-categoria-nueva.png)

### 7.6 Usuarios

En **Usuarios** hay dos pestañas:

**Lista:** todos los usuarios con RUN, Email, Rol y Estado.

- Busca por nombre, email o RUN, y filtra por rol.
- **Editar:** abre el formulario del usuario.
- **Historial:** muestra los pedidos de ese cliente.
- **Desactivar / Activar:** bloquea o habilita el acceso del usuario (pide confirmación). Un usuario desactivado no puede iniciar sesión, y si tenía una sesión abierta, queda fuera.

**Historial global:** todos los pedidos del sistema con fecha, número, cliente, producto, total y estado.

![Lista de usuarios](img/manual/28-admin-usuarios.png)

**Crear un usuario:**

1. Presiona **+ Usuario nuevo**.
2. Completa **RUN**, **Nombre completo**, **Email**, **Contraseña** (4 a 10 caracteres) y **Rol**. Opcionalmente: **Teléfono**, **Comuna** y **Dirección**.
3. Presiona **Crear usuario**.

**Editar un usuario:**

1. Presiona **Editar** en la fila del usuario.
2. Cambia los datos necesarios. **Nueva contraseña** se puede dejar en blanco para no cambiarla. En **Estado** puedes elegir Activo o Inactivo.
3. Presiona **Guardar cambios**.

![Usuario nuevo](img/manual/29-admin-usuario-nuevo.png)

![Editar usuario](img/manual/30-admin-usuario-editar.png)

![Historial de pedidos de un cliente](img/manual/31-admin-historial-usuario.png)

![Historial global de pedidos](img/manual/32-admin-historial-global.png)

### 7.7 Reportes

**Reportes** resume el negocio:

- **Ventas ejecutadas**, **Pedidos en curso**, **Usuarios registrados** y **Alertas de stock**.
- **Pedidos por estado**.
- **Ventas por categoría** (solo pedidos entregados).
- **Top 5 productos** por unidades vendidas.
- **Productos con stock crítico**.

![Reportes](img/manual/33-admin-reportes.png)

### 7.8 Mi perfil

En **Perfil**:

- **Datos personales:** modifica Nombre, Email, Teléfono, Comuna y Dirección, y presiona **Guardar datos**.
- **Cambiar contraseña:** escribe la **Contraseña actual** y la **Nueva contraseña**, y presiona **Cambiar contraseña**.

![Mi perfil](img/manual/34-admin-perfil.png)

---

## 8. Operadora

Entra con operadora@gmail.com. La Operadora usa **el mismo panel que el Administrador** (sección 7): Dashboard, Órdenes, Productos, Usuarios, Reportes y Perfil.

La diferencia está en la gestión de usuarios Administradores:

- En la lista de usuarios, las filas de Administradores **no muestran** los botones **Editar** ni **Desactivar**. Solo puede ver su **Historial**.
- Al crear o editar un usuario, el rol **Administrador no aparece** en la lista de roles.
- Si intenta abrir directamente la edición de un Administrador, el sistema muestra **Solo un Administrador puede editar a otro Administrador.**

Esta regla también la valida el servidor: aunque alguien intente saltarse la pantalla, la acción es rechazada.

![Lista de usuarios vista por la Operadora](img/manual/35-operadora-usuarios.png)

![Roles disponibles para la Operadora](img/manual/36-operadora-usuario-nuevo-roles.png)

---

## 9. Vendedor

Entra con vendedor@gmail.com. El Vendedor trabaja en **modo solo lectura**: puede consultar, pero no modificar.

### 9.1 Panel de ventas

Muestra el distintivo **Solo lectura**, los indicadores **Pedidos totales**, **Pendientes**, **En camino** y **Entregados**, las ventas entregadas, la cantidad de productos en catálogo y los **Últimos pedidos**.

![Panel de ventas](img/manual/37-vendedor-panel.png)

### 9.2 Pedidos

En **Pedidos** ve la misma lista que el Administrador, con los filtros por estado y el botón **Ver** para revisar el detalle. No aparecen los botones para asignar, iniciar ruta, marcar como entregado ni crear pedidos.

![Pedidos en modo solo lectura](img/manual/38-vendedor-pedidos.png)

### 9.3 Productos

En **Productos** puede revisar el catálogo y el detalle de cada producto (precio, stock y descripción) para responder consultas de clientes. En el detalle aparece **Modo consulta** y no se muestran los botones de compra. Tampoco ve el botón del carrito.

![Detalle de producto en modo consulta](img/manual/39-vendedor-detalle-producto.png)

---

## 10. Repartidor

Entra con repartidor@gmail.com. El sistema abre **Mis entregas**, donde solo aparecen los pedidos asignados a ese repartidor.

1. Revisa los indicadores **Asignados (sin partir)**, **En camino** y **Entregados**.
2. Usa el filtro de la lista **Pedidos asignados** para ver un estado en particular.
3. Cada pedido muestra número, cliente, dirección, producto, total y estado.
4. Cuando sales a entregar un pedido **Asignado**, presiona **Salir**. El pedido pasa a **En camino**.
5. Cuando lo entregas, presiona **Entregado**. Aparece **Completado**.

El repartidor no puede ver ni modificar pedidos de otros repartidores.

![Mis entregas](img/manual/40-repartidor-entregas.png)

![Pedido en camino](img/manual/41-repartidor-en-camino.png)

---

## 11. Ciclo de vida de un pedido

```text
  Cliente confirma       Admin/Operadora        Admin/Operadora         Admin/Operadora
  el pedido              asigna repartidor      o Repartidor            o Repartidor
       |                        |               (Iniciar ruta / Salir)  (Entregado)
       v                        v                       v                     v
  [ RECIBIDO ]  -------->  [ ASIGNADO ]  -------->  [ EN CAMINO ]  ------>  [ ENTREGADO ]
  (Pendiente)
```

| Estado | Significado | Quién lo cambia |
|---|---|---|
| Recibido (Pendiente) | El pedido se registró y espera repartidor | Se crea al confirmar la compra o con **+ Nuevo Pedido** |
| Asignado | Ya tiene repartidor, pero aún no sale | Administrador u Operadora con **Asignar** |
| En camino | El repartidor salió a entregarlo | Administrador u Operadora (**Iniciar ruta**) o el Repartidor (**Salir**) |
| Entregado | El cliente recibió el pedido | Administrador u Operadora o el Repartidor (**Entregado**) |

Los estados avanzan siempre en este orden; no se puede saltar ni retroceder un paso.

## 12. Mensajes frecuentes y solución de problemas

| Mensaje o situación | Qué significa | Qué hacer |
|---|---|---|
| **Credenciales inválidas.** | El correo o la contraseña no coinciden | Revisa que estén bien escritos (la contraseña distingue mayúsculas) |
| **Tu cuenta está desactivada.** | Un administrador desactivó la cuenta | Contacta a la empresa para reactivarla |
| Se cierra tu sesión de repente | La sesión expiró (máximo 8 horas) o la cuenta fue desactivada | Vuelve a iniciar sesión |
| **No tienes permisos para realizar esta acción.** | Tu rol no puede hacer esa operación | Pide ayuda a un Administrador |
| **Stock insuficiente para el producto.** | No quedan unidades suficientes | Reduce la cantidad o elige otro producto |
| **RUN inválido** | El RUN tiene puntos, guion o un formato incorrecto | Escríbelo sin puntos ni guion, por ejemplo `19011022k` |
| **Las contraseñas no coinciden** | La confirmación es distinta a la contraseña | Escribe la misma contraseña en ambos campos |
| **Ya existe una categoría con ese nombre.** | La categoría ya está creada | Usa otro nombre o la categoría existente |
| La tienda no carga productos | El servidor no está en funcionamiento | Avisa al equipo técnico (ver `README.md`) |

---

## 13. Anexo: pantallazos por sacar

Guarda cada imagen en `documentos/img/manual/` con el nombre exacto de la tabla, en formato PNG. Al guardarlas, aparecen solas en el manual.

**Antes de empezar:** recrea la base para partir con los datos de demostración limpios (`docker compose down -v` y `docker compose up -d` en la carpeta `backend`, y después reinicia el backend). Sigue el orden de la tabla: el pedido que crea el Cliente en el paso 14 es el que después se asigna y se entrega.

**Consejos:** navegador en pantalla completa, zoom al 100 %, sin otras pestañas a la vista. Con **Windows + Shift + S** puedes recortar solo la ventana.

| # | Archivo | Usuario | Qué hacer y qué debe verse |
|---|---|---|---|
| 1 | `01-inicio.png` | Sin sesión | Página de inicio completa, con el mensaje principal y los cilindros |
| 2 | `02-catalogo.png` | Sin sesión | **Productos** con todos los cilindros y los filtros arriba |
| 3 | `03-catalogo-busqueda.png` | Sin sesión | Buscar "11" o elegir la categoría Normal y ordenar por precio |
| 4 | `04-detalle-producto.png` | Sin sesión | Detalle de **Cilindro Normal 15 kg**: precio con descuento ($22.950), cantidad y **Añadir al carrito** |
| 5 | `05-ofertas.png` | Sin sesión | **Ofertas** con la oferta de 15 % y **Válido hasta 31-12-2030** |
| 6 | `06-categorias.png` | Sin sesión | Página **Categorías** |
| 7 | `07-blog.png` | Sin sesión | Página **Blogs** con los artículos |
| 8 | `08-contacto.png` | Sin sesión | Formulario de contacto completado y el aviso **Mensaje enviado** |
| 9 | `09-registro.png` | Sin sesión | Formulario **Registro de Usuario** completado con datos de ejemplo, antes de enviar |
| 10 | `10-registro-errores.png` | Sin sesión | Presionar **Registrarse** con el RUN `12.345.678-9` y contraseñas distintas, para que se vean los errores en rojo |
| 11 | `11-login.png` | Sin sesión | Pantalla **Inicio de Sesión** con el correo del cliente escrito |
| 12 | `12-login-inactivo.png` | lucia@gmail.com | Intentar entrar y capturar el mensaje **Tu cuenta está desactivada.** |
| 13 | `13-carrito.png` | cliente@gmail.com | Carrito con **Cilindro Normal 15 kg** (cantidad 2) y el **TOTAL** |
| 14 | `14-checkout.png` | cliente@gmail.com | **Finalizar compra** con todos los datos completados y la casilla de términos marcada, justo antes de **Confirmar Pedido** |
| 15 | `15-pago-correcto.png` | cliente@gmail.com | Pantalla **¡Pago correcto!** con el total, después de confirmar el paso 14 |
| 16 | `16-pago-error.png` | cliente@gmail.com | Volver a comprar y, en **Correo electrónico** del checkout, escribir uno que contenga "error" (ej. `error@prueba.cl`). Capturar **Pago con error** |
| 17 | `17-menu-usuario.png` | cliente@gmail.com | Menú desplegado al hacer clic en el nombre (arriba a la derecha) |
| 18 | `18-admin-dashboard.png` | admin@gmail.com | **Dashboard** completo con indicadores, accesos rápidos y stock crítico |
| 19 | `19-admin-ordenes.png` | admin@gmail.com | **Órdenes** con el filtro **Total**, donde se vea el pedido nuevo del cliente como Pendiente |
| 20 | `20-admin-detalle-pedido.png` | admin@gmail.com | Ventana **Detalle del pedido** del pedido nuevo (botón **Ver**) |
| 21 | `21-admin-asignar-repartidor.png` | admin@gmail.com | Ventana **Asignar Repartidor** con Carlos Rojas seleccionado. Después presionar **Asignar** |
| 22 | `22-admin-nuevo-pedido.png` | admin@gmail.com | Ventana **+ Nuevo Pedido** completada, antes de guardar |
| 23 | `23-admin-productos.png` | admin@gmail.com | Pestaña **Lista** de Productos |
| 24 | `24-admin-productos-criticos.png` | admin@gmail.com | Pestaña **Críticos** (debe aparecer el cilindro de 45 kg) |
| 25 | `25-admin-producto-nuevo.png` | admin@gmail.com | Formulario **Producto nuevo** completado, antes de guardar |
| 26 | `26-admin-producto-editar.png` | admin@gmail.com | **Editar producto** del Cilindro Normal 15 kg: precio base $27.000 y la casilla **Visible en tienda** |
| 27 | `27-admin-categoria-nueva.png` | admin@gmail.com | **Nueva categoría** con un nombre escrito y la lista de categorías existentes |
| 28 | `28-admin-usuarios.png` | admin@gmail.com | Pestaña **Lista** de Usuarios con todos los roles |
| 29 | `29-admin-usuario-nuevo.png` | admin@gmail.com | Formulario **Usuario nuevo** completado, con la lista de roles desplegada |
| 30 | `30-admin-usuario-editar.png` | admin@gmail.com | **Editar usuario** de Pedro Muñoz |
| 31 | `31-admin-historial-usuario.png` | admin@gmail.com | **Historial** de Pedro Muñoz (botón Historial en su fila) |
| 32 | `32-admin-historial-global.png` | admin@gmail.com | Pestaña **Historial global** de Usuarios |
| 33 | `33-admin-reportes.png` | admin@gmail.com | **Reportes** completo |
| 34 | `34-admin-perfil.png` | admin@gmail.com | **Mi perfil** con los datos personales y el cambio de contraseña |
| 35 | `35-operadora-usuarios.png` | operadora@gmail.com | Lista de usuarios: la fila de Ana García (Administrador) sin **Editar** ni **Desactivar** |
| 36 | `36-operadora-usuario-nuevo-roles.png` | operadora@gmail.com | **Usuario nuevo** con la lista de roles desplegada, donde no aparece Administrador |
| 37 | `37-vendedor-panel.png` | vendedor@gmail.com | **Panel de ventas** con el distintivo **Solo lectura** |
| 38 | `38-vendedor-pedidos.png` | vendedor@gmail.com | **Pedidos** en modo solo lectura (sin botones de asignar) |
| 39 | `39-vendedor-detalle-producto.png` | vendedor@gmail.com | Detalle de un producto con **Modo consulta** y sin botón de compra |
| 40 | `40-repartidor-entregas.png` | repartidor@gmail.com | **Mis entregas** con el pedido asignado en el paso 21 y el botón **Salir** |
| 41 | `41-repartidor-en-camino.png` | repartidor@gmail.com | El mismo pedido después de presionar **Salir**: estado En camino y botón **Entregado** |
