import { apiRequest } from './ApiRequest';

const ORDER_API_BASE_URL = import.meta.env.VITE_ORDER_ENDPOINT;

// GET /api/order
export const getAllOrders = () => {
  return apiRequest(ORDER_API_BASE_URL, '');
};

// GET /api/order/{id}
export const getOrderById = (id) => {
  return apiRequest(ORDER_API_BASE_URL, `/${id}`);
};

// GET /api/order/customer/{username}
export const getOrdersByCustomer = (username) => {
  return apiRequest(ORDER_API_BASE_URL, `/customer/${encodeURIComponent(username)}`);
};

// POST /api/order
export const createOrder = (orderData) => {
  return apiRequest(ORDER_API_BASE_URL, '/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
};

// PUT /api/order/{id}
export const updateOrder = (id, orderData) => {
  return apiRequest(ORDER_API_BASE_URL, `/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
};

// DELETE /api/order/{id}
export const deleteOrderById = (id) => {
  return apiRequest(ORDER_API_BASE_URL, `/${id}`, {
    method: 'DELETE',
  });
};