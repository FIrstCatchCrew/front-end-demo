import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as CatchService from './CatchService';

// Mock the apiRequest module
vi.mock('./ApiRequest', () => ({
  apiRequest: vi.fn(),
}));

import { apiRequest } from './ApiRequest';

// Mock environment variable
vi.stubEnv('VITE_CATCH_ENDPOINT', 'http://52.3.6.17:8080/api/catch');

describe('CatchService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllCatches', () => {
    it('should call apiRequest with correct parameters', async () => {
      const mockData = [{ 
        id: 1, 
        species: { name: 'Salmon' }, 
        available: true, 
        quantityInKg: 2.5,
        price: 15.99
      }];
      apiRequest.mockResolvedValue(mockData);

      const result = await CatchService.getAllCatches();

      expect(apiRequest).toHaveBeenCalledWith('http://52.3.6.17:8080/api/catch', '');
      expect(result).toEqual(mockData);
    });
  });

  describe('getAvailableCatches', () => {
    it('should call apiRequest with /available path', async () => {
      const mockData = [{ 
        id: 1, 
        species: { name: 'Tuna' }, 
        available: true,
        quantityInKg: 3.0,
        price: 25.50
      }];
      apiRequest.mockResolvedValue(mockData);

      const result = await CatchService.getAvailableCatches();

      expect(apiRequest).toHaveBeenCalledWith('http://52.3.6.17:8080/api/catch', '/available');
      expect(result).toEqual(mockData);
    });
  });

  describe('getCatchById', () => {
    it('should call apiRequest with correct catch ID', async () => {
      const mockData = { 
        id: 123, 
        species: { name: 'Cod' },
        available: true,
        quantityInKg: 1.8,
        price: 12.75
      };
      apiRequest.mockResolvedValue(mockData);

      const result = await CatchService.getCatchById(123);

      expect(apiRequest).toHaveBeenCalledWith('http://52.3.6.17:8080/api/catch', '/123');
      expect(result).toEqual(mockData);
    });
  });

  describe('getCatchesBySpeciesName', () => {
    it('should call apiRequest with encoded species name', async () => {
      const mockData = [{ 
        id: 1, 
        species: { name: 'Atlantic Salmon' },
        available: true,
        quantityInKg: 4.2,
        price: 28.99
      }];
      apiRequest.mockResolvedValue(mockData);

      const result = await CatchService.getCatchesBySpeciesName('Atlantic Salmon');

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/catch',
        '/species/Atlantic%20Salmon'
      );
      expect(result).toEqual(mockData);
    });

    it('should handle special characters in species name', async () => {
      const mockData = [{ 
        id: 1, 
        species: { name: 'Fish & Chips' },
        available: true,
        quantityInKg: 1.5,
        price: 18.50
      }];
      apiRequest.mockResolvedValue(mockData);

      await CatchService.getCatchesBySpeciesName('Fish & Chips');

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/catch',
        '/species/Fish%20%26%20Chips'
      );
    });
  });

  describe('searchCatches', () => {
    it('should call apiRequest with both speciesName and landingName parameters', async () => {
      const mockData = [{ 
        id: 1, 
        species: { name: 'Salmon' }, 
        landing: { name: 'Port A' },
        available: true,
        quantityInKg: 3.5,
        price: 22.00
      }];
      apiRequest.mockResolvedValue(mockData);

      const result = await CatchService.searchCatches('Salmon', 'Port A');

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/catch',
        '/search?speciesName=Salmon&landingName=Port+A'
      );
      expect(result).toEqual(mockData);
    });

    it('should call apiRequest with only speciesName when landingName is not provided', async () => {
      const mockData = [{ 
        id: 1, 
        species: { name: 'Tuna' },
        available: true,
        quantityInKg: 2.0,
        price: 19.99
      }];
      apiRequest.mockResolvedValue(mockData);

      const result = await CatchService.searchCatches('Tuna', '');

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/catch',
        '/search?speciesName=Tuna'
      );
      expect(result).toEqual(mockData);
    });

    it('should call apiRequest with only landingName when speciesName is not provided', async () => {
      const mockData = [{ 
        id: 1, 
        landing: { name: 'Port B' },
        available: true,
        quantityInKg: 1.2,
        price: 14.50
      }];
      apiRequest.mockResolvedValue(mockData);

      const result = await CatchService.searchCatches('', 'Port B');

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/catch',
        '/search?landingName=Port+B'
      );
      expect(result).toEqual(mockData);
    });

    it('should call apiRequest with empty query when neither parameter is provided', async () => {
      const mockData = [];
      apiRequest.mockResolvedValue(mockData);

      const result = await CatchService.searchCatches('', '');

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/catch',
        '/search?'
      );
      expect(result).toEqual(mockData);
    });

    it('should handle null and undefined parameters', async () => {
      const mockData = [];
      apiRequest.mockResolvedValue(mockData);

      await CatchService.searchCatches(null, undefined);

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/catch',
        '/search?'
      );
    });
  });

  describe('createCatch', () => {
    it('should call apiRequest with POST method and catch data', async () => {
      const newCatchData = { 
        species: { id: 1 }, 
        fisher: { id: 2 },
        quantityInKg: 5.0,
        price: 35.99
      };
      const mockResponse = { id: 1, ...newCatchData };
      apiRequest.mockResolvedValue(mockResponse);

      const result = await CatchService.createCatch(newCatchData);

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/catch',
        '',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newCatchData),
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateCatch', () => {
    it('should call apiRequest with PUT method and updated catch data', async () => {
      const catchId = 123;
      const updateData = { 
        species: { id: 2, name: 'Updated Fish' }, 
        quantityInKg: 10.0,
        price: 55.99
      };
      const mockResponse = { id: catchId, ...updateData };
      apiRequest.mockResolvedValue(mockResponse);

      const result = await CatchService.updateCatch(catchId, updateData);

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/catch',
        '/123',
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData),
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('refreshAllAvailability', () => {
    it('should call apiRequest with PUT method to refresh endpoint', async () => {
      const mockResponse = { message: 'Availability refreshed' };
      apiRequest.mockResolvedValue(mockResponse);

      const result = await CatchService.refreshAllAvailability();

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/catch',
        '/refresh',
        { method: 'PUT' }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteCatchById', () => {
    it('should call apiRequest with DELETE method', async () => {
      const catchId = 456;
      apiRequest.mockResolvedValue(null);

      const result = await CatchService.deleteCatchById(catchId);

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/catch',
        '/456',
        { method: 'DELETE' }
      );
      expect(result).toBeNull();
    });
  });

  describe('error handling', () => {
    it('should propagate errors from apiRequest', async () => {
      const error = new Error('API Error');
      apiRequest.mockRejectedValue(error);

      await expect(CatchService.getAllCatches()).rejects.toThrow('API Error');
    });
  });
});