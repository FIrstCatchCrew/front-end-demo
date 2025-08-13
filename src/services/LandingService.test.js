import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as LandingService from './LandingService';

// Mock the apiRequest module
vi.mock('./ApiRequest', () => ({
  apiRequest: vi.fn(),
}));

import { apiRequest } from './ApiRequest';

// Mock environment variable
vi.stubEnv('VITE_LANDING_ENDPOINT', 'http://52.3.6.17:8080/api/landing');

describe('LandingService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllLandings', () => {
    it('should call apiRequest with correct parameters', async () => {
      const mockData = [
        { id: 1, name: 'Port Alpha', address: 'North Coast' },
        { id: 2, name: 'Port Beta', address: 'South Coast' }
      ];
      apiRequest.mockResolvedValue(mockData);

      const result = await LandingService.getAllLandings();

      expect(apiRequest).toHaveBeenCalledWith('http://52.3.6.17:8080/api/landing', '');
      expect(result).toEqual(mockData);
    });

    it('should handle empty landing list', async () => {
      apiRequest.mockResolvedValue([]);

      const result = await LandingService.getAllLandings();

      expect(apiRequest).toHaveBeenCalledWith('http://52.3.6.17:8080/api/landing', '');
      expect(result).toEqual([]);
    });
  });

  describe('getLandingById', () => {
    it('should call apiRequest with correct landing ID', async () => {
      const mockData = { 
        id: 123, 
        name: 'Harbor Point', 
        address: 'East Coast'
      };
      apiRequest.mockResolvedValue(mockData);

      const result = await LandingService.getLandingById(123);

      expect(apiRequest).toHaveBeenCalledWith('http://52.3.6.17:8080/api/landing', '/123');
      expect(result).toEqual(mockData);
    });

    it('should handle large landing IDs', async () => {
      const largeLandingId = 999999999;
      const mockData = { id: largeLandingId, name: 'Big Port', address: 'Remote Location' };
      apiRequest.mockResolvedValue(mockData);

      await LandingService.getLandingById(largeLandingId);

      expect(apiRequest).toHaveBeenCalledWith('http://52.3.6.17:8080/api/landing', '/999999999');
    });

    it('should handle zero landing ID', async () => {
      const mockData = { id: 0, name: 'Zero Port', address: 'Test Address' };
      apiRequest.mockResolvedValue(mockData);

      await LandingService.getLandingById(0);

      expect(apiRequest).toHaveBeenCalledWith('http://52.3.6.17:8080/api/landing', '/0');
    });
  });

  describe('createLanding', () => {
    it('should call apiRequest with POST method and landing data', async () => {
      const newLandingData = {
        name: 'New Marina',
        address: 'West Coast'
      };
      const mockResponse = { id: 1, ...newLandingData };
      apiRequest.mockResolvedValue(mockResponse);

      const result = await LandingService.createLanding(newLandingData);

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/landing',
        '',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newLandingData),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle minimal landing data', async () => {
      const minimalData = { name: 'Simple Port', address: 'Basic Address' };
      const mockResponse = { id: 1, ...minimalData };
      apiRequest.mockResolvedValue(mockResponse);

      const result = await LandingService.createLanding(minimalData);

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/landing',
        '',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(minimalData),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle complex landing data with nested objects', async () => {
      const complexData = {
        name: 'Complex Port',
        address: 'Island Coast'
      };
      const mockResponse = { id: 1, ...complexData };
      apiRequest.mockResolvedValue(mockResponse);

      await LandingService.createLanding(complexData);

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/landing',
        '',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(complexData),
        }
      );
    });
  });

  describe('updateLanding', () => {
    it('should call apiRequest with PUT method and updated landing data', async () => {
      const landingId = 123;
      const updateData = {
        name: 'Updated Port',
        address: 'Updated Location'
      };
      const mockResponse = { id: landingId, ...updateData };
      apiRequest.mockResolvedValue(mockResponse);

      const result = await LandingService.updateLanding(landingId, updateData);

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/landing',
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
      const landingId = 456;
      const partialUpdate = { name: 'New Name Only' };
      const mockResponse = { id: landingId, name: 'New Name Only', address: 'Existing Address' };
      apiRequest.mockResolvedValue(mockResponse);

      const result = await LandingService.updateLanding(landingId, partialUpdate);

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/landing',
        '/456',
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(partialUpdate),
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteLandingById', () => {
    it('should call apiRequest with DELETE method', async () => {
      const landingId = 456;
      apiRequest.mockResolvedValue(null);

      const result = await LandingService.deleteLandingById(landingId);

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/landing',
        '/456',
        { method: 'DELETE' }
      );
      expect(result).toBeNull();
    });

    it('should handle successful deletion with different response types', async () => {
      const landingId = 789;
      apiRequest.mockResolvedValue(undefined);

      const result = await LandingService.deleteLandingById(landingId);

      expect(apiRequest).toHaveBeenCalledWith(
        'http://52.3.6.17:8080/api/landing',
        '/789',
        { method: 'DELETE' }
      );
      expect(result).toBeUndefined();
    });
  });

  describe('error handling', () => {
    it('should propagate errors from getAllLandings', async () => {
      const error = new Error('Failed to fetch landings');
      apiRequest.mockRejectedValue(error);

      await expect(LandingService.getAllLandings()).rejects.toThrow('Failed to fetch landings');
    });

    it('should propagate errors from getLandingById', async () => {
      const error = new Error('Landing not found');
      apiRequest.mockRejectedValue(error);

      await expect(LandingService.getLandingById(999)).rejects.toThrow('Landing not found');
    });

    it('should propagate errors from createLanding', async () => {
      const error = new Error('Invalid landing data');
      apiRequest.mockRejectedValue(error);

      await expect(LandingService.createLanding({})).rejects.toThrow('Invalid landing data');
    });

    it('should propagate errors from updateLanding', async () => {
      const error = new Error('Update failed');
      apiRequest.mockRejectedValue(error);

      await expect(LandingService.updateLanding(123, {})).rejects.toThrow('Update failed');
    });

    it('should propagate errors from deleteLandingById', async () => {
      const error = new Error('Delete failed');
      apiRequest.mockRejectedValue(error);

      await expect(LandingService.deleteLandingById(123)).rejects.toThrow('Delete failed');
    });
  });

  describe('data serialization', () => {
    it('should properly serialize complex objects in create operations', async () => {
      const complexData = {
        name: 'Test Port',
        address: '123 Harbor Street, Port City'
      };
      apiRequest.mockResolvedValue({ id: 1, ...complexData });

      await LandingService.createLanding(complexData);

      const expectedBody = JSON.stringify(complexData);
      expect(apiRequest).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({
          body: expectedBody
        })
      );
    });

    it('should properly serialize complex objects in update operations', async () => {
      const complexUpdate = {
        name: 'Updated Port Name',
        address: '456 New Address, Updated City'
      };
      apiRequest.mockResolvedValue({ id: 1, ...complexUpdate });

      await LandingService.updateLanding(1, complexUpdate);

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
});