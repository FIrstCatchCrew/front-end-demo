// Centralized API request helper used by all services
// - Avoids unnecessary CORS preflights (no Content-Type on GET)
// - Safe URL join (handles trailing/leading slashes)
// - Helpful debug logs (toggle with VITE_API_DEBUG=true)
// - Robust errors for ServiceTest page

const shouldDebug = (() => {
  try {
    return String(import.meta?.env?.VITE_API_DEBUG || '').toLowerCase() === 'true';
  } catch {
    return false;
  }
})();

const useProxy = (() => {
  try {
    const dev = Boolean(import.meta?.env?.DEV);
    const isVitest = Boolean(import.meta?.env?.VITEST) || String(import.meta?.env?.MODE).toLowerCase() === 'test';
    const flag = String(import.meta?.env?.VITE_FORCE_PROXY ?? 'true').toLowerCase();
    // Enable proxy only in real dev server, not in unit tests
    return dev && !isVitest && flag !== 'false';
  } catch {
    return false;
  }
})();

const joinUrl = (baseUrl = '', path = '') => {
  const base = String(baseUrl).replace(/\/+$/, '');
  const suffix = String(path || '');
  // If no path provided, return base as-is (no trailing slash)
  if (!suffix) return base;
  return `${base}${suffix.startsWith('/') ? suffix : `/${suffix}`}`;
};

const apiRequest = async (baseUrl, path = '', options = {}) => {
  // Validate baseUrl early for clearer errors in ServiceTest
  if (!baseUrl) {
    throw new Error(`API Base URL is undefined for path: ${path}. Check your .env (VITE_*_ENDPOINT).`);
  }
  if (!/^https?:\/\//i.test(baseUrl) && !baseUrl.startsWith('/')) {
    throw new Error(
      `API Base URL must start with http(s):// or be a relative path for a dev proxy. Got: "${baseUrl}"`
    );
  }

  // If using dev proxy, rewrite absolute URL to its path so requests hit Vite (localhost:5173)
  let baseForRequest = baseUrl;
  if (useProxy) {
    try {
      const u = new URL(baseUrl);
      baseForRequest = u.pathname || '/'; // e.g. http://host:8080/api/catch -> /api/catch
    } catch {
      // keep as-is if already relative or invalid URL
    }
  }

  const method = (options.method || 'GET').toUpperCase();
  const hasBody = options.body != null && method !== 'GET' && method !== 'HEAD';

  // Build headers: only set Content-Type when sending a body
  const headers = new Headers(options.headers || {});
  if (!headers.has('Accept')) headers.set('Accept', 'application/json');
  if (hasBody && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

  const fetchOptions = {
    // Don't force credentials/mode; leave defaults to minimize preflights
    ...options,
    method,
    headers,
  };

  const url = joinUrl(baseForRequest, path);

  if (shouldDebug) {
    console.log('=== API REQUEST ===');
    console.log(`Method: ${method}`);
    console.log(`URL: ${url}`);
    if (hasBody) console.log('Body:', options.body);
    if (headers && headers.size) console.log('Headers:', Object.fromEntries(headers.entries()));
    console.log('==================');
  }

  let response;
  try {
    response = await fetch(url, fetchOptions);
  } catch (err) {
    console.error(`Network error when fetching ${url}:`, err);

    const isFailedToFetch = err instanceof TypeError && /Failed to fetch/i.test(err.message);
    if (isFailedToFetch) {
      throw new Error(
        `Failed to connect to server at ${url}. This could mean:\n` +
          `1. The server is not running or not accessible\n` +
          `2. Network connectivity issues\n` +
          `3. CORS policy blocking the request (add http://localhost:5173 to backend CORS or use the Vite proxy)\n` +
          `4. Firewall or port blocking\n` +
          `5. Wrong IP address or port\n\n` +
          `Original error: ${err.message}`
      );
    }
    throw err;
  }

  const contentType = response.headers.get('content-type') || '';
  if (shouldDebug) {
    console.log(`Response status: ${response.status}, Content-Type: ${contentType}`);
  }

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    const looksHtml = /<\s*!doctype|<\s*html/i.test(text);
    if (looksHtml) {
      throw new Error(
        `HTTP ${response.status} at ${url}. Server returned HTML instead of JSON. Possible causes:\n` +
          `1) Wrong API URL or route\n` +
          `2) Server not running or reverse proxy misroute\n` +
          `3) CORS middleware not applied to this route\n` +
          `Received (first 200 chars): ${text.slice(0, 200)}...`
      );
    }
    throw new Error(`HTTP ${response.status} ${response.statusText} at ${url}${text ? `, body: ${text}` : ''}`);
  }

  if (response.status === 204) return null;

  if (/application\/json/i.test(contentType)) {
    return response.json();
  }

  const raw = await response.text();
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    console.warn(
      `Non-JSON response from ${url}. Returning text. Content-Type: "${contentType || 'unknown'}"`
    );
    return raw;
  }
};

export { apiRequest };
