import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiRequest } from './ApiRequest';

// Mock fetch
window.fetch = vi.fn();

describe('apiRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset console.error mock
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should make a successful GET request and return JSON data', async () => {
    const mockData = { id: 1, name: 'Test' };
    window.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockData),
    });

    const result = await apiRequest('https://api.example.com', '/test');

    expect(window.fetch).toHaveBeenCalledWith('https://api.example.com/test', {});
    expect(result).toEqual(mockData);
  });

  it('should make a POST request with options', async () => {
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
      json: () => Promise.resolve(mockData),
    });

    const result = await apiRequest('https://api.example.com', '/items', options);

    expect(window.fetch).toHaveBeenCalledWith('https://api.example.com/items', options);
    expect(result).toEqual(mockData);
  });

  it('should return null for 204 No Content response', async () => {
    window.fetch.mockResolvedValue({
      ok: true,
      status: 204,
    });

    const result = await apiRequest('https://api.example.com', '/delete');

    expect(result).toBeNull();
  });

  it('should throw error for HTTP error status with error body', async () => {
    const errorBody = 'Not Found';
    window.fetch.mockResolvedValue({
      ok: false,
      status: 404,
      text: () => Promise.resolve(errorBody),
    });

    await expect(apiRequest('https://api.example.com', '/notfound'))
      .rejects
      .toThrow('HTTP error! status: 404, body: Not Found');

    expect(console.error).toHaveBeenCalledWith(
      'API request failed for path: /notfound',
      expect.any(Error)
    );
  });

  it('should throw error for HTTP error status with empty error body', async () => {
    window.fetch.mockResolvedValue({
      ok: false,
      status: 500,
      text: () => Promise.resolve(''),
    });

    await expect(apiRequest('https://api.example.com', '/server-error'))
      .rejects
      .toThrow('HTTP error! status: 500, body: ');
  });

  it('should handle network errors and log them', async () => {
    const networkError = new Error('Network error');
    window.fetch.mockRejectedValue(networkError);

    await expect(apiRequest('https://api.example.com', '/network-fail'))
      .rejects
      .toThrow('Network error');

    expect(console.error).toHaveBeenCalledWith(
      'API request failed for path: /network-fail',
      networkError
    );
  });

  it('should construct the correct URL with baseUrl and path', async () => {
    window.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
    });

    await apiRequest('https://api.example.com', '/users/123');

    expect(window.fetch).toHaveBeenCalledWith('https://api.example.com/users/123', {});
  });

  it('should handle baseUrl with trailing slash and path with leading slash', async () => {
    window.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
    });

    await apiRequest('https://api.example.com/', '/users');

    expect(window.fetch).toHaveBeenCalledWith('https://api.example.com//users', {});
  });

  it('should pass through all fetch options', async () => {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token123',
      },
      body: JSON.stringify({ data: 'test' }),
    };

    window.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
    });

    await apiRequest('https://api.example.com', '/update', options);

    expect(window.fetch).toHaveBeenCalledWith('https://api.example.com/update', options);
  });
});