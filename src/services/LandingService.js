import { apiRequest } from './ApiRequest';

const LANDING_API_BASE_URL = import.meta.env.VITE_LANDING_ENDPOINT;

// GET /api/landing
export const getAllLandings = () => {
  return apiRequest(LANDING_API_BASE_URL, '');
};

// GET /api/landing/{id}
export const getLandingById = (id) => {
  return apiRequest(LANDING_API_BASE_URL, `/${id}`);
};

// POST /api/landing
export const createLanding = (landingData) => {
  return apiRequest(LANDING_API_BASE_URL, '', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(landingData),
  });
};

// PUT /api/landing/{id}
export const updateLanding = (id, landingData) => {
  return apiRequest(LANDING_API_BASE_URL, `/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(landingData),
  });
};

// DELETE /api/landing/{id}
export const deleteLandingById = (id) => {
  return apiRequest(LANDING_API_BASE_URL, `/${id}`, {
    method: 'DELETE',
  });
};