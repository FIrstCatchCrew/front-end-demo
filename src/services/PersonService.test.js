import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the apiRequest module
vi.mock('./ApiRequest', () => ({
  apiRequest: vi.fn(),
}));

// Mock the UserRoleService module
vi.mock('./UserRoleService', () => ({
  UserRoleType: {
    ADMIN: 'ADMIN',
    FISHER: 'FISHER',
    CUSTOMER: 'CUSTOMER'
  }
}));

import * as PersonService from './PersonService';
import { apiRequest } from './ApiRequest';
import { UserRoleType } from './UserRoleService';

describe('PersonService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllPersons', () => {
    it('should call apiRequest with correct parameters', async () => {
      const mockData = [
        { 
          id: 1, 
          username: 'johndoe', 
          email: 'john@example.com',
          role: { id: 1, type: 'ADMIN', label: 'Administrator', description: 'Admin role' }
        },
        { 
          id: 2, 
          username: 'janesmith', 
          email: 'jane@example.com',
          role: { id: 2, type: 'FISHER', label: 'Fisher', description: 'Fisher role' }
        }
      ];
      apiRequest.mockResolvedValue(mockData);

      const result = await PersonService.getAllPersons();

      expect(apiRequest).toHaveBeenCalledWith("http://52.3.6.17:8080/api/person", '/');
      expect(result).toEqual(mockData);
    });

    it('should handle empty persons list', async () => {
      apiRequest.mockResolvedValue([]);

      const result = await PersonService.getAllPersons();

      expect(apiRequest).toHaveBeenCalledWith("http://52.3.6.17:8080/api/person", '/');
      expect(result).toEqual([]);
    });
  });

  describe('getPersonsByRoleType', () => {
    it('should call apiRequest with correct role parameter', async () => {
      const mockData = [
        { 
          id: 1, 
          username: 'fisher1', 
          email: 'fisher1@example.com',
          role: { id: 2, type: 'FISHER', label: 'Fisher', description: 'Fisher role' }
        },
        { 
          id: 2, 
          username: 'fisher2', 
          email: 'fisher2@example.com',
          role: { id: 2, type: 'FISHER', label: 'Fisher', description: 'Fisher role' }
        }
      ];
      apiRequest.mockResolvedValue(mockData);

      const result = await PersonService.getPersonsByRoleType(UserRoleType.FISHER);

      expect(apiRequest).toHaveBeenCalledWith(
        "http://52.3.6.17:8080/api/person",
        '/roles?role=FISHER'
      );
      expect(result).toEqual(mockData);
    });

    it('should handle all role types', async () => {
      const mockData = [{ 
        id: 1, 
        username: 'admin', 
        email: 'admin@example.com',
        role: { id: 1, type: 'ADMIN', label: 'Administrator', description: 'Admin role' }
      }];
      apiRequest.mockResolvedValue(mockData);

      await PersonService.getPersonsByRoleType(UserRoleType.ADMIN);

      expect(apiRequest).toHaveBeenCalledWith(
        "http://52.3.6.17:8080/api/person",
        '/roles?role=ADMIN'
      );
    });

    it('should validate role type and throw error for invalid roles', async () => {
      try {
        await PersonService.getPersonsByRoleType('INVALID_ROLE');
        expect.fail('Expected function to throw an error');
      } catch (error) {
        expect(error.message).toBe('Invalid role type: INVALID_ROLE. Valid roles are: ADMIN, FISHER, CUSTOMER');
      }
    });

    it('should accept valid role strings', async () => {
      const mockData = [{ 
        id: 1, 
        username: 'customer', 
        email: 'customer@example.com',
        role: { id: 3, type: 'CUSTOMER', label: 'Customer', description: 'Customer role' }
      }];
      apiRequest.mockResolvedValue(mockData);

      const result = await PersonService.getPersonsByRoleType('CUSTOMER');

      expect(apiRequest).toHaveBeenCalledWith(
        "http://52.3.6.17:8080/api/person",
        '/roles?role=CUSTOMER'
      );
      expect(result).toEqual(mockData);
    });

    it('should handle empty results for role type', async () => {
      apiRequest.mockResolvedValue([]);

      const result = await PersonService.getPersonsByRoleType(UserRoleType.ADMIN);

      expect(apiRequest).toHaveBeenCalledWith(
        "http://52.3.6.17:8080/api/person",
        '/roles?role=ADMIN'
      );
      expect(result).toEqual([]);
    });

    it('should validate role before making API call', async () => {
      // Test that invalid role throws error without calling API
      try {
        await PersonService.getPersonsByRoleType('NOT_A_ROLE');
        // If we reach this line, the test should fail because no error was thrown
        expect.fail('Expected function to throw an error');
      } catch (error) {
        expect(error.message).toBe('Invalid role type: NOT_A_ROLE. Valid roles are: ADMIN, FISHER, CUSTOMER');
      }

      expect(apiRequest).not.toHaveBeenCalled();
    });
  });

  describe('getRoleTypeByPersonId', () => {
    it('should call apiRequest with correct person ID', async () => {
      const mockData = 'FISHER';
      apiRequest.mockResolvedValue(mockData);

      const result = await PersonService.getRoleTypeByPersonId(123);

      expect(apiRequest).toHaveBeenCalledWith("http://52.3.6.17:8080/api/person", '/123/role');
      expect(result).toEqual(mockData);
    });

    it('should handle large person IDs', async () => {
      const largePersonId = 999999999;
      apiRequest.mockResolvedValue('ADMIN');

      await PersonService.getRoleTypeByPersonId(largePersonId);

      expect(apiRequest).toHaveBeenCalledWith("http://52.3.6.17:8080/api/person", '/999999999/role');
    });
  });

  describe('getPersonById', () => {
    it('should call apiRequest with correct person ID', async () => {
      const mockData = { 
        id: 123, 
        username: 'johndoe',
        email: 'john.doe@example.com',
        role: { id: 3, type: 'CUSTOMER', label: 'Customer', description: 'Customer role' }
      };
      apiRequest.mockResolvedValue(mockData);

      const result = await PersonService.getPersonById(123);

      expect(apiRequest).toHaveBeenCalledWith("http://52.3.6.17:8080/api/person", '/123');
      expect(result).toEqual(mockData);
    });

    it('should handle zero person ID', async () => {
      const mockData = { 
        id: 0, 
        username: 'zerouser', 
        email: 'zero@example.com',
        role: { id: 1, type: 'ADMIN', label: 'Administrator', description: 'Admin role' }
      };
      apiRequest.mockResolvedValue(mockData);

      await PersonService.getPersonById(0);

      expect(apiRequest).toHaveBeenCalledWith("http://52.3.6.17:8080/api/person", '/0');
    });
  });

  describe('getPersonByUsername', () => {
    it('should call apiRequest with correct username', async () => {
      const mockData = { 
        id: 123, 
        username: 'johndoe',
        email: 'john@example.com',
        role: { id: 3, type: 'CUSTOMER', label: 'Customer', description: 'Customer role' }
      };
      apiRequest.mockResolvedValue(mockData);

      const result = await PersonService.getPersonByUsername('johndoe');

      expect(apiRequest).toHaveBeenCalledWith(
        "http://52.3.6.17:8080/api/person",
        '/username/johndoe'
      );
      expect(result).toEqual(mockData);
    });

    it('should handle usernames with special characters', async () => {
      const mockData = { 
        id: 1, 
        username: 'user@email.com',
        email: 'user@email.com',
        role: { id: 3, type: 'CUSTOMER', label: 'Customer', description: 'Customer role' }
      };
      apiRequest.mockResolvedValue(mockData);

      await PersonService.getPersonByUsername('user@email.com');

      expect(apiRequest).toHaveBeenCalledWith(
        "http://52.3.6.17:8080/api/person",
        '/username/user%40email.com'
      );
    });

    it('should handle usernames with spaces', async () => {
      const mockData = { 
        id: 1, 
        username: 'john doe',
        email: 'johndoe@example.com',
        role: { id: 3, type: 'CUSTOMER', label: 'Customer', description: 'Customer role' }
      };
      apiRequest.mockResolvedValue(mockData);

      await PersonService.getPersonByUsername('john doe');

      expect(apiRequest).toHaveBeenCalledWith(
        "http://52.3.6.17:8080/api/person",
        '/username/john%20doe'
      );
    });
  });

  describe('loginPerson', () => {
    it('should call apiRequest with POST method and credentials', async () => {
      const credentials = { email: 'john@example.com', password: 'password123' };
      const mockResponse = { 
        id: 1, 
        username: 'johndoe',
        email: 'john@example.com',
        role: { id: 3, type: 'CUSTOMER', label: 'Customer', description: 'Customer role' }
      };
      apiRequest.mockResolvedValue(mockResponse);

      const result = await PersonService.loginPerson(credentials);

      expect(apiRequest).toHaveBeenCalledWith(
        "http://52.3.6.17:8080/api/person",
        '/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle login with different credential formats', async () => {
      const credentials = { 
        email: 'admin@fishcrew.com', 
        password: 'secureAdminPass'
      };
      const mockResponse = { 
        id: 1, 
        username: 'admin',
        email: 'admin@fishcrew.com',
        role: { id: 1, type: 'ADMIN', label: 'Administrator', description: 'Admin role' }
      };
      apiRequest.mockResolvedValue(mockResponse);

      await PersonService.loginPerson(credentials);

      expect(apiRequest).toHaveBeenCalledWith(
        "http://52.3.6.17:8080/api/person",
        '/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        }
      );
    });
  });

  describe('createPerson', () => {
    it('should call apiRequest with POST method and person data', async () => {
      const newPersonData = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
        role: { id: 3, type: 'CUSTOMER', label: 'Customer', description: 'Customer role' }
      };
      const mockResponse = { id: 1, ...newPersonData };
      apiRequest.mockResolvedValue(mockResponse);

      const result = await PersonService.createPerson(newPersonData);

      expect(apiRequest).toHaveBeenCalledWith(
        "http://52.3.6.17:8080/api/person",
        '/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPersonData),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle minimal person data', async () => {
      const minimalData = { 
        username: 'minuser',
        email: 'min@example.com',
        password: 'password'
      };
      const mockResponse = { id: 1, ...minimalData };
      apiRequest.mockResolvedValue(mockResponse);

      const result = await PersonService.createPerson(minimalData);

      expect(apiRequest).toHaveBeenCalledWith(
        "http://52.3.6.17:8080/api/person",
        '/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(minimalData),
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updatePerson', () => {
    it('should call apiRequest with PUT method and updated person data', async () => {
      const personId = 123;
      const updateData = {
        username: 'updateduser',
        email: 'updated@example.com'
      };
      const mockResponse = { 
        id: personId, 
        password: 'hashedPassword',
        role: { id: 3, type: 'CUSTOMER', label: 'Customer', description: 'Customer role' },
        ...updateData 
      };
      apiRequest.mockResolvedValue(mockResponse);

      const result = await PersonService.updatePerson(personId, updateData);

      expect(apiRequest).toHaveBeenCalledWith(
        "http://52.3.6.17:8080/api/person",
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
      const personId = 456;
      const partialUpdate = { email: 'newemail@example.com' };
      const mockResponse = { 
        id: personId, 
        username: 'johndoe',
        password: 'hashedPassword',
        role: { id: 3, type: 'CUSTOMER', label: 'Customer', description: 'Customer role' },
        ...partialUpdate
      };
      apiRequest.mockResolvedValue(mockResponse);

      const result = await PersonService.updatePerson(personId, partialUpdate);

      expect(apiRequest).toHaveBeenCalledWith(
        "http://52.3.6.17:8080/api/person",
        '/456',
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(partialUpdate),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle password updates', async () => {
      const personId = 789;
      const passwordUpdate = { 
        password: 'newSecurePass123'
      };
      const mockResponse = { 
        id: personId, 
        username: 'johndoe',
        email: 'john@example.com',
        password: 'newHashedPassword',
        role: { id: 3, type: 'CUSTOMER', label: 'Customer', description: 'Customer role' }
      };
      apiRequest.mockResolvedValue(mockResponse);

      await PersonService.updatePerson(personId, passwordUpdate);

      expect(apiRequest).toHaveBeenCalledWith(
        "http://52.3.6.17:8080/api/person",
        '/789',
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(passwordUpdate),
        }
      );
    });
  });

  describe('deletePersonById', () => {
    it('should call apiRequest with DELETE method', async () => {
      const personId = 456;
      apiRequest.mockResolvedValue(null);

      const result = await PersonService.deletePersonById(personId);

      expect(apiRequest).toHaveBeenCalledWith(
        "http://52.3.6.17:8080/api/person",
        '/456',
        { method: 'DELETE' }
      );
      expect(result).toBeNull();
    });

    it('should handle successful deletion with different response types', async () => {
      const personId = 789;
      apiRequest.mockResolvedValue(undefined);

      const result = await PersonService.deletePersonById(personId);

      expect(apiRequest).toHaveBeenCalledWith(
        "http://52.3.6.17:8080/api/person",
        '/789',
        { method: 'DELETE' }
      );
      expect(result).toBeUndefined();
    });
  });

  describe('error handling', () => {
    it('should propagate errors from getAllPersons', async () => {
      const error = new Error('Failed to fetch persons');
      apiRequest.mockRejectedValue(error);

      await expect(PersonService.getAllPersons()).rejects.toThrow('Failed to fetch persons');
    });

    it('should propagate errors from getPersonsByRoleType', async () => {
      const error = new Error('Role fetch failed');
      apiRequest.mockRejectedValue(error);

      await expect(PersonService.getPersonsByRoleType(UserRoleType.FISHER)).rejects.toThrow('Role fetch failed');
    });

    it('should propagate errors from getPersonById', async () => {
      const error = new Error('Person not found');
      apiRequest.mockRejectedValue(error);

      await expect(PersonService.getPersonById(999)).rejects.toThrow('Person not found');
    });

    it('should propagate errors from getPersonByUsername', async () => {
      const error = new Error('Username not found');
      apiRequest.mockRejectedValue(error);

      await expect(PersonService.getPersonByUsername('nonexistent')).rejects.toThrow('Username not found');
    });

    it('should propagate errors from loginPerson', async () => {
      const error = new Error('Invalid credentials');
      apiRequest.mockRejectedValue(error);

      await expect(PersonService.loginPerson({ email: 'test', password: 'test' }))
        .rejects.toThrow('Invalid credentials');
    });

    it('should propagate errors from createPerson', async () => {
      const error = new Error('Email already exists');
      apiRequest.mockRejectedValue(error);

      await expect(PersonService.createPerson({})).rejects.toThrow('Email already exists');
    });

    it('should propagate errors from updatePerson', async () => {
      const error = new Error('Update failed');
      apiRequest.mockRejectedValue(error);

      await expect(PersonService.updatePerson(123, {})).rejects.toThrow('Update failed');
    });

    it('should propagate errors from deletePersonById', async () => {
      const error = new Error('Delete failed');
      apiRequest.mockRejectedValue(error);

      await expect(PersonService.deletePersonById(123)).rejects.toThrow('Delete failed');
    });
  });

  describe('business logic scenarios', () => {
    it('should handle creating a new person', async () => {
      const newPerson = {
        username: 'newperson',
        email: 'newperson@example.com',
        password: 'password123',
        role: { id: 3, type: 'CUSTOMER', label: 'Customer', description: 'Customer role' }
      };
      const mockResponse = { id: 1, ...newPerson };
      apiRequest.mockResolvedValue(mockResponse);

      await PersonService.createPerson(newPerson);

      expect(apiRequest).toHaveBeenCalledWith(
        "http://52.3.6.17:8080/api/person",
        '/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPerson),
        }
      );
    });

    it('should handle updating person information', async () => {
      const updateData = {
        email: 'updated@example.com',
        username: 'updatedusername'
      };
      const mockResponse = { 
        id: 1, 
        password: 'hashedPassword',
        role: { id: 3, type: 'CUSTOMER', label: 'Customer', description: 'Customer role' },
        ...updateData 
      };
      apiRequest.mockResolvedValue(mockResponse);

      await PersonService.updatePerson(1, updateData);

      expect(apiRequest).toHaveBeenCalledWith(
        "http://52.3.6.17:8080/api/person",
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
