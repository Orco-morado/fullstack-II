import { API_BASE, TOKEN_KEY, api, clearToken, getToken, request, setToken } from '../api';

const originalFetch = window.fetch;

function crearFetchMock() {
  const mock = (url, options) => {
    mock.calls.push([url, options]);
    return Promise.resolve(mock.respuesta);
  };
  mock.calls = [];
  mock.respuesta = { ok: true, status: 200, text: async () => '' };
  mock.mockResolvedValue = (respuesta) => {
    mock.respuesta = respuesta;
  };
  return mock;
}

describe('api.js - cliente HTTP', () => {
  let fetchMock;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    fetchMock = crearFetchMock();
    window.fetch = fetchMock;
  });

  afterAll(() => {
    if (originalFetch) window.fetch = originalFetch;
    else delete window.fetch;
  });

  it('guarda el token en localStorage cuando remember es true', () => {
    setToken('token-123', true);

    expect(localStorage.getItem(TOKEN_KEY)).toBe('token-123');
    expect(sessionStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(getToken()).toBe('token-123');
  });

  it('guarda el token en sessionStorage cuando remember es false', () => {
    setToken('token-456', false);

    expect(sessionStorage.getItem(TOKEN_KEY)).toBe('token-456');
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(getToken()).toBe('token-456');
  });

  it('clearToken limpia ambos almacenamientos', () => {
    localStorage.setItem(TOKEN_KEY, 'a');
    sessionStorage.setItem(TOKEN_KEY, 'b');

    clearToken();

    expect(getToken()).toBeNull();
  });

  it('agrega el header Authorization cuando hay token', async () => {
    setToken('token-789', true);
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ hola: 'mundo' }),
    });

    const data = await request('/productos');
    const [url, options] = fetchMock.calls[0];

    expect(url).toBe(`${API_BASE}/productos`);
    expect(options.method).toBe('GET');
    expect(options.headers.Authorization).toBe('Bearer token-789');
    expect(data).toEqual({ hola: 'mundo' });
  });

  it('no agrega Authorization cuando auth es false', async () => {
    setToken('token-789', true);
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ token: 'nuevo' }),
    });

    await api.post('/auth/login', { email: 'a@b.cl', password: 'secreta' }, { auth: false });

    const [, options] = fetchMock.calls[0];
    expect(options.headers.Authorization).toBeUndefined();
    expect(options.body).toBe(JSON.stringify({ email: 'a@b.cl', password: 'secreta' }));
  });

  it('devuelve null en respuestas 204', async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 204, text: async () => '' });

    const result = await api.remove('/productos/VOL-005');

    expect(result).toBeNull();
  });

  it('lanza un error con status y mensaje del backend', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 409,
      text: async () => JSON.stringify({ status: 409, message: 'El correo ya esta registrado.' }),
    });

    let error;
    try {
      await request('/auth/registro', { method: 'POST', body: { email: 'a@b.cl' } });
    } catch (err) {
      error = err;
    }

    expect(error.status).toBe(409);
    expect(error.message).toBe('El correo ya esta registrado.');
  });

  it('emite auth:expired cuando una peticion autenticada devuelve 401', async () => {
    setToken('token-401', true);
    let avisos = 0;
    const handler = () => {
      avisos += 1;
    };
    window.addEventListener('auth:expired', handler);
    fetchMock.mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => JSON.stringify({ message: 'No autorizado' }),
    });

    try {
      let error;
      try {
        await request('/pedidos');
      } catch (err) {
        error = err;
      }
      expect(error.status).toBe(401);
      expect(avisos).toBe(1);
    } finally {
      window.removeEventListener('auth:expired', handler);
    }
  });
});
