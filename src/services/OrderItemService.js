import { apiRequest } from './ApiRequest';

const ORDER_ITEM_API_BASE_URL = import.meta.env.VITE_ORDER_ITEM_ENDPOINT;

// GET /api/order-item
export const getAllOrderItems = () => {
  return apiRequest(ORDER_ITEM_API_BASE_URL, '');
};

// GET /api/order-item/{id}
export const getOrderItemById = (id) => {
  return apiRequest(ORDER_ITEM_API_BASE_URL, `/${id}`);
};

// POST /api/order-item
export const createOrderItem = (orderItemData) => {
  return apiRequest(ORDER_ITEM_API_BASE_URL, '', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderItemData),
  });
};

// PUT /api/order-item/{id}
export const updateOrderItem = (id, orderItemData) => {
  return apiRequest(ORDER_ITEM_API_BASE_URL, `/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderItemData),
  });
};

// DELETE /api/order-item/{id}
export const deleteOrderItemById = (id) => {
  return apiRequest(ORDER_ITEM_API_BASE_URL, `/${id}`, {
    method: 'DELETE',
  });
};