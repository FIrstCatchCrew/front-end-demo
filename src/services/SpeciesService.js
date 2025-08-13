import { apiRequest } from './ApiRequest';

const SPECIES_API_BASE_URL = import.meta.env.VITE_SPECIES_ENDPOINT;

// GET /api/species
export const getAllSpecies = () => {
  return apiRequest(SPECIES_API_BASE_URL, '');
};

// GET /api/species/{id}
export const getSpeciesById = (id) => {
  return apiRequest(SPECIES_API_BASE_URL, `/${id}`);
};

// POST /api/species
export const createSpecies = (speciesData) => {
  return apiRequest(SPECIES_API_BASE_URL, '', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(speciesData),
  });
};

// PUT /api/species/{id}
export const updateSpecies = (id, speciesData) => {
  return apiRequest(SPECIES_API_BASE_URL, `/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(speciesData),
  });
};

// DELETE /api/species/{id}
export const deleteSpeciesById = (id) => {
  return apiRequest(SPECIES_API_BASE_URL, `/${id}`, {
    method: 'DELETE',
  });
};