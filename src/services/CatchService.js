import { apiRequest } from './ApiRequest';

const CATCH_API_BASE_URL = import.meta.env.VITE_CATCH_ENDPOINT;

// GET /api/catch
export const getAllCatches = () => {
  return apiRequest(CATCH_API_BASE_URL, '');
};

// GET /api/catch/available
export const getAvailableCatches = () => {
  return apiRequest(CATCH_API_BASE_URL, '/available');
};

// GET /api/catch/{id}
export const getCatchById = (id) => {
  return apiRequest(CATCH_API_BASE_URL, `/${id}`);
};

// GET /api/catch/species/{name}
export const getCatchesBySpeciesName = (name) => {
  // Note: This endpoint uses a path variable, not a query parameter
  return apiRequest(CATCH_API_BASE_URL, `/species/${encodeURIComponent(name)}`);
};

// GET /api/catch/search?speciesName={speciesName}&landingName={landingName}
export const searchCatches = (speciesName, landingName) => {
  // Build the query string, ensuring we only add params that exist
  const params = new URLSearchParams();
  if (speciesName) params.append('speciesName', speciesName);
  if (landingName) params.append('landingName', landingName);
  
  return apiRequest(CATCH_API_BASE_URL, `/search?${params.toString()}`);
};

// POST /api/catch
export const createCatch = (newCatchData) => {
  return apiRequest(CATCH_API_BASE_URL, '', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newCatchData),
  });
};

// PUT /api/catch/{id}
export const updateCatch = (id, catchData) => {
  return apiRequest(CATCH_API_BASE_URL, `/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(catchData),
  });
};

// PUT /api/catch/refresh
export const refreshAllAvailability = () => {
  return apiRequest(CATCH_API_BASE_URL, '/refresh', {
    method: 'PUT',
  });
};

// DELETE /api/catch/{id}
export const deleteCatchById = (id) => {
  return apiRequest(CATCH_API_BASE_URL, `/${id}`, {
    method: 'DELETE',
  });
};
