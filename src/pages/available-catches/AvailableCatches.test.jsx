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
vi.stubEnv('VITE_SPECIES_ENDPOINT', 'http://52.3.6.17:8080/api/species');
vi.stubEnv('VITE_LANDING_ENDPOINT', 'http://52.3.6.17:8080/api/landing');
vi.stubEnv('VITE_FISHER_ENDPOINT', 'http://52.3.6.17:8080/api/fisher');
vi.stubEnv('VITE_CATCH_ENDPOINT', 'http://52.3.6.17:8080/api/catch');

// Mock fetch
window.fetch = vi.fn();

const jsonResponse = (data) => ({
  ok: true,
  status: 200,
  statusText: 'OK',
  headers: { get: () => 'application/json' },
  json: () => Promise.resolve(data),
  text: () => Promise.resolve(JSON.stringify(data)),
});

describe('AvailableCatches', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock API responses
    window.fetch.mockImplementation((url) => {
      const u = String(url);
      if (u.includes('species')) {
        return Promise.resolve(jsonResponse([
          { id: 1, name: 'Salmon', description: 'Atlantic Salmon', imageUrl: 'salmon.jpg', infoLink: 'info-salmon' },
          { id: 2, name: 'Tuna', description: 'Bluefin Tuna', imageUrl: 'tuna.jpg', infoLink: 'info-tuna' }
        ]));
      }
      if (u.includes('landing')) {
        return Promise.resolve(jsonResponse([
          { id: 1, name: 'Port A', address: 'North Coast' },
          { id: 2, name: 'Port B', address: 'South Coast' }
        ]));
      }
      if (u.includes('fisher')) {
        return Promise.resolve(jsonResponse([
          { id: 1, userName: 'fisher1' },
          { id: 2, userName: 'fisher2' }
        ]));
      }
      if (u.includes('catch')) {
        return Promise.resolve(jsonResponse([
          {
            id: 1,
            speciesName: 'Salmon',
            quantityInKg: 10,
            price: 25.50,
            fisherName: 'fisher1',
            landingName: 'Port A'
          }
        ]));
      }
      return Promise.resolve(jsonResponse([]));
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
      expect(screen.getByText('Price')).toBeInTheDocument();
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
    // Mock empty response for catches
    window.fetch.mockImplementation((url) => {
      const u = String(url);
      if (u.includes('species')) {
        return Promise.resolve(jsonResponse([
          { id: 1, name: 'Salmon', description: 'Atlantic Salmon', imageUrl: 'salmon.jpg', infoLink: 'info-salmon' }
        ]));
      }
      if (u.includes('landing')) {
        return Promise.resolve(jsonResponse([
          { id: 1, name: 'Port A', address: 'North Coast' }
        ]));
      }
      if (u.includes('fisher')) {
        return Promise.resolve(jsonResponse([
          { id: 1, userName: 'fisher1' }
        ]));
      }
      if (u.includes('catch')) {
        return Promise.resolve(jsonResponse([]));
      }
      return Promise.resolve(jsonResponse([]));
    });

    renderWithRouter(<AvailableCatches />);
    
    await waitFor(() => {
      expect(screen.getByText('No catches match your criteria.')).toBeInTheDocument();
    });
  });
});
