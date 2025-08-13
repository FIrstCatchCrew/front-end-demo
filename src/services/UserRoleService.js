import { apiRequest } from './ApiRequest';

const USER_ROLE_API_BASE_URL = import.meta.env.VITE_USER_ROLE_ENDPOINT;

// UserRoleType enum
export const UserRoleType = {
  ADMIN: 'ADMIN',
  FISHER: 'FISHER',
  CUSTOMER: 'CUSTOMER'
};

// GET /api/role
export const getAllUserRoles = () => {
  return apiRequest(USER_ROLE_API_BASE_URL, '');
};

// GET /api/role/{id}
export const getUserRoleById = (id) => {
  return apiRequest(USER_ROLE_API_BASE_URL, `/${id}`);
};

// GET /api/role/type/{type}
export const getUserRoleByType = (type) => {
  return apiRequest(USER_ROLE_API_BASE_URL, `/type/${encodeURIComponent(type.toUpperCase())}`);
};

// POST /api/role
export const createUserRole = (userRoleData) => {
  return apiRequest(USER_ROLE_API_BASE_URL, '/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userRoleData),
  });
};

// PUT /api/role/{id}
export const updateUserRole = (id, userRoleData) => {
  return apiRequest(USER_ROLE_API_BASE_URL, `/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userRoleData),
  });
};

// DELETE /api/role/{id}
export const deleteUserRoleById = (id) => {
  return apiRequest(USER_ROLE_API_BASE_URL, `/${id}`, {
    method: 'DELETE',
  });
};