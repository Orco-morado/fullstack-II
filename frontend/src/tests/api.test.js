import { API_BASE, TOKEN_KEY, api, clearToken, getToken, request, setToken } from '../api';

const originalFetch = global.fetch;

describe('api.js - cliente HTTP', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    global.fetch = jest.fn();
  });

  afterAll(() => {
    if (originalFetch) global.fetch = originalFetch;
    else delete global.fetch;
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
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ hola: 'mundo' }),
    });

    const data = await request('/productos');

    expect(global.fetch).toHaveBeenCalledWith(
      `${API_BASE}/productos`,
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({ Authorization: 'Bearer token-789' }),
      })
    );
    expect(data).toEqual({ hola: 'mundo' });
  });

  it('no agrega Authorization cuando auth es false', async () => {
    setToken('token-789', true);
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ token: 'nuevo' }),
    });

    await api.post('/auth/login', { email: 'a@b.cl', password: 'secreta' }, { auth: false });

    const [, options] = global.fetch.mock.calls[0];
    expect(options.headers.Authorization).toBeUndefined();
    expect(options.body).toBe(JSON.stringify({ email: 'a@b.cl', password: 'secreta' }));
  });

  it('devuelve null en respuestas 204', async () => {
    global.fetch.mockResolvedValue({ ok: true, status: 204, text: async () => '' });

    await expect(api.remove('/productos/VOL-005')).resolves.toBeNull();
  });

  it('lanza un error con status y mensaje del backend', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 409,
      text: async () =>
        JSON.stringify({ status: 409, error: 'Conflicto', message: 'El correo ya está registrado.' }),
    });

    await expect(
      request('/auth/registro', { method: 'POST', body: { email: 'a@b.cl' } })
    ).rejects.toMatchObject({
      status: 409,
      message: 'El correo ya está registrado.',
    });
  });
});
