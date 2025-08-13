import { apiRequest } from './ApiRequest';

const FISHER_API_BASE_URL = import.meta.env.VITE_FISHER_ENDPOINT;

// GET /api/fisher
export const getAllFishers = () => {
  return apiRequest(FISHER_API_BASE_URL, '');
};

// GET /api/fisher/{id}
export const getFisherById = (id) => {
  return apiRequest(FISHER_API_BASE_URL, `/fisher/${id}`);
};

// GET /api/fisher/{id}/catches
export const getCatchesByFisherId = (id) => {
  return apiRequest(FISHER_API_BASE_URL, `/fisher/${id}/catches`);
};

// GET /api/fisher/{id}/catches/expired
export const getExpiredUnsoldCatchesByFisherId = (id) => {
  return apiRequest(FISHER_API_BASE_URL, `/fisher/${id}/catches/expired`);
};

// GET /api/fisher/{id}/catches/sold
export const getSoldCatchesByFisherId = (id) => {
  return apiRequest(FISHER_API_BASE_URL, `/fisher/${id}/catches/sold`);
};

// POST /api/fisher
export const createFisher = (fisherData) => {
  return apiRequest(FISHER_API_BASE_URL, '/fisher', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fisherData),
  });
};

// PUT /api/fisher/{id}
export const updateFisher = (id, fisherData) => {
  return apiRequest(FISHER_API_BASE_URL, `/fisher/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fisherData),
  });
};

// DELETE /api/fisher/{id}
export const deleteFisherById = (id) => {
  return apiRequest(FISHER_API_BASE_URL, `/fisher/${id}`, {
    method: 'DELETE',
  });
};
