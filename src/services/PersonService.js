import { apiRequest } from './ApiRequest';
import { UserRoleType } from './UserRoleService';

const PERSON_API_BASE_URL = import.meta.env.VITE_PERSON_ENDPOINT;

// GET /api/person
export const getAllPersons = () => {
  return apiRequest(PERSON_API_BASE_URL, '');
};

// GET /api/person/roles?role={role}
export const getPersonsByRoleType = (role) => {
  // Validate that the role is a valid UserRoleType
  const validRoles = Object.values(UserRoleType);
  if (!validRoles.includes(role)) {
    throw new Error(`Invalid role type: ${role}. Valid roles are: ${validRoles.join(', ')}`);
  }
  
  const params = new URLSearchParams();
  params.append('role', role);
  return apiRequest(PERSON_API_BASE_URL, `/roles?${params.toString()}`);
};

// GET /api/person/{id}/role
export const getRoleTypeByPersonId = (id) => {
  return apiRequest(PERSON_API_BASE_URL, `/${id}/role`);
};

// GET /api/person/{id}
export const getPersonById = (id) => {
  return apiRequest(PERSON_API_BASE_URL, `/${id}`);
};

// GET /api/person/username/{username}
export const getPersonByUsername = (username) => {
  return apiRequest(PERSON_API_BASE_URL, `/username/${encodeURIComponent(username)}`);
};

// POST /api/person/login
export const loginPerson = (credentials) => {
  return apiRequest(PERSON_API_BASE_URL, '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
};

// POST /api/person
export const createPerson = (personData) => {
  return apiRequest(PERSON_API_BASE_URL, '', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(personData),
  });
};

// PUT /api/person/{id}
export const updatePerson = (id, personData) => {
  return apiRequest(PERSON_API_BASE_URL, `/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(personData),
  });
};

// DELETE /api/person/{id}
export const deletePersonById = (id) => {
  return apiRequest(PERSON_API_BASE_URL, `/${id}`, {
    method: 'DELETE',
  });
};