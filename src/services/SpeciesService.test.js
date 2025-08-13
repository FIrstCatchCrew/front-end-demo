import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the apiRequest module
vi.mock('./ApiRequest', () => ({
  apiRequest: vi.fn(),
}));

import * as SpeciesService from './SpeciesService';
import { apiRequest } from './ApiRequest';

describe('SpeciesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllSpecies', () => {
    it('should call apiRequest with correct parameters', async () => {
      const mockData = [
        { 
          id: 1, 
          name: 'Atlantic Salmon', 
          description: 'A popular salmon species',
          imageUrl: 'https://example.com/salmon.jpg',
          infoLink: 'https://example.com/salmon-info'
        },
        { 
          id: 2, 
          name: 'Pacific Tuna', 
          description: 'A large ocean fish',
          imageUrl: 'https://example.com/tuna.jpg',
          infoLink: 'https://example.com/tuna-info'
        }
      ];
      apiRequest.mockResolvedValue(mockData);

      const result = await SpeciesService.getAllSpecies();

      expect(apiRequest).toHaveBeenCalledWith("http://52.3.6.17:8080/api/species", '');
      expect(result).toEqual(mockData);
    });

    it('should handle empty species list', async () => {
      apiRequest.mockResolvedValue([]);

      const result = await SpeciesService.getAllSpecies();

      expect(apiRequest).toHaveBeenCalledWith("http://52.3.6.17:8080/api/species", '');
      expect(result).toEqual([]);
    });
  });

  describe('getSpeciesById', () => {
    it('should call apiRequest with correct species ID', async () => {
      const mockData = { 
        id: 123, 
        name: 'Cod',
        description: 'A popular commercial fish',
        imageUrl: 'https://example.com/cod.jpg',
        infoLink: 'https://example.com/cod-info'
      };
      apiRequest.mockResolvedValue(mockData);

      const result = await SpeciesService.getSpeciesById(123);

      expect(apiRequest).toHaveBeenCalledWith("http://52.3.6.17:8080/api/species", '/123');
      expect(result).toEqual(mockData);
    });

    it('should handle large species IDs', async () => {
      const largeSpeciesId = 999999999;
      const mockData = { 
        id: largeSpeciesId, 
        name: 'Rare Species', 
        description: 'A very rare species',
        imageUrl: null,
        infoLink: null
      };
      apiRequest.mockResolvedValue(mockData);

      await SpeciesService.getSpeciesById(largeSpeciesId);

      expect(apiRequest).toHaveBeenCalledWith("http://52.3.6.17:8080/api/species", '/999999999');
    });

    it('should handle zero species ID', async () => {
      const mockData = { 
        id: 0, 
        name: 'Test Species', 
        description: 'A test species',
        imageUrl: 'https://example.com/test.jpg',
        infoLink: 'https://example.com/test-info'
      };
      apiRequest.mockResolvedValue(mockData);

      await SpeciesService.getSpeciesById(0);

      expect(apiRequest).toHaveBeenCalledWith("http://52.3.6.17:8080/api/species", '/0');
    });
  });

  describe('createSpecies', () => {
    it('should call apiRequest with POST method and species data', async () => {
      const newSpeciesData = {
        name: 'New Fish Species',
        description: 'A newly discovered species',
        imageUrl: 'https://example.com/new-fish.jpg',
        infoLink: 'https://example.com/new-fish-info'
      };
      const mockResponse = { id: 1, ...newSpeciesData };
      apiRequest.mockResolvedValue(mockResponse);

      const result = await SpeciesService.createSpecies(newSpeciesData);

      expect(apiRequest).toHaveBeenCalledWith(
        "http://52.3.6.17:8080/api/species",
        '',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSpeciesData),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle minimal species data', async () => {
      const minimalData = { 
        name: 'Simple Fish',
        description: 'A simple fish species'
      };
      const mockResponse = { id: 1, ...minimalData };
      apiRequest.mockResolvedValue(mockResponse);

      const result = await SpeciesService.createSpecies(minimalData);

      expect(apiRequest).toHaveBeenCalledWith(
        "http://52.3.6.17:8080/api/species",
        '',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(minimalData),
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateSpecies', () => {
    it('should call apiRequest with PUT method and updated species data', async () => {
      const speciesId = 123;
      const updateData = {
        name: 'Updated Species Name',
        description: 'Updated description',
        imageUrl: 'https://example.com/updated.jpg',
        infoLink: 'https://example.com/updated-info'
      };
      const mockResponse = { id: speciesId, ...updateData };
      apiRequest.mockResolvedValue(mockResponse);

      const result = await SpeciesService.updateSpecies(speciesId, updateData);

      expect(apiRequest).toHaveBeenCalledWith(
        "http://52.3.6.17:8080/api/species",
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
      const speciesId = 456;
      const partialUpdate = { description: 'Only updating description' };
      const mockResponse = { 
        id: speciesId, 
        name: 'Existing Species',
        ...partialUpdate
      };
      apiRequest.mockResolvedValue(mockResponse);

      const result = await SpeciesService.updateSpecies(speciesId, partialUpdate);

      expect(apiRequest).toHaveBeenCalledWith(
        "http://52.3.6.17:8080/api/species",
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

  describe('deleteSpeciesById', () => {
    it('should call apiRequest with DELETE method', async () => {
      const speciesId = 456;
      apiRequest.mockResolvedValue(null);

      const result = await SpeciesService.deleteSpeciesById(speciesId);

      expect(apiRequest).toHaveBeenCalledWith(
        "http://52.3.6.17:8080/api/species",
        '/456',
        { method: 'DELETE' }
      );
      expect(result).toBeNull();
    });

    it('should handle successful deletion with different response types', async () => {
      const speciesId = 789;
      apiRequest.mockResolvedValue(undefined);

      const result = await SpeciesService.deleteSpeciesById(speciesId);

      expect(apiRequest).toHaveBeenCalledWith(
        "http://52.3.6.17:8080/api/species",
        '/789',
        { method: 'DELETE' }
      );
      expect(result).toBeUndefined();
    });

    it('should handle deletion with confirmation response', async () => {
      const speciesId = 999;
      const confirmationResponse = { 
        deleted: true, 
        id: speciesId, 
        message: 'Species deleted successfully'
      };
      apiRequest.mockResolvedValue(confirmationResponse);

      const result = await SpeciesService.deleteSpeciesById(speciesId);

      expect(apiRequest).toHaveBeenCalledWith(
        "http://52.3.6.17:8080/api/species",
        '/999',
        { method: 'DELETE' }
      );
      expect(result).toEqual(confirmationResponse);
    });
  });

  describe('error handling', () => {
    it('should propagate errors from getAllSpecies', async () => {
      const error = new Error('Failed to fetch species');
      apiRequest.mockRejectedValue(error);

      await expect(SpeciesService.getAllSpecies()).rejects.toThrow('Failed to fetch species');
    });

    it('should propagate errors from getSpeciesById', async () => {
      const error = new Error('Species not found');
      apiRequest.mockRejectedValue(error);

      await expect(SpeciesService.getSpeciesById(999)).rejects.toThrow('Species not found');
    });

    it('should propagate errors from createSpecies', async () => {
      const error = new Error('Species name already exists');
      apiRequest.mockRejectedValue(error);

      await expect(SpeciesService.createSpecies({})).rejects.toThrow('Species name already exists');
    });

    it('should propagate errors from updateSpecies', async () => {
      const error = new Error('Update failed - invalid data');
      apiRequest.mockRejectedValue(error);

      await expect(SpeciesService.updateSpecies(123, {})).rejects.toThrow('Update failed - invalid data');
    });

    it('should propagate errors from deleteSpeciesById', async () => {
      const error = new Error('Cannot delete - species has associated catches');
      apiRequest.mockRejectedValue(error);

      await expect(SpeciesService.deleteSpeciesById(123)).rejects.toThrow('Cannot delete - species has associated catches');
    });
  });

  describe('business logic scenarios', () => {
    it('should handle creating a new species', async () => {
      const newSpecies = {
        name: 'New Species',
        description: 'A newly discovered species',
        imageUrl: 'https://example.com/new.jpg',
        infoLink: 'https://example.com/new-info'
      };
      const mockResponse = { id: 1, ...newSpecies };
      apiRequest.mockResolvedValue(mockResponse);

      await SpeciesService.createSpecies(newSpecies);

      expect(apiRequest).toHaveBeenCalledWith(
        "http://52.3.6.17:8080/api/species",
        '',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSpecies),
        }
      );
    });

    it('should handle updating species information', async () => {
      const updateData = {
        description: 'Updated species description',
        imageUrl: 'https://example.com/updated-image.jpg'
      };
      const mockResponse = { id: 1, name: 'Existing Species', ...updateData };
      apiRequest.mockResolvedValue(mockResponse);

      await SpeciesService.updateSpecies(1, updateData);

      expect(apiRequest).toHaveBeenCalledWith(
        "http://52.3.6.17:8080/api/species",
        '/1',
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData),
        }
      );
    });
  });
});
