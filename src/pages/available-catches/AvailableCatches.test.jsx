import { it, expect, describe, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AvailableCatches from './AvailableCatches';

// Mock the navigate function
const mockNavigate = vi.fn();

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({})
  };
});

// Mock environment variables
vi.stubEnv('VITE_SPECIES_ENDPOINT', 'http://localhost:3000/api/species');
vi.stubEnv('VITE_LANDING_ENDPOINT', 'http://localhost:3000/api/landings');
vi.stubEnv('VITE_USER_ENDPOINT', 'http://localhost:3000/api/users');
vi.stubEnv('VITE_CATCH_ENDPOINT', 'http://localhost:3000/api/catches');

// Mock fetch
global.fetch = vi.fn();

describe('AvailableCatches', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock API responses
    fetch.mockImplementation((url) => {
      if (url.includes('species')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { id: 1, name: 'Salmon' },
            { id: 2, name: 'Tuna' }
          ])
        });
      }
      if (url.includes('landings')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { id: 1, name: 'Port A' },
            { id: 2, name: 'Port B' }
          ])
        });
      }
      if (url.includes('fishers')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { id: 1, username: 'fisher1' },
            { id: 2, username: 'fisher2' }
          ])
        });
      }
      if (url.includes('catches')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            {
              id: 1,
              speciesName: 'Salmon',
              quantityInKg: 10,
              pricePerKg: 25.50,
              fisherName: 'fisher1',
              landingName: 'Port A'
            }
          ])
        });
      }
    });
  });

  const renderWithRouter = (component) => {
    return render(
      <MemoryRouter>
        {component}
      </MemoryRouter>
    );
  };

  it('should render the AvailableCatches component without errors', () => {
    expect(() => renderWithRouter(<AvailableCatches />)).not.toThrow();
  });

  it('should display the page title', () => {
    renderWithRouter(<AvailableCatches />);
    expect(screen.getByText('Available Catches')).toBeInTheDocument();
  });

  it('should show loading state initially', () => {
    renderWithRouter(<AvailableCatches />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render filter dropdowns', async () => {
    renderWithRouter(<AvailableCatches />);
    
    await waitFor(() => {
      expect(screen.getByText('All Species')).toBeInTheDocument();
      expect(screen.getByText('All Landings')).toBeInTheDocument();
      expect(screen.getByText('All Fishers')).toBeInTheDocument();
    });
  });

  it('should render table headers', async () => {
    renderWithRouter(<AvailableCatches />);
    
    await waitFor(() => {
      expect(screen.getByText('Species')).toBeInTheDocument();
      expect(screen.getByText('Quantity (kg)')).toBeInTheDocument();
      expect(screen.getByText('Price/kg')).toBeInTheDocument();
      expect(screen.getByText('Fisher')).toBeInTheDocument();
      expect(screen.getByText('Landing Port')).toBeInTheDocument();
    });
  });

  it('should display catch data in table', async () => {
    renderWithRouter(<AvailableCatches />);
    
    await waitFor(() => {
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      
      // Look for table cells specifically
      const tableBody = screen.getByRole('table').querySelector('tbody');
      expect(tableBody).toHaveTextContent('Salmon');
      expect(tableBody).toHaveTextContent('10');
      expect(tableBody).toHaveTextContent('$25.50');
      expect(tableBody).toHaveTextContent('fisher1');
      expect(tableBody).toHaveTextContent('Port A');
    });
  });

  it('should show "No catches" message when no data', async () => {
    // Mock empty response
    fetch.mockImplementation((url) => {
      if (url.includes('catches')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([])
        });
      }
      // Return default mocks for other endpoints
      return fetch.mockImplementation.mockReturnValue();
    });

    renderWithRouter(<AvailableCatches />);
    
    await waitFor(() => {
      expect(screen.getByText('No catches match your criteria.')).toBeInTheDocument();
    });
  });
});
