// ============================================================
// FUENTE DE DATOS SIMULADA (Requisito 2 - "archivo de datos JS")
// Actúa como una base de datos en memoria con persistencia
// en localStorage. Expone funciones CRUD por cada recurso.
// ============================================================

const STORAGE_KEY = 'gasLaChispaDB';

// ---------------------- DATOS INICIALES ----------------------

const seedData = {
  productos: [
    { id: 'VOL-005', nombre: 'Cilindro Normal 5 kg', categoria: 'Normal', peso: 5, precio: 11500, stock: 120, imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoe4VQoRhPj4pnXVzeMl7dfOL_t0bSW9E7JPCUWHix0w&s=10', descripcion: 'Ideal para estufas pequeñas y uso doméstico básico', activo: true },
    { id: 'VOL-011', nombre: 'Cilindro Normal 11 kg', categoria: 'Normal', peso: 11, precio: 20000, stock: 85, imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3yhfKiRlMS5LKhPyFcbW4Yi5tR997lJt8xglXm9CFiw&s=10', descripcion: 'El clásico para hogar, uso estándar familiar', activo: true },
    { id: 'VOL-015', nombre: 'Cilindro Normal 15 kg', categoria: 'Normal', peso: 15, precio: 27000, stock: 35, imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRCy_n2hs5Ea6SM_6z-hf18XYC_6biqbxJYTjBBgB3LA&s=10', descripcion: 'Mayor duración, ideal para familias grandes', activo: true },
    { id: 'VOL-045', nombre: 'Cilindro Normal 45 kg', categoria: 'Industrial', peso: 45, precio: 60000, stock: 8, imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1uHGeEXlfTHDrT_VTpdKe08_5YWXQiDyLT2RQchm4OQ&s', descripcion: 'El más grande, para uso comercial e industrial', activo: true },
    { id: 'VOL-CAT', nombre: 'Cilindro Catalítico 11 kg', categoria: 'Catalítico', peso: 11, precio: 22000, stock: 40, imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3yhfKiRlMS5LKhPyFcbW4Yi5tR997lJt8xglXm9CFiw&s=10', descripcion: 'Tecnología catalítica para mayor eficiencia y seguridad', activo: true },
    { id: 'VOL-ALU', nombre: 'Cilindro Aluminio 15 kg', categoria: 'Aluminio', peso: 15, precio: 35000, stock: 28, imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRCy_n2hs5Ea6SM_6z-hf18XYC_6biqbxJYTjBBgB3LA&s=10', descripcion: 'Ligero y resistente, ideal para transporte frecuente', activo: true },
    { id: 'GR-100', nombre: 'Carga a Granel (desde 100 litros)', categoria: 'Granel', peso: null, precio: 500, stock: 9999, imagen: 'https://www.csc-trucks.com/uploads/201921798/10cbm-lp-gas-tank-truck56176327375.jpg', descripcion: 'Entrega a granel para industrias. Precio por litro. Mínimo 100 litros.', activo: true },
  ],

  categorias: [
    { id: 'CAT-01', nombre: 'Normal', descripcion: 'Cilindros estándar para hogar', activo: true },
    { id: 'CAT-02', nombre: 'Industrial', descripcion: 'Cilindros de gran capacidad para comercios', activo: true },
    { id: 'CAT-03', nombre: 'Catalítico', descripcion: 'Tecnología de combustión limpia', activo: true },
    { id: 'CAT-04', nombre: 'Aluminio', descripcion: 'Cilindros ligeros de aluminio', activo: true },
    { id: 'CAT-05', nombre: 'Granel', descripcion: 'Gas a granel por litro', activo: true },
  ],

  usuarios: [
    { id: 'U-001', run: '12345678-9', nombre: 'Ana García', email: 'admin@gmail.com', password: 'admin123', telefono: '+56 9 1111 1111', rol: 'Administrador', estado: 'activo', comuna: 'Chillan', direccion: '', creadoEn: '2026-01-10T09:00:00Z' },
    { id: 'U-002', run: '23456789-0', nombre: 'María López', email: 'operadora@gmail.com', password: 'oper1234', telefono: '+56 9 2222 2222', rol: 'Operadora', estado: 'activo', comuna: 'Chillan', direccion: '', creadoEn: '2026-01-12T09:00:00Z' },
    { id: 'U-003', run: '34567890-1', nombre: 'Carlos Rojas', email: 'repartidor@gmail.com', password: 'repart123', telefono: '+56 9 3333 3333', rol: 'Repartidor', estado: 'activo', comuna: 'Chillan', direccion: 'Los Alerces 123', creadoEn: '2026-01-15T09:00:00Z' },
    { id: 'U-004', run: '45678901-2', nombre: 'Pedro Muñoz', email: 'cliente@gmail.com', password: 'cliente123', telefono: '+56 9 4444 4444', rol: 'Cliente', estado: 'activo', comuna: 'ChillanViejo', direccion: 'Independencia 987', creadoEn: '2026-02-01T09:00:00Z' },
    { id: 'U-005', run: '56789012-3', nombre: 'Lucía Herrera', email: 'lucia@gmail.com', password: 'lucia1234', telefono: '+56 9 5555 5555', rol: 'Cliente', estado: 'inactivo', comuna: 'Chillan', direccion: 'San Martín 321', creadoEn: '2026-02-10T09:00:00Z' },
  ],

  pedidos: [
    { id: 'GC-100001', clienteId: 'U-004', cliente: 'Pedro Muñoz', fono: '+56 9 4444 4444', comuna: 'Chillan', direccion: 'Av. Argentina 123', productoId: 'VOL-011', producto: 'Cilindro Normal 11 kg', cantidad: 1, total: 20000, estado: 'entregado', repartidor: 'Carlos Rojas', pago: 'efectivo', fecha: '2026-10-07T10:00:00Z' },
    { id: 'GC-100002', clienteId: 'U-004', cliente: 'Pedro Muñoz', fono: '+56 9 4444 4444', comuna: 'Chillan', direccion: 'O\'Higgins 456', productoId: 'VOL-015', producto: 'Cilindro Normal 15 kg', cantidad: 2, total: 54000, estado: 'camino', repartidor: 'Carlos Rojas', pago: 'efectivo', fecha: '2026-10-08T08:30:00Z' },
    { id: 'GC-100003', clienteId: 'U-005', cliente: 'Lucía Herrera', fono: '+56 9 5555 5555', comuna: 'ChillanViejo', direccion: 'Pedro Aguirre Cerda 789', productoId: 'VOL-005', producto: 'Cilindro Normal 5 kg', cantidad: 1, total: 11500, estado: 'recibido', repartidor: null, pago: 'transferencia', fecha: '2026-10-08T09:15:00Z' },
    { id: 'GC-100004', clienteId: 'U-004', cliente: 'Pedro Muñoz', fono: '+56 9 4444 4444', comuna: 'Chillan', direccion: 'San Martín 321', productoId: 'VOL-045', producto: 'Cilindro Normal 45 kg', cantidad: 1, total: 60000, estado: 'asignado', repartidor: 'Carlos Rojas', pago: 'efectivo', fecha: '2026-10-08T09:45:00Z' },
  ],

  ofertas: [
    { id: 'OF-01', titulo: '2x1 en Cilindros de 5 kg', descripcion: 'Lleva dos cilindros de 5 kg y paga solo uno. Válido solo los lunes.', productoId: 'VOL-005', descuento: 50, activo: true, imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoe4VQoRhPj4pnXVzeMl7dfOL_t0bSW9E7JPCUWHix0w&s=10', vigencia: '2026-10-31' },
    { id: 'OF-02', titulo: '15% dcto. en Cilindro 15 kg', descripcion: 'Descuento especial para hogares con mayor consumo.', productoId: 'VOL-015', descuento: 15, activo: true, imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRCy_n2hs5Ea6SM_6z-hf18XYC_6biqbxJYTjBBgB3LA&s=10', vigencia: '2026-11-15' },
    { id: 'OF-03', titulo: 'Envío gratis en primera compra',descripcion: 'Para clientes nuevos de Chillán y Chillán Viejo.', productoId: null, descuento: 100, activo: true, imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJRQ6Nv_yCS37RUzZMViwHElJCfdDFFC90BPc0g_Edog&s=10', vigencia: '2026-12-31' },
  ],

  blogs: [
    { id: 'BLOG-01', titulo: '5 Reglas de Oro para el Uso Seguro de Gas en Casa', categoria: 'Seguridad', fecha: '2026-09-15', resumen: 'Ventilación, revisión de conexiones, detector de fugas, cierre de llave y plan de emergencia.', contenido: 'El gas licuado es seguro si se maneja correctamente. Ventila siempre, revisa conexiones anualmente, instala un detector de fugas, cierra la llave de paso al terminar y ten un plan de emergencia: llama a Bomberos al 132 desde fuera del ambiente.', autor: 'Ana García', activo: true },
    { id: 'BLOG-02', titulo: '¿Qué Cilindro Elegir para Ahorrar en tu Hogar?', categoria: 'Ahorro', fecha: '2026-09-08', resumen: 'Comparamos consumo según tamaño de familia y tipo de uso.', contenido: '1-2 personas: 5 kg. 3-4 personas: 11 kg. 5-6 personas: 15 kg. 7+ o uso intenso: 45 kg. Si cocinas a diario con horno a gas, sube un tamaño.', autor: 'María López', activo: true },
    { id: 'BLOG-03', titulo: 'Revisión Anual Obligatoria: Qué Revisa el Técnico', categoria: 'Mantenimiento', fecha: '2026-09-01', resumen: 'La normativa exige revisión anual de instalaciones.', contenido: 'El técnico verifica mangueras, prueba de hermeticidad, presión del regulador, ventilación, llaves de paso y emite certificado de conformidad. Guárdalo por 3 años.', autor: 'Ana García', activo: true },
    { id: 'BLOG-04', titulo: '15 Años de Gas La Chispa: Historia y Compromiso', categoria: 'Empresa', fecha: '2026-08-10', resumen: 'De un camión a la distribuidora de referencia de Ñuble.', contenido: 'Desde 2009 con un solo camión hasta flota propia y seguimiento en tiempo real. El compromiso sigue igual: llegar a tiempo, entregar seguro y tratar con respeto.', autor: 'Ana García', activo: true },
  ],
};

// ---------------------- PERSISTENCIA ----------------------

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function loadDB() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('No se pudo leer la base local, se usan datos semilla.', e);
  }
  const fresh = clone(seedData);
  saveDB(fresh);
  return fresh;
}

function saveDB(db) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (e) {
    console.warn('No se pudo persistir la base local.', e);
  }
}

function nextId(db, prefix, collection) {
  const nums = db[collection]
    .map((item) => parseInt(String(item.id).replace(prefix, ''), 10))
    .filter((n) => !isNaN(n));
  const next = nums.length ? Math.max(...nums) + 1 : 1;
  return prefix + String(next).padStart(3, '0');
}

// ---------------------- CRUD: PRODUCTOS ----------------------

export function getProducts() {
  return loadDB().productos;
}

export function getProductById(id) {
  return loadDB().productos.find((p) => p.id === id) || null;
}

export function getProductsByCategory(categoria) {
  return loadDB().productos.filter((p) => p.categoria === categoria);
}

export function searchProducts(texto) {
  const q = texto.trim().toLowerCase();
  return loadDB().productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(q) ||
      p.descripcion.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q)
  );
}

export function createProduct(data) {
  const db = loadDB();
  const producto = {
    id: data.id || nextId(db, 'VOL-', 'productos'),
    nombre: data.nombre,
    categoria: data.categoria || 'Normal',
    peso: data.peso ?? null,
    precio: Number(data.precio) || 0,
    stock: Number(data.stock) || 0,
    imagen: data.imagen || '',
    descripcion: data.descripcion || '',
    activo: data.activo !== false,
  };
  db.productos.push(producto);
  saveDB(db);
  return producto;
}

export function updateProduct(id, changes) {
  const db = loadDB();
  const idx = db.productos.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  db.productos[idx] = { ...db.productos[idx], ...changes, id };
  saveDB(db);
  return db.productos[idx];
}

export function deleteProduct(id) {
  const db = loadDB();
  const before = db.productos.length;
  db.productos = db.productos.filter((p) => p.id !== id);
  saveDB(db);
  return db.productos.length < before;
}

export function getCriticalProducts(minStock = 10) {
  return loadDB().productos.filter((p) => p.stock < minStock);
}

// ---------------------- CRUD: CATEGORÍAS ----------------------

export function getCategories() {
  return loadDB().categorias;
}

export function getCategoryById(id) {
  return loadDB().categorias.find((c) => c.id === id) || null;
}

export function createCategory(data) {
  const db = loadDB();
  const categoria = {
    id: data.id || nextId(db, 'CAT-', 'categorias'),
    nombre: data.nombre,
    descripcion: data.descripcion || '',
    activo: data.activo !== false,
  };
  db.categorias.push(categoria);
  saveDB(db);
  return categoria;
}

export function updateCategory(id, changes) {
  const db = loadDB();
  const idx = db.categorias.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  db.categorias[idx] = { ...db.categorias[idx], ...changes, id };
  saveDB(db);
  return db.categorias[idx];
}

export function deleteCategory(id) {
  const db = loadDB();
  const before = db.categorias.length;
  db.categorias = db.categorias.filter((c) => c.id !== id);
  saveDB(db);
  return db.categorias.length < before;
}

// ---------------------- CRUD: USUARIOS ----------------------

export function getUsers() {
  return loadDB().usuarios;
}

export function getUserById(id) {
  return loadDB().usuarios.find((u) => u.id === id) || null;
}

export function getUsersByRole(rol) {
  return loadDB().usuarios.filter((u) => u.rol === rol);
}

export function createUser(data) {
  const db = loadDB();
  const usuario = {
    id: data.id || nextId(db, 'U-', 'usuarios'),
    run: data.run,
    nombre: data.nombre,
    email: data.email,
    password: data.password,
    telefono: data.telefono || '',
    rol: data.rol || 'Cliente',
    estado: data.estado || 'activo',
    comuna: data.comuna || '',
    direccion: data.direccion || '',
    creadoEn: data.creadoEn || new Date().toISOString(),
  };
  db.usuarios.push(usuario);
  saveDB(db);
  return usuario;
}

export function updateUser(id, changes) {
  const db = loadDB();
  const idx = db.usuarios.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  db.usuarios[idx] = { ...db.usuarios[idx], ...changes, id };
  saveDB(db);
  return db.usuarios[idx];
}

export function deleteUser(id) {
  const db = loadDB();
  const before = db.usuarios.length;
  db.usuarios = db.usuarios.filter((u) => u.id !== id);
  saveDB(db);
  return db.usuarios.length < before;
}

export function authenticate(email, password) {
  const user = loadDB().usuarios.find(
    (u) => u.email.toLowerCase() === String(email).toLowerCase() && u.password === password
  );
  if (!user) return { ok: false, error: 'Credenciales inválidas.' };
  if (user.estado !== 'activo') return { ok: false, error: 'Usuario desactivado.' };
  return { ok: true, user: { ...user, password: undefined } };
}

// ---------------------- CRUD: PEDIDOS ----------------------

export function getOrders() {
  return loadDB().pedidos;
}

export function getOrderById(id) {
  return loadDB().pedidos.find((p) => p.id === id) || null;
}

export function getOrdersByStatus(estado) {
  return loadDB().pedidos.filter((p) => p.estado === estado);
}

export function getOrdersByClient(clienteId) {
  return loadDB().pedidos.filter((p) => p.clienteId === clienteId);
}

export function getOrdersByDriver(repartidor) {
  return loadDB().pedidos.filter((p) => p.repartidor === repartidor);
}

export function createOrder(data) {
  const db = loadDB();
  const numero = 100000 + db.pedidos.length + 1;
  const pedido = {
    id: data.id || `GC-${numero}`,
    clienteId: data.clienteId || null,
    cliente: data.cliente,
    fono: data.fono || '',
    comuna: data.comuna,
    direccion: data.direccion,
    productoId: data.productoId,
    producto: data.producto,
    cantidad: Number(data.cantidad) || 1,
    total: Number(data.total) || 0,
    estado: data.estado || 'recibido',
    repartidor: data.repartidor || null,
    pago: data.pago || 'efectivo',
    fecha: data.fecha || new Date().toISOString(),
  };
  db.pedidos.push(pedido);
  saveDB(db);
  return pedido;
}

export function updateOrder(id, changes) {
  const db = loadDB();
  const idx = db.pedidos.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  db.pedidos[idx] = { ...db.pedidos[idx], ...changes, id };
  saveDB(db);
  return db.pedidos[idx];
}

export function assignOrder(id, repartidor) {
  return updateOrder(id, { repartidor, estado: 'asignado' });
}

export function changeOrderStatus(id, estado) {
  return updateOrder(id, { estado });
}

export function deleteOrder(id) {
  const db = loadDB();
  const before = db.pedidos.length;
  db.pedidos = db.pedidos.filter((p) => p.id !== id);
  saveDB(db);
  return db.pedidos.length < before;
}

// ---------------------- CRUD: OFERTAS ----------------------

export function getOffers() {
  return loadDB().ofertas;
}

export function getActiveOffers() {
  return loadDB().ofertas.filter((o) => o.activo);
}

export function createOffer(data) {
  const db = loadDB();
  const oferta = {
    id: data.id || nextId(db, 'OF-', 'ofertas'),
    titulo: data.titulo,
    descripcion: data.descripcion || '',
    productoId: data.productoId || null,
    descuento: Number(data.descuento) || 0,
    activo: data.activo !== false,
    imagen: data.imagen || '',
    vigencia: data.vigencia || '',
  };
  db.ofertas.push(oferta);
  saveDB(db);
  return oferta;
}

export function updateOffer(id, changes) {
  const db = loadDB();
  const idx = db.ofertas.findIndex((o) => o.id === id);
  if (idx === -1) return null;
  db.ofertas[idx] = { ...db.ofertas[idx], ...changes, id };
  saveDB(db);
  return db.ofertas[idx];
}

export function deleteOffer(id) {
  const db = loadDB();
  const before = db.ofertas.length;
  db.ofertas = db.ofertas.filter((o) => o.id !== id);
  saveDB(db);
  return db.ofertas.length < before;
}

// ---------------------- CRUD: BLOG ----------------------

export function getPosts() {
  return loadDB().blogs;
}

export function getPostById(id) {
  return loadDB().blogs.find((b) => b.id === id) || null;
}

export function createPost(data) {
  const db = loadDB();
  const post = {
    id: data.id || nextId(db, 'BLOG-', 'blogs'),
    titulo: data.titulo,
    categoria: data.categoria || 'Empresa',
    fecha: data.fecha || new Date().toISOString().slice(0, 10),
    resumen: data.resumen || '',
    contenido: data.contenido || '',
    autor: data.autor || 'Equipo Gas La Chispa',
    activo: data.activo !== false,
  };
  db.blogs.push(post);
  saveDB(db);
  return post;
}

export function updatePost(id, changes) {
  const db = loadDB();
  const idx = db.blogs.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  db.blogs[idx] = { ...db.blogs[idx], ...changes, id };
  saveDB(db);
  return db.blogs[idx];
}

export function deletePost(id) {
  const db = loadDB();
  const before = db.blogs.length;
  db.blogs = db.blogs.filter((b) => b.id !== id);
  saveDB(db);
  return db.blogs.length < before;
}

// ---------------------- UTILIDADES ----------------------

export function resetDB() {
  saveDB(clone(seedData));
  return clone(seedData);
}

export function getDBStats() {
  const db = loadDB();
  return {
    productos: db.productos.length,
    categorias: db.categorias.length,
    usuarios: db.usuarios.length,
    pedidos: db.pedidos.length,
    ofertas: db.ofertas.length,
    blogs: db.blogs.length,
    ventasTotales: db.pedidos
      .filter((p) => p.estado === 'entregado')
      .reduce((acc, p) => acc + p.total, 0),
    pedidosPendientes: db.pedidos.filter((p) => p.estado === 'recibido').length,
    productosCriticos: db.productos.filter((p) => p.stock < 10).length,
  };
}
