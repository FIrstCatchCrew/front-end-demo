import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as FisherService from './FisherService';

// Mock the apiRequest module
vi.mock('./ApiRequest', () => ({
  apiRequest: vi.fn(),
}));

import { apiRequest } from './ApiRequest';

// Mock environment variable
vi.stubEnv('VITE_FISHER_ENDPOINT', 'http://52.3.6.17:8080/api/fisher');

describe('FisherService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllFishers', () => {
    it('should call apiRequest with correct parameters', async () => {
      const mockData = [
        { id: 1, person: { id: 101, username: 'fisher1' }, fishingLicenseNumber: 'LIC001' },
        { id: 2, person: { id: 102, username: 'fisher2' }, fishingLicenseNumber: 'LIC002' }
      ];
      apiRequest.mockResolvedValue(mockData);

      const result = await FisherService.getAllFishers();

      expect(apiRequest).toHaveBeenCalledWith('http://52.3.6.17:8080/api/fisher', '/fisher');
      expect(result).toEqual(mockData);
    });
  });

  describe('getFisherById', () => {
    it('should call apiRequest with correct fisher ID', async () => {
      const mockData = { id: 123, person: { id: 456, username: 'testfisher' }, fishingLicenseNumber: 'LIC123' };
      apiRequest.mockResolvedValue(mockData);

      const result = await FisherService.getFisherById(123);

      expect(apiRequest).toHaveBeenCalledWith('http://52.3.6.17:8080/api/fisher', '/fisher/123');
      expect(result).toEqual(mockData);
    });
  });

  describe('getCatchesByFisherId', () => {
    it('should call apiRequest with correct fisher ID for catches', async () => {
      const mockData = [
        { id: 1, species: { name: 'Salmon' }, fisherId: 123 },
        { id: 2, species: { name: 'Tuna' }, fisherId: 123 }
      ];
      apiRequest.mockResolvedValue(mockData);

      const result = await FisherService.getCatchesByFisherId(123);

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/fisher',
        '/fisher/123/catches'
      );
      expect(result).toEqual(mockData);
    });
  });

  describe('getExpiredUnsoldCatchesByFisherId', () => {
    it('should call apiRequest with correct path for expired catches', async () => {
      const mockData = [
        { id: 1, species: { name: 'Cod' }, fisherId: 123, expired: true, sold: false }
      ];
      apiRequest.mockResolvedValue(mockData);

      const result = await FisherService.getExpiredUnsoldCatchesByFisherId(123);

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/fisher',
        '/fisher/123/catches/expired'
      );
      expect(result).toEqual(mockData);
    });
  });

  describe('getSoldCatchesByFisherId', () => {
    it('should call apiRequest with correct path for sold catches', async () => {
      const mockData = [
        { id: 1, species: { name: 'Mackerel' }, fisherId: 123, sold: true }
      ];
      apiRequest.mockResolvedValue(mockData);

      const result = await FisherService.getSoldCatchesByFisherId(123);

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/fisher',
        '/fisher/123/catches/sold'
      );
      expect(result).toEqual(mockData);
    });
  });

  describe('createFisher', () => {
    it('should call apiRequest with POST method and fisher data', async () => {
      const newFisherData = {
        person: { id: 456 },
        fishingLicenseNumber: 'LIC123',
        defaultLanding: { id: 789 }
      };
      const mockResponse = { id: 1, ...newFisherData };
      apiRequest.mockResolvedValue(mockResponse);

      const result = await FisherService.createFisher(newFisherData);

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/fisher',
        '/fisher',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newFisherData),
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateFisher', () => {
    it('should call apiRequest with PUT method and updated fisher data', async () => {
      const fisherId = 123;
      const updateData = {
        person: { id: 456 },
        fishingLicenseNumber: 'UPDATED123',
        defaultLanding: { id: 999 }
      };
      const mockResponse = { id: fisherId, ...updateData };
      apiRequest.mockResolvedValue(mockResponse);

      const result = await FisherService.updateFisher(fisherId, updateData);

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/fisher',
        '/fisher/123',
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData),
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteFisherById', () => {
    it('should call apiRequest with DELETE method', async () => {
      const fisherId = 456;
      apiRequest.mockResolvedValue(null);

      const result = await FisherService.deleteFisherById(fisherId);

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/fisher',
        '/fisher/456',
        { method: 'DELETE' }
      );
      expect(result).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('should handle large fisher IDs', async () => {
      const largeFisherId = 999999999;
      const mockData = { id: largeFisherId, person: { username: 'bigfisher' }, fishingLicenseNumber: 'BIGLICENSE' };
      apiRequest.mockResolvedValue(mockData);

      await FisherService.getFisherById(largeFisherId);

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/fisher',
        '/fisher/999999999'
      );
    });

    it('should handle zero fisher ID', async () => {
      const mockData = { id: 0, person: { username: 'zerofisher' }, fishingLicenseNumber: 'ZEROLICENSE' };
      apiRequest.mockResolvedValue(mockData);

      await FisherService.getFisherById(0);

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/fisher',
        '/fisher/0'
      );
    });
  });

  describe('error handling', () => {
    it('should propagate errors from apiRequest', async () => {
      const error = new Error('API Error');
      apiRequest.mockRejectedValue(error);

      await expect(FisherService.getAllFishers()).rejects.toThrow('API Error');
    });

    it('should propagate errors for specific fisher operations', async () => {
      const error = new Error('Fisher not found');
      apiRequest.mockRejectedValue(error);

      await expect(FisherService.getFisherById(999)).rejects.toThrow('Fisher not found');
    });

    it('should propagate errors for catch operations', async () => {
      const error = new Error('Catches fetch failed');
      apiRequest.mockRejectedValue(error);

      await expect(FisherService.getCatchesByFisherId(123)).rejects.toThrow('Catches fetch failed');
    });
  });
});