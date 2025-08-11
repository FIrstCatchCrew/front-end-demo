import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as OrderItemService from './OrderItemService';

// Mock the apiRequest module
vi.mock('./ApiRequest', () => ({
  apiRequest: vi.fn(),
}));

import { apiRequest } from './ApiRequest';

// Mock environment variable
vi.stubEnv('VITE_ORDER_ITEM_ENDPOINT', 'http://52.3.6.17:8080/api/order-item');

describe('OrderItemService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllOrderItems', () => {
    it('should call apiRequest with correct parameters', async () => {
      const mockData = [
        { 
          id: 1, 
          order: { id: 100 },
          fishCatch: { id: 200, price: 25.50 },
          quantity: 5
        },
        { 
          id: 2, 
          order: { id: 101 },
          fishCatch: { id: 201, price: 30.00 },
          quantity: 3
        }
      ];
      apiRequest.mockResolvedValue(mockData);

      const result = await OrderItemService.getAllOrderItems();

      expect(apiRequest).toHaveBeenCalledWith('http://52.3.6.17:8080/api/order-item', '/');
      expect(result).toEqual(mockData);
    });

    it('should handle empty order item list', async () => {
      apiRequest.mockResolvedValue([]);

      const result = await OrderItemService.getAllOrderItems();

      expect(apiRequest).toHaveBeenCalledWith('http://52.3.6.17:8080/api/order-item', '/');
      expect(result).toEqual([]);
    });
  });

  describe('getOrderItemById', () => {
    it('should call apiRequest with correct order item ID', async () => {
      const mockData = { 
        id: 123, 
        order: { id: 456 },
        fishCatch: { id: 789, price: 20.75 },
        quantity: 10
      };
      apiRequest.mockResolvedValue(mockData);

      const result = await OrderItemService.getOrderItemById(123);

      expect(apiRequest).toHaveBeenCalledWith('http://52.3.6.17:8080/api/order-item', '/123');
      expect(result).toEqual(mockData);
    });

    it('should handle large order item IDs', async () => {
      const largeOrderItemId = 999999999;
      const mockData = { 
        id: largeOrderItemId, 
        order: { id: 1 },
        fishCatch: { id: 1, price: 10.00 },
        quantity: 1
      };
      apiRequest.mockResolvedValue(mockData);

      await OrderItemService.getOrderItemById(largeOrderItemId);

      expect(apiRequest).toHaveBeenCalledWith('http://52.3.6.17:8080/api/order-item', '/999999999');
    });

    it('should handle zero order item ID', async () => {
      const mockData = { 
        id: 0, 
        order: { id: 1 },
        fishCatch: { id: 1, price: 15.00 },
        quantity: 1
      };
      apiRequest.mockResolvedValue(mockData);

      await OrderItemService.getOrderItemById(0);

      expect(apiRequest).toHaveBeenCalledWith('http://52.3.6.17:8080/api/order-item', '/0');
    });
  });

  describe('createOrderItem', () => {
    it('should call apiRequest with POST method and order item data', async () => {
      const newOrderItemData = {
        order: { id: 100 },
        fishCatch: { id: 200 },
        quantity: 5
      };
      const mockResponse = { 
        id: 1, 
        ...newOrderItemData,
        fishCatch: { ...newOrderItemData.fishCatch, price: 25.50 }
      };
      apiRequest.mockResolvedValue(mockResponse);

      const result = await OrderItemService.createOrderItem(newOrderItemData);

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/order-item',
        '/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newOrderItemData),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle minimal order item data', async () => {
      const minimalData = { 
        order: { id: 1 },
        fishCatch: { id: 1 },
        quantity: 1
      };
      const mockResponse = { id: 1, ...minimalData };
      apiRequest.mockResolvedValue(mockResponse);

      const result = await OrderItemService.createOrderItem(minimalData);

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/order-item',
        '/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(minimalData),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle decimal quantities and prices', async () => {
      const decimalData = {
        order: { id: 100 },
        fishCatch: { id: 200 },
        quantity: 2.5
      };
      const mockResponse = { 
        id: 1, 
        ...decimalData,
        fishCatch: { ...decimalData.fishCatch, price: 33.33 }
      };
      apiRequest.mockResolvedValue(mockResponse);

      await OrderItemService.createOrderItem(decimalData);

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/order-item',
        '/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(decimalData),
        }
      );
    });
  });

  describe('updateOrderItem', () => {
    it('should call apiRequest with PUT method and updated order item data', async () => {
      const orderItemId = 123;
      const updateData = {
        order: { id: 100 },
        fishCatch: { id: 200 },
        quantity: 8
      };
      const mockResponse = { 
        id: orderItemId, 
        ...updateData,
        fishCatch: { ...updateData.fishCatch, price: 28.00 }
      };
      apiRequest.mockResolvedValue(mockResponse);

      const result = await OrderItemService.updateOrderItem(orderItemId, updateData);

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/order-item',
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
      const orderItemId = 456;
      const partialUpdate = { quantity: 3 };
      const mockResponse = { 
        id: orderItemId, 
        order: { id: 100 },
        fishCatch: { id: 200, price: 25.00 },
        ...partialUpdate
      };
      apiRequest.mockResolvedValue(mockResponse);

      const result = await OrderItemService.updateOrderItem(orderItemId, partialUpdate);

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/order-item',
        '/456',
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(partialUpdate),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle price updates', async () => {
      const orderItemId = 789;
      const priceUpdate = { fishCatch: { id: 200, price: 35.99 } };
      const mockResponse = { 
        id: orderItemId, 
        order: { id: 100 },
        quantity: 4,
        ...priceUpdate
      };
      apiRequest.mockResolvedValue(mockResponse);

      await OrderItemService.updateOrderItem(orderItemId, priceUpdate);

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/order-item',
        '/789',
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(priceUpdate),
        }
      );
    });
  });

  describe('deleteOrderItemById', () => {
    it('should call apiRequest with DELETE method', async () => {
      const orderItemId = 456;
      apiRequest.mockResolvedValue(null);

      const result = await OrderItemService.deleteOrderItemById(orderItemId);

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/order-item',
        '/456',
        { method: 'DELETE' }
      );
      expect(result).toBeNull();
    });

    it('should handle successful deletion with different response types', async () => {
      const orderItemId = 789;
      apiRequest.mockResolvedValue(undefined);

      const result = await OrderItemService.deleteOrderItemById(orderItemId);

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/order-item',
        '/789',
        { method: 'DELETE' }
      );
      expect(result).toBeUndefined();
    });

    it('should handle deletion with confirmation response', async () => {
      const orderItemId = 999;
      const confirmationResponse = { deleted: true, id: orderItemId };
      apiRequest.mockResolvedValue(confirmationResponse);

      const result = await OrderItemService.deleteOrderItemById(orderItemId);

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/order-item',
        '/999',
        { method: 'DELETE' }
      );
      expect(result).toEqual(confirmationResponse);
    });
  });

  describe('error handling', () => {
    it('should propagate errors from getAllOrderItems', async () => {
      const error = new Error('Failed to fetch order items');
      apiRequest.mockRejectedValue(error);

      await expect(OrderItemService.getAllOrderItems()).rejects.toThrow('Failed to fetch order items');
    });

    it('should propagate errors from getOrderItemById', async () => {
      const error = new Error('Order item not found');
      apiRequest.mockRejectedValue(error);

      await expect(OrderItemService.getOrderItemById(999)).rejects.toThrow('Order item not found');
    });

    it('should propagate errors from createOrderItem', async () => {
      const error = new Error('Invalid order item data');
      apiRequest.mockRejectedValue(error);

      await expect(OrderItemService.createOrderItem({})).rejects.toThrow('Invalid order item data');
    });

    it('should propagate errors from updateOrderItem', async () => {
      const error = new Error('Update failed');
      apiRequest.mockRejectedValue(error);

      await expect(OrderItemService.updateOrderItem(123, {})).rejects.toThrow('Update failed');
    });

    it('should propagate errors from deleteOrderItemById', async () => {
      const error = new Error('Delete failed');
      apiRequest.mockRejectedValue(error);

      await expect(OrderItemService.deleteOrderItemById(123)).rejects.toThrow('Delete failed');
    });
  });

  describe('data validation scenarios', () => {
    it('should handle zero quantity and price values', async () => {
      const zeroData = {
        order: { id: 100 },
        fishCatch: { id: 200, price: 0 },
        quantity: 0
      };
      const mockResponse = { id: 1, ...zeroData };
      apiRequest.mockResolvedValue(mockResponse);

      await OrderItemService.createOrderItem(zeroData);

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/order-item',
        '/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(zeroData),
        }
      );
    });

    it('should handle large quantity and price values', async () => {
      const largeData = {
        order: { id: 100 },
        fishCatch: { id: 200, price: 999.99 },
        quantity: 999999.99
      };
      const mockResponse = { id: 1, ...largeData };
      apiRequest.mockResolvedValue(mockResponse);

      await OrderItemService.createOrderItem(largeData);

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/order-item',
        '/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(largeData),
        }
      );
    });
  });

  describe('data serialization', () => {
    it('should properly serialize order item data in create operations', async () => {
      const orderItemData = {
        order: { id: 123 },
        fishCatch: { id: 456, price: 29.99 },
        quantity: 2.5
      };
      apiRequest.mockResolvedValue({ id: 1, ...orderItemData });

      await OrderItemService.createOrderItem(orderItemData);

      const expectedBody = JSON.stringify(orderItemData);
      expect(apiRequest).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({
          body: expectedBody
        })
      );
    });

    it('should properly serialize order item data in update operations', async () => {
      const updateData = {
        quantity: 7.25,
        fishCatch: { id: 456, price: 32.50 }
      };
      apiRequest.mockResolvedValue({ id: 1, ...updateData });

      await OrderItemService.updateOrderItem(1, updateData);

      const expectedBody = JSON.stringify(updateData);
      expect(apiRequest).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({
          body: expectedBody
        })
      );
    });
  });
});