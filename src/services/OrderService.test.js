import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as OrderService from './OrderService';

// Mock the apiRequest module
vi.mock('./ApiRequest', () => ({
  apiRequest: vi.fn(),
}));

import { apiRequest } from './ApiRequest';

// Mock environment variable
vi.stubEnv('VITE_ORDER_ENDPOINT', 'http://52.3.6.17:8080/api/order');

describe('OrderService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllOrders', () => {
    it('should call apiRequest with correct parameters', async () => {
      const mockData = [
        { 
          id: 1, 
          orderDateTime: '2025-01-10T10:30:00',
          orderStatus: 'PENDING',
          customer: { id: 100, username: 'customer1' },
          orderItems: []
        },
        { 
          id: 2, 
          orderDateTime: '2025-01-10T11:00:00',
          orderStatus: 'COMPLETED',
          customer: { id: 101, username: 'customer2' },
          orderItems: []
        }
      ];
      apiRequest.mockResolvedValue(mockData);

      const result = await OrderService.getAllOrders();

      expect(apiRequest).toHaveBeenCalledWith('http://52.3.6.17:8080/api/order', '/');
      expect(result).toEqual(mockData);
    });

    it('should handle empty order list', async () => {
      apiRequest.mockResolvedValue([]);

      const result = await OrderService.getAllOrders();

      expect(apiRequest).toHaveBeenCalledWith('http://52.3.6.17:8080/api/order', '/');
      expect(result).toEqual([]);
    });
  });

  describe('getOrderById', () => {
    it('should call apiRequest with correct order ID', async () => {
      const mockData = { 
        id: 123, 
        orderDateTime: '2025-01-10T12:00:00',
        orderStatus: 'PROCESSING',
        customer: { id: 456, username: 'customer123' },
        orderItems: [
          { id: 1, quantity: 2 }
        ]
      };
      apiRequest.mockResolvedValue(mockData);

      const result = await OrderService.getOrderById(123);

      expect(apiRequest).toHaveBeenCalledWith('http://52.3.6.17:8080/api/order', '/123');
      expect(result).toEqual(mockData);
    });

    it('should handle large order IDs', async () => {
      const largeOrderId = 999999999;
      const mockData = { 
        id: largeOrderId, 
        orderDateTime: '2025-01-10T15:00:00',
        orderStatus: 'PENDING',
        customer: { id: 1, username: 'user1' },
        orderItems: []
      };
      apiRequest.mockResolvedValue(mockData);

      await OrderService.getOrderById(largeOrderId);

      expect(apiRequest).toHaveBeenCalledWith('http://52.3.6.17:8080/api/order', '/999999999');
    });

    it('should handle zero order ID', async () => {
      const mockData = { 
        id: 0, 
        orderDateTime: '2025-01-10T16:00:00',
        orderStatus: 'PENDING',
        customer: { id: 1, username: 'user1' },
        orderItems: []
      };
      apiRequest.mockResolvedValue(mockData);

      await OrderService.getOrderById(0);

      expect(apiRequest).toHaveBeenCalledWith('http://52.3.6.17:8080/api/order', '/0');
    });
  });

  describe('getOrdersByCustomer', () => {
    it('should call apiRequest with correct customer username', async () => {
      const mockData = [
        { 
          id: 1, 
          orderDateTime: '2025-01-10T10:00:00',
          orderStatus: 'PENDING',
          customer: { id: 100, username: 'john_doe' },
          orderItems: []
        },
        { 
          id: 2, 
          orderDateTime: '2025-01-10T11:00:00',
          orderStatus: 'COMPLETED',
          customer: { id: 100, username: 'john_doe' },
          orderItems: []
        }
      ];
      apiRequest.mockResolvedValue(mockData);

      const result = await OrderService.getOrdersByCustomer('john_doe');

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/order',
        '/customer/john_doe'
      );
      expect(result).toEqual(mockData);
    });

    it('should handle usernames with special characters', async () => {
      const mockData = [{ 
        id: 1, 
        orderDateTime: '2025-01-10T12:00:00',
        orderStatus: 'PENDING',
        customer: { id: 50, username: 'user@email.com' },
        orderItems: []
      }];
      apiRequest.mockResolvedValue(mockData);

      await OrderService.getOrdersByCustomer('user@email.com');

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/order',
        '/customer/user%40email.com'
      );
    });

    it('should handle usernames with spaces', async () => {
      const mockData = [{ 
        id: 1, 
        orderDateTime: '2025-01-10T13:00:00',
        orderStatus: 'PENDING',
        customer: { id: 25, username: 'john doe' },
        orderItems: []
      }];
      apiRequest.mockResolvedValue(mockData);

      await OrderService.getOrdersByCustomer('john doe');

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/order',
        '/customer/john%20doe'
      );
    });

    it('should handle empty customer order list', async () => {
      apiRequest.mockResolvedValue([]);

      const result = await OrderService.getOrdersByCustomer('new_customer');

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/order',
        '/customer/new_customer'
      );
      expect(result).toEqual([]);
    });

    it('should handle special unicode characters in username', async () => {
      const mockData = [{ 
        id: 1, 
        orderDateTime: '2025-01-10T14:00:00',
        orderStatus: 'PENDING',
        customer: { id: 30, username: 'üser123' },
        orderItems: []
      }];
      apiRequest.mockResolvedValue(mockData);

      await OrderService.getOrdersByCustomer('üser123');

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/order',
        '/customer/%C3%BCser123'
      );
    });
  });

  describe('createOrder', () => {
    it('should call apiRequest with POST method and order data', async () => {
      const newOrderData = {
        orderDateTime: '2025-01-10T10:00:00',
        orderStatus: 'PENDING',
        customer: { id: 100 },
        orderItems: [
          { quantity: 3 }
        ]
      };
      const mockResponse = { id: 1, ...newOrderData };
      apiRequest.mockResolvedValue(mockResponse);

      const result = await OrderService.createOrder(newOrderData);

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/order',
        '/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newOrderData),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle minimal order data', async () => {
      const minimalData = { 
        orderDateTime: '2025-01-10T11:00:00',
        orderStatus: 'DRAFT',
        customer: { id: 1 },
        orderItems: []
      };
      const mockResponse = { id: 1, ...minimalData };
      apiRequest.mockResolvedValue(mockResponse);

      const result = await OrderService.createOrder(minimalData);

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/order',
        '/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(minimalData),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle complex order data with multiple items', async () => {
      const complexData = {
        orderDateTime: '2025-01-10T12:00:00',
        orderStatus: 'PENDING',
        customer: { id: 100 },
        orderItems: [
          { quantity: 2 },
          { quantity: 1.5 }
        ]
      };
      const mockResponse = { id: 1, ...complexData };
      apiRequest.mockResolvedValue(mockResponse);

      await OrderService.createOrder(complexData);

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/order',
        '/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(complexData),
        }
      );
    });
  });

  describe('updateOrder', () => {
    it('should call apiRequest with PUT method and updated order data', async () => {
      const orderId = 123;
      const updateData = {
        orderStatus: 'COMPLETED',
        orderDateTime: '2025-01-15T10:00:00'
      };
      const mockResponse = { 
        id: orderId, 
        customer: { id: 100 },
        orderItems: [],
        ...updateData 
      };
      apiRequest.mockResolvedValue(mockResponse);

      const result = await OrderService.updateOrder(orderId, updateData);

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/order',
        '/123',
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle partial updates', async () => {
      const orderId = 456;
      const partialUpdate = { orderStatus: 'SHIPPED' };
      const mockResponse = { 
        id: orderId, 
        customer: { id: 100 },
        orderItems: [],
        orderDateTime: '2025-01-10T10:00:00',
        ...partialUpdate
      };
      apiRequest.mockResolvedValue(mockResponse);

      const result = await OrderService.updateOrder(orderId, partialUpdate);

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/order',
        '/456',
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(partialUpdate),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle status updates', async () => {
      const orderId = 789;
      const statusUpdate = { 
        orderStatus: 'CANCELLED'
      };
      const mockResponse = { 
        id: orderId, 
        customer: { id: 100 },
        orderItems: [],
        orderDateTime: '2025-01-12T10:00:00',
        ...statusUpdate
      };
      apiRequest.mockResolvedValue(mockResponse);

      await OrderService.updateOrder(orderId, statusUpdate);

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/order',
        '/789',
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(statusUpdate),
        }
      );
    });
  });

  describe('deleteOrderById', () => {
    it('should call apiRequest with DELETE method', async () => {
      const orderId = 456;
      apiRequest.mockResolvedValue(null);

      const result = await OrderService.deleteOrderById(orderId);

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/order',
        '/456',
        { method: 'DELETE' }
      );
      expect(result).toBeNull();
    });

    it('should handle successful deletion with different response types', async () => {
      const orderId = 789;
      apiRequest.mockResolvedValue(undefined);

      const result = await OrderService.deleteOrderById(orderId);

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/order',
        '/789',
        { method: 'DELETE' }
      );
      expect(result).toBeUndefined();
    });

    it('should handle deletion with confirmation response', async () => {
      const orderId = 999;
      const confirmationResponse = { deleted: true, id: orderId, message: 'Order deleted successfully' };
      apiRequest.mockResolvedValue(confirmationResponse);

      const result = await OrderService.deleteOrderById(orderId);

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/order',
        '/999',
        { method: 'DELETE' }
      );
      expect(result).toEqual(confirmationResponse);
    });
  });

  describe('error handling', () => {
    it('should propagate errors from getAllOrders', async () => {
      const error = new Error('Failed to fetch orders');
      apiRequest.mockRejectedValue(error);

      await expect(OrderService.getAllOrders()).rejects.toThrow('Failed to fetch orders');
    });

    it('should propagate errors from getOrderById', async () => {
      const error = new Error('Order not found');
      apiRequest.mockRejectedValue(error);

      await expect(OrderService.getOrderById(999)).rejects.toThrow('Order not found');
    });

    it('should propagate errors from getOrdersByCustomer', async () => {
      const error = new Error('Customer not found');
      apiRequest.mockRejectedValue(error);

      await expect(OrderService.getOrdersByCustomer('nonexistent')).rejects.toThrow('Customer not found');
    });

    it('should propagate errors from createOrder', async () => {
      const error = new Error('Invalid order data');
      apiRequest.mockRejectedValue(error);

      await expect(OrderService.createOrder({})).rejects.toThrow('Invalid order data');
    });

    it('should propagate errors from updateOrder', async () => {
      const error = new Error('Update failed');
      apiRequest.mockRejectedValue(error);

      await expect(OrderService.updateOrder(123, {})).rejects.toThrow('Update failed');
    });

    it('should propagate errors from deleteOrderById', async () => {
      const error = new Error('Delete failed');
      apiRequest.mockRejectedValue(error);

      await expect(OrderService.deleteOrderById(123)).rejects.toThrow('Delete failed');
    });
  });

  describe('data serialization', () => {
    it('should properly serialize complex order objects in create operations', async () => {
      const complexOrderData = {
        orderDateTime: '2025-01-10T10:00:00',
        orderStatus: 'PENDING',
        customer: { id: 123 },
        orderItems: [
          { quantity: 2.5 },
          { quantity: 1 }
        ]
      };
      apiRequest.mockResolvedValue({ id: 1, ...complexOrderData });

      await OrderService.createOrder(complexOrderData);

      const expectedBody = JSON.stringify(complexOrderData);
      expect(apiRequest).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({
          body: expectedBody
        })
      );
    });

    it('should properly serialize complex order objects in update operations', async () => {
      const complexUpdate = {
        orderStatus: 'PROCESSING',
        orderItems: [
          { id: 1, quantity: 3 }
        ]
      };
      apiRequest.mockResolvedValue({ id: 1, ...complexUpdate });

      await OrderService.updateOrder(1, complexUpdate);

      const expectedBody = JSON.stringify(complexUpdate);
      expect(apiRequest).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({
          body: expectedBody
        })
      );
    });
  });

  describe('business logic scenarios', () => {
    it('should handle orders with draft status', async () => {
      const draftOrder = {
        orderDateTime: '2025-01-10T10:00:00',
        orderStatus: 'DRAFT',
        customer: { id: 100 },
        orderItems: []
      };
      const mockResponse = { id: 1, ...draftOrder };
      apiRequest.mockResolvedValue(mockResponse);

      await OrderService.createOrder(draftOrder);

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/order',
        '/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(draftOrder),
        }
      );
    });

    it('should handle orders with many items', async () => {
      const orderWithManyItems = {
        orderDateTime: '2025-01-10T11:00:00',
        orderStatus: 'PENDING',
        customer: { id: 100 },
        orderItems: [
          { quantity: 1 },
          { quantity: 2 },
          { quantity: 3 },
          { quantity: 4 },
          { quantity: 5 }
        ]
      };
      const mockResponse = { id: 1, ...orderWithManyItems };
      apiRequest.mockResolvedValue(mockResponse);

      await OrderService.createOrder(orderWithManyItems);

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/order',
        '/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderWithManyItems),
        }
      );
    });
  });
});