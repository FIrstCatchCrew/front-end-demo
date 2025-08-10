import { it, expect, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import FilterSelectionDropdown from './FilterSelectionDropdown';

describe('FilterSelectionDropdown', () => {
  const mockOptions = [
    { id: 1, name: 'Option 1' },
    { id: 2, name: 'Option 2' },
    { id: 3, name: 'Option 3' }
  ];

  const mockProps = {
    name: 'test-dropdown',
    value: '',
    onChange: () => {},
    options: mockOptions,
    defaultOptionLabel: 'Select an option'
  };

  it('should render the FilterSelectionDropdown component without errors', () => {
    expect(() => render(<FilterSelectionDropdown {...mockProps} />)).not.toThrow();
  });

  it('should display the default option label', () => {
    render(<FilterSelectionDropdown {...mockProps} />);
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  it('should render all provided options', () => {
    render(<FilterSelectionDropdown {...mockProps} />);
    
    mockOptions.forEach(option => {
      expect(screen.getByText(option.name)).toBeInTheDocument();
    });
  });

  it('should have the correct name attribute', () => {
    render(<FilterSelectionDropdown {...mockProps} />);
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toHaveAttribute('name', 'test-dropdown');
  });

  it('should display the selected value', () => {
    const propsWithValue = { ...mockProps, value: 'Option 2' };
    render(<FilterSelectionDropdown {...propsWithValue} />);
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toHaveValue('Option 2');
  });
});
