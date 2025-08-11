import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the apiRequest module
vi.mock('./ApiRequest', () => ({
  apiRequest: vi.fn(),
}));

import * as UserRoleService from './UserRoleService';
import { apiRequest } from './ApiRequest';

describe('UserRoleService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('UserRoleType enum', () => {
    it('should export correct role type constants', () => {
      expect(UserRoleService.UserRoleType.ADMIN).toBe('ADMIN');
      expect(UserRoleService.UserRoleType.FISHER).toBe('FISHER');
      expect(UserRoleService.UserRoleType.CUSTOMER).toBe('CUSTOMER');
    });

    it('should have all expected role types', () => {
      const roleTypes = Object.keys(UserRoleService.UserRoleType);
      expect(roleTypes).toEqual(['ADMIN', 'FISHER', 'CUSTOMER']);
    });

    it('should have consistent values', () => {
      const roleValues = Object.values(UserRoleService.UserRoleType);
      expect(roleValues).toEqual(['ADMIN', 'FISHER', 'CUSTOMER']);
    });
  });

  describe('getAllUserRoles', () => {
    it('should call apiRequest with correct parameters', async () => {
      const mockData = [
        { id: 1, type: 'ADMIN', label: 'Administrator', description: 'Administrator role' },
        { id: 2, type: 'FISHER', label: 'Fisher', description: 'Fisher role' },
        { id: 3, type: 'CUSTOMER', label: 'Customer', description: 'Customer role' }
      ];
      apiRequest.mockResolvedValue(mockData);

      const result = await UserRoleService.getAllUserRoles();

      expect(apiRequest).toHaveBeenCalledWith(undefined, '/');
      expect(result).toEqual(mockData);
    });

    it('should handle empty roles list', async () => {
      apiRequest.mockResolvedValue([]);

      const result = await UserRoleService.getAllUserRoles();

      expect(apiRequest).toHaveBeenCalledWith(undefined, '/');
      expect(result).toEqual([]);
    });

    it('should handle roles with additional properties', async () => {
      const mockData = [
        { 
          id: 1, 
          type: 'ADMIN', 
          label: 'Administrator',
          description: 'Administrator role'
        }
      ];
      apiRequest.mockResolvedValue(mockData);

      const result = await UserRoleService.getAllUserRoles();

      expect(result).toEqual(mockData);
    });
  });

  describe('getUserRoleById', () => {
    it('should call apiRequest with correct role ID', async () => {
      const mockData = { 
        id: 123, 
        type: 'FISHER',
        label: 'Fisher',
        description: 'Fisher role'
      };
      apiRequest.mockResolvedValue(mockData);

      const result = await UserRoleService.getUserRoleById(123);

      expect(apiRequest).toHaveBeenCalledWith(undefined, '/123');
      expect(result).toEqual(mockData);
    });

    it('should handle large role IDs', async () => {
      const largeRoleId = 999999999;
      const mockData = { id: largeRoleId, type: 'ADMIN', label: 'Admin', description: 'Administrator role' };
      apiRequest.mockResolvedValue(mockData);

      await UserRoleService.getUserRoleById(largeRoleId);

      expect(apiRequest).toHaveBeenCalledWith(undefined, '/999999999');
    });

    it('should handle zero role ID', async () => {
      const mockData = { id: 0, type: 'CUSTOMER', label: 'Customer', description: 'Customer role' };
      apiRequest.mockResolvedValue(mockData);

      await UserRoleService.getUserRoleById(0);

      expect(apiRequest).toHaveBeenCalledWith(undefined, '/0');
    });
  });

  describe('getUserRoleByType', () => {
    it('should call apiRequest with correct role type and uppercase conversion', async () => {
      const mockData = { 
        id: 1, 
        type: 'ADMIN',
        label: 'Administrator',
        description: 'Administrator role'
      };
      apiRequest.mockResolvedValue(mockData);

      const result = await UserRoleService.getUserRoleByType('admin');

      expect(apiRequest).toHaveBeenCalledWith(
        undefined,
        '/type/ADMIN'
      );
      expect(result).toEqual(mockData);
    });

    it('should handle all role types from enum', async () => {
      const mockData = { id: 2, type: 'FISHER', label: 'Fisher', description: 'Fisher role' };
      apiRequest.mockResolvedValue(mockData);

      await UserRoleService.getUserRoleByType(UserRoleService.UserRoleType.FISHER);

      expect(apiRequest).toHaveBeenCalledWith(
        undefined,
        '/type/FISHER'
      );
    });

    it('should handle mixed case input', async () => {
      const mockData = { id: 3, type: 'CUSTOMER', label: 'Customer', description: 'Customer role' };
      apiRequest.mockResolvedValue(mockData);

      await UserRoleService.getUserRoleByType('CuStOmEr');

      expect(apiRequest).toHaveBeenCalledWith(
        undefined,
        '/type/CUSTOMER'
      );
    });

    it('should handle role types with special characters in URL encoding', async () => {
      const mockData = { id: 4, type: 'ADMIN', label: 'Admin', description: 'Admin role' };
      apiRequest.mockResolvedValue(mockData);

      await UserRoleService.getUserRoleByType('admin');

      expect(apiRequest).toHaveBeenCalledWith(
        undefined,
        '/type/ADMIN'
      );
    });
  });

  describe('createUserRole', () => {
    it('should call apiRequest with POST method and role data', async () => {
      const newRoleData = {
        type: 'ADMIN',
        label: 'Administrator',
        description: 'Administrator role'
      };
      const mockResponse = { id: 1, ...newRoleData };
      apiRequest.mockResolvedValue(mockResponse);

      const result = await UserRoleService.createUserRole(newRoleData);

      expect(apiRequest).toHaveBeenCalledWith(
        undefined,
        '/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newRoleData),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle minimal role data', async () => {
      const minimalData = { 
        type: 'CUSTOMER',
        label: 'Customer',
        description: 'Customer role'
      };
      const mockResponse = { id: 1, ...minimalData };
      apiRequest.mockResolvedValue(mockResponse);

      const result = await UserRoleService.createUserRole(minimalData);

      expect(apiRequest).toHaveBeenCalledWith(
        undefined,
        '/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(minimalData),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle role creation with enum values', async () => {
      const enumRoleData = {
        type: UserRoleService.UserRoleType.FISHER,
        label: 'Fisher',
        description: 'Fisher role'
      };
      const mockResponse = { id: 1, ...enumRoleData };
      apiRequest.mockResolvedValue(mockResponse);

      await UserRoleService.createUserRole(enumRoleData);

      expect(apiRequest).toHaveBeenCalledWith(
        undefined,
        '/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(enumRoleData),
        }
      );
    });
  });

  describe('updateUserRole', () => {
    it('should call apiRequest with PUT method and updated role data', async () => {
      const roleId = 123;
      const updateData = {
        type: 'FISHER',
        label: 'Updated Fisher',
        description: 'Updated fisher role'
      };
      const mockResponse = { id: roleId, ...updateData };
      apiRequest.mockResolvedValue(mockResponse);

      const result = await UserRoleService.updateUserRole(roleId, updateData);

      expect(apiRequest).toHaveBeenCalledWith(
        undefined,
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
      const roleId = 456;
      const partialUpdate = { 
        description: 'Updated description only'
      };
      const mockResponse = { 
        id: roleId, 
        type: 'ADMIN',
        label: 'Administrator',
        ...partialUpdate
      };
      apiRequest.mockResolvedValue(mockResponse);

      const result = await UserRoleService.updateUserRole(roleId, partialUpdate);

      expect(apiRequest).toHaveBeenCalledWith(
        undefined,
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

  describe('deleteUserRoleById', () => {
    it('should call apiRequest with DELETE method', async () => {
      const roleId = 456;
      apiRequest.mockResolvedValue(null);

      const result = await UserRoleService.deleteUserRoleById(roleId);

      expect(apiRequest).toHaveBeenCalledWith(
        undefined,
        '/456',
        { method: 'DELETE' }
      );
      expect(result).toBeNull();
    });

    it('should handle successful deletion with different response types', async () => {
      const roleId = 789;
      apiRequest.mockResolvedValue(undefined);

      const result = await UserRoleService.deleteUserRoleById(roleId);

      expect(apiRequest).toHaveBeenCalledWith(
        undefined,
        '/789',
        { method: 'DELETE' }
      );
      expect(result).toBeUndefined();
    });

    it('should handle deletion with confirmation response', async () => {
      const roleId = 999;
      const confirmationResponse = { 
        deleted: true, 
        id: roleId, 
        message: 'Role deleted successfully',
        affectedUsers: 5
      };
      apiRequest.mockResolvedValue(confirmationResponse);

      const result = await UserRoleService.deleteUserRoleById(roleId);

      expect(apiRequest).toHaveBeenCalledWith(
        undefined,
        '/999',
        { method: 'DELETE' }
      );
      expect(result).toEqual(confirmationResponse);
    });
  });

  describe('error handling', () => {
    it('should propagate errors from getAllUserRoles', async () => {
      const error = new Error('Failed to fetch roles');
      apiRequest.mockRejectedValue(error);

      await expect(UserRoleService.getAllUserRoles()).rejects.toThrow('Failed to fetch roles');
    });

    it('should propagate errors from getUserRoleById', async () => {
      const error = new Error('Role not found');
      apiRequest.mockRejectedValue(error);

      await expect(UserRoleService.getUserRoleById(999)).rejects.toThrow('Role not found');
    });

    it('should propagate errors from getUserRoleByType', async () => {
      const error = new Error('Invalid role type');
      apiRequest.mockRejectedValue(error);

      await expect(UserRoleService.getUserRoleByType('INVALID')).rejects.toThrow('Invalid role type');
    });

    it('should propagate errors from createUserRole', async () => {
      const error = new Error('Role name already exists');
      apiRequest.mockRejectedValue(error);

      await expect(UserRoleService.createUserRole({})).rejects.toThrow('Role name already exists');
    });

    it('should propagate errors from updateUserRole', async () => {
      const error = new Error('Permission denied');
      apiRequest.mockRejectedValue(error);

      await expect(UserRoleService.updateUserRole(123, {})).rejects.toThrow('Permission denied');
    });

    it('should propagate errors from deleteUserRoleById', async () => {
      const error = new Error('Cannot delete - role has active users');
      apiRequest.mockRejectedValue(error);

      await expect(UserRoleService.deleteUserRoleById(123)).rejects.toThrow('Cannot delete - role has active users');
    });
  });

  describe('business logic scenarios', () => {
    it('should handle creating a new role', async () => {
      const newRole = {
        type: 'ADMIN',
        label: 'System Administrator',
        description: 'Full system access'
      };
      const mockResponse = { id: 1, ...newRole };
      apiRequest.mockResolvedValue(mockResponse);

      await UserRoleService.createUserRole(newRole);

      expect(apiRequest).toHaveBeenCalledWith(
        undefined,
        '/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newRole),
        }
      );
    });

    it('should handle updating role label and description', async () => {
      const updateData = {
        label: 'Updated Fisher Role',
        description: 'Updated description for fisher role'
      };
      const mockResponse = { id: 1, type: 'FISHER', ...updateData };
      apiRequest.mockResolvedValue(mockResponse);

      await UserRoleService.updateUserRole(1, updateData);

      expect(apiRequest).toHaveBeenCalledWith(
        undefined,
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
