import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NewCatch from './NewCatch';

// Mock the hooks and services
vi.mock('../../hooks/useNewCatch', () => ({
  useNewCatch: vi.fn(),
}));

import { useNewCatch } from '../../hooks/useNewCatch';

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Helper function to render component with router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('NewCatch Component', () => {
  const mockHookReturn = {
    formData: {
      speciesId: '',
      fisherId: '',
      landingId: '',
      quantityInKg: '',
      pricePerKg: '',
    },
    dropdownOptions: {
      species: [
        { id: 1, name: 'Salmon' },
        { id: 2, name: 'Tuna' },
      ],
      fishers: [
        { id: 1, userName: 'fisher1' },
        { id: 2, userName: 'fisher2' },
      ],
      landings: [
        { id: 1, name: 'Port A' },
        { id: 2, name: 'Port B' },
      ],
    },
    isLoading: false,
    isSubmitting: false,
    error: null,
    validationErrors: {},
    handleInputChange: vi.fn(),
    handleSubmit: vi.fn(),
    resetForm: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useNewCatch.mockReturnValue(mockHookReturn);
  });

  describe('Loading State', () => {
    it('should show loading message when isLoading is true', () => {
      useNewCatch.mockReturnValue({
        ...mockHookReturn,
        isLoading: true,
      });

      renderWithRouter(<NewCatch />);

      expect(screen.getByText('Add New Catch')).toBeInTheDocument();
      expect(screen.getByText('Loading form data...')).toBeInTheDocument();
    });
  });

  describe('Form Rendering', () => {
    it('should render form with all required fields', () => {
      renderWithRouter(<NewCatch />);

      expect(screen.getByText('Add New Catch')).toBeInTheDocument();
      expect(screen.getByLabelText('Species *')).toBeInTheDocument();
      expect(screen.getByLabelText('Fisher *')).toBeInTheDocument();
      expect(screen.getByLabelText('Landing Port *')).toBeInTheDocument();
      expect(screen.getByLabelText('Quantity (kg) *')).toBeInTheDocument();
      expect(screen.getByLabelText('Price per kg ($) *')).toBeInTheDocument();
    });

    it('should render dropdown options correctly', () => {
      renderWithRouter(<NewCatch />);

      // Check species dropdown
      const speciesSelect = screen.getByLabelText('Species *');
      expect(speciesSelect).toBeInTheDocument();
      expect(screen.getByText('Select a species')).toBeInTheDocument();
      expect(screen.getByText('Salmon')).toBeInTheDocument();
      expect(screen.getByText('Tuna')).toBeInTheDocument();

      // Check fisher dropdown
      const fisherSelect = screen.getByLabelText('Fisher *');
      expect(fisherSelect).toBeInTheDocument();
      expect(screen.getByText('Select a fisher')).toBeInTheDocument();
      expect(screen.getByText('fisher1')).toBeInTheDocument();
      expect(screen.getByText('fisher2')).toBeInTheDocument();

      // Check landing dropdown
      const landingSelect = screen.getByLabelText('Landing Port *');
      expect(landingSelect).toBeInTheDocument();
      expect(screen.getByText('Select a landing port')).toBeInTheDocument();
      expect(screen.getByText('Port A')).toBeInTheDocument();
      expect(screen.getByText('Port B')).toBeInTheDocument();
    });

    it('should render form buttons', () => {
      renderWithRouter(<NewCatch />);

      expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Add Catch' })).toBeInTheDocument();
    });
  });

  describe('Form Interactions', () => {
    it('should call handleInputChange when form fields change', () => {
      renderWithRouter(<NewCatch />);

      const speciesSelect = screen.getByLabelText('Species *');
      
      // Simulate changing the select value
      Object.defineProperty(speciesSelect, 'value', {
        writable: true,
        value: '1'
      });
      speciesSelect.value = '1';
      
      fireEvent.change(speciesSelect);

      expect(mockHookReturn.handleInputChange).toHaveBeenCalledTimes(1);
      
      // Get the actual call and check the event properties
      const call = mockHookReturn.handleInputChange.mock.calls[0][0];
      expect(call.target.name).toBe('speciesId');
      expect(call.target.value).toBe('1');
    });

    it('should call handleSubmit when form is submitted', () => {
      renderWithRouter(<NewCatch />);

      const form = document.querySelector('.new-catch-form');
      fireEvent.submit(form);

      expect(mockHookReturn.handleSubmit).toHaveBeenCalled();
    });

    it('should call resetForm when reset button is clicked', () => {
      renderWithRouter(<NewCatch />);

      const resetButton = screen.getByRole('button', { name: 'Reset' });
      fireEvent.click(resetButton);

      expect(mockHookReturn.resetForm).toHaveBeenCalled();
    });
  });

  describe('Form State', () => {
    it('should display form data values correctly', () => {
      useNewCatch.mockReturnValue({
        ...mockHookReturn,
        formData: {
          speciesId: '1',
          fisherId: '2',
          landingId: '1',
          quantityInKg: '5.5',
          pricePerKg: '25.99',
        },
      });

      renderWithRouter(<NewCatch />);

      // Check select values by getting the elements and checking their value property
      const speciesSelect = screen.getByLabelText('Species *');
      const fisherSelect = screen.getByLabelText('Fisher *');
      const landingSelect = screen.getByLabelText('Landing Port *');
      
      expect(speciesSelect.value).toBe('1');
      expect(fisherSelect.value).toBe('2');
      expect(landingSelect.value).toBe('1');
      
      // Check input values normally
      expect(screen.getByDisplayValue('5.5')).toBeInTheDocument();
      expect(screen.getByDisplayValue('25.99')).toBeInTheDocument();
    });

    it('should disable form when submitting', () => {
      useNewCatch.mockReturnValue({
        ...mockHookReturn,
        isSubmitting: true,
      });

      renderWithRouter(<NewCatch />);

      expect(screen.getByLabelText('Species *')).toBeDisabled();
      expect(screen.getByLabelText('Fisher *')).toBeDisabled();
      expect(screen.getByLabelText('Landing Port *')).toBeDisabled();
      expect(screen.getByLabelText('Quantity (kg) *')).toBeDisabled();
      expect(screen.getByLabelText('Price per kg ($) *')).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Reset' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Adding Catch...' })).toBeDisabled();
    });
  });

  describe('Error Handling', () => {
    it('should display error message when error exists', () => {
      useNewCatch.mockReturnValue({
        ...mockHookReturn,
        error: { message: 'Failed to create catch' },
      });

      renderWithRouter(<NewCatch />);

      expect(screen.getByText('Error: Failed to create catch')).toBeInTheDocument();
    });

    it('should display validation errors', () => {
      useNewCatch.mockReturnValue({
        ...mockHookReturn,
        validationErrors: {
          speciesId: 'Species is required',
          quantityInKg: 'Quantity must be greater than 0',
        },
      });

      renderWithRouter(<NewCatch />);

      expect(screen.getByText('Species is required')).toBeInTheDocument();
      expect(screen.getByText('Quantity must be greater than 0')).toBeInTheDocument();
    });

    it('should apply error class to fields with validation errors', () => {
      useNewCatch.mockReturnValue({
        ...mockHookReturn,
        validationErrors: {
          speciesId: 'Species is required',
        },
      });

      renderWithRouter(<NewCatch />);

      const speciesSelect = screen.getByLabelText('Species *');
      expect(speciesSelect).toHaveClass('error');
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for form fields', () => {
      renderWithRouter(<NewCatch />);

      expect(screen.getByLabelText('Species *')).toBeInTheDocument();
      expect(screen.getByLabelText('Fisher *')).toBeInTheDocument();
      expect(screen.getByLabelText('Landing Port *')).toBeInTheDocument();
      expect(screen.getByLabelText('Quantity (kg) *')).toBeInTheDocument();
      expect(screen.getByLabelText('Price per kg ($) *')).toBeInTheDocument();
    });

    it('should have proper form structure', () => {
      renderWithRouter(<NewCatch />);

      const form = document.querySelector('.new-catch-form');
      expect(form).toBeInTheDocument();
      expect(form.tagName).toBe('FORM');
    });
  });

  describe('Edge Cases', () => {
    it('should handle fisher with username instead of userName', () => {
      useNewCatch.mockReturnValue({
        ...mockHookReturn,
        dropdownOptions: {
          ...mockHookReturn.dropdownOptions,
          fishers: [
            { id: 1, username: 'fisher1' },
            { id: 2, userName: 'fisher2' },
            { id: 3 }, // Fisher with neither username nor userName
          ],
        },
      });

      renderWithRouter(<NewCatch />);

      expect(screen.getByText('fisher1')).toBeInTheDocument();
      expect(screen.getByText('fisher2')).toBeInTheDocument();
      expect(screen.getByText('Fisher 3')).toBeInTheDocument();
    });

    it('should handle empty dropdown options', () => {
      useNewCatch.mockReturnValue({
        ...mockHookReturn,
        dropdownOptions: {
          species: [],
          fishers: [],
          landings: [],
        },
      });

      renderWithRouter(<NewCatch />);

      expect(screen.getByText('Select a species')).toBeInTheDocument();
      expect(screen.getByText('Select a fisher')).toBeInTheDocument();
      expect(screen.getByText('Select a landing port')).toBeInTheDocument();
    });
  });
});
