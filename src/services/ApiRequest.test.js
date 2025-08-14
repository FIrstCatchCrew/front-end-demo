import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiRequest } from './ApiRequest';

// Mock fetch
window.fetch = vi.fn();

describe('apiRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Silence console during tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('makes a successful GET request and returns JSON', async () => {
    const mockData = { id: 1, name: 'Test' };
    window.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve(mockData),
    });

    const result = await apiRequest('https://api.example.com', '/test');

    expect(window.fetch).toHaveBeenCalledTimes(1);
    const [url, opts] = window.fetch.mock.calls[0];
    expect(url).toBe('https://api.example.com/test');
    expect(opts.method).toBe('GET');
    expect(opts.headers).toBeInstanceOf(Headers);
    expect(opts.headers.get('Accept')).toBe('application/json');
    expect(opts.headers.has('Content-Type')).toBe(false);
    expect(result).toEqual(mockData);
  });

  it('makes a POST request and merges headers correctly', async () => {
    const mockData = { id: 1, name: 'Created' };
    const postData = { name: 'New Item' };
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    };

    window.fetch.mockResolvedValue({
      ok: true,
      status: 201,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve(mockData),
    });

    const result = await apiRequest('https://api.example.com', '/items', options);

    expect(window.fetch).toHaveBeenCalledTimes(1);
    const [url, opts] = window.fetch.mock.calls[0];
    expect(url).toBe('https://api.example.com/items');
    expect(opts.method).toBe('POST');
    expect(opts.body).toBe(JSON.stringify(postData));
    expect(opts.headers).toBeInstanceOf(Headers);
    expect(opts.headers.get('Content-Type')).toBe('application/json');
    expect(opts.headers.get('Accept')).toBe('application/json');
    expect(result).toEqual(mockData);
  });

  it('returns null for 204 No Content', async () => {
    window.fetch.mockResolvedValue({
      ok: true,
      status: 204,
      headers: { get: () => 'application/json' },
    });

    const result = await apiRequest('https://api.example.com', '/delete');
    expect(result).toBeNull();
  });

  it('throws detailed error for HTTP 404 with body', async () => {
    const errorBody = 'Not Found';
    window.fetch.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      headers: { get: () => 'text/plain' },
      text: () => Promise.resolve(errorBody),
    });

    await expect(apiRequest('https://api.example.com', '/notfound')).rejects.toThrow(
      'HTTP 404 Not Found at https://api.example.com/notfound, body: Not Found'
    );
  });

  it('throws detailed error for HTTP 500 without body', async () => {
    window.fetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      headers: { get: () => 'text/plain' },
      text: () => Promise.resolve(''),
    });

    await expect(apiRequest('https://api.example.com', '/server-error')).rejects.toThrow(
      'HTTP 500 Internal Server Error at https://api.example.com/server-error'
    );
  });

  it('maps TypeError("Failed to fetch") to a user-friendly network error', async () => {
    window.fetch.mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(apiRequest('https://api.example.com', '/network-fail')).rejects.toThrow(
      /Failed to connect to server/
    );
    expect(window.fetch).toHaveBeenCalledTimes(1);
  });

  it('constructs the correct URL with baseUrl and path', async () => {
    window.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({}),
    });

    await apiRequest('https://api.example.com', '/users/123');

    const [url, opts] = window.fetch.mock.calls[0];
    expect(url).toBe('https://api.example.com/users/123');
    expect(opts.method).toBe('GET');
  });

  it('handles baseUrl trailing slash and path leading slash without double slash', async () => {
    window.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({}),
    });

    await apiRequest('https://api.example.com/', '/users');

    const [url] = window.fetch.mock.calls[0];
    expect(url).toBe('https://api.example.com/users');
  });

  it('passes through fetch options (method, body) and augments headers', async () => {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token123',
      },
      body: JSON.stringify({ data: 'test' }),
    };

    window.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({}),
    });

    await apiRequest('https://api.example.com', '/update', options);

    const [url, opts] = window.fetch.mock.calls[0];
    expect(url).toBe('https://api.example.com/update');
    expect(opts.method).toBe('PUT');
    expect(opts.body).toBe(options.body);
    expect(opts.headers).toBeInstanceOf(Headers);
    const hdrs = Object.fromEntries(opts.headers.entries());
    expect(hdrs['content-type']).toBe('application/json');
    expect(hdrs['authorization']).toBe('Bearer token123');
    expect(hdrs['accept']).toBe('application/json');
  });
});