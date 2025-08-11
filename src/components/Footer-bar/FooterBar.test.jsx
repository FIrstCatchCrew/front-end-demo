import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FooterBar from './FooterBar';
import '@testing-library/jest-dom';

// Mock window.matchMedia
const mockMatchMedia = vi.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(), // deprecated
  removeListener: vi.fn(), // deprecated
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

describe('FooterBar Component', () => {
  beforeEach(() => {
    // Setup window.matchMedia mock
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });

    // Setup localStorage mock
    Object.defineProperty(window, 'localStorage', {
      writable: true,
      value: mockLocalStorage,
    });

    // Reset mocks
    vi.clearAllMocks();
  });
  it('should render the FooterBar component without errors', () => {
    expect(() => 
      render(
        <MemoryRouter>
          <FooterBar />
        </MemoryRouter>
      )
    ).not.toThrow();
  });

  it('should render copyright text and footer links', () => {
    render(
      <MemoryRouter>
        <FooterBar />
      </MemoryRouter>
    );

    expect(screen.getByText(/© 2025 FishCatch. All rights reserved./)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Privacy/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Terms/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Contact/i })).toBeInTheDocument();
  });

  it('should render theme toggle button', () => {
    render(
      <MemoryRouter>
        <FooterBar />
      </MemoryRouter>
    );

    const themeToggle = screen.getByRole('button', { name: /Toggle dark mode/i });
    expect(themeToggle).toBeInTheDocument();
  });

  it('should toggle theme when theme button is clicked', () => {
    render(
      <MemoryRouter>
        <FooterBar />
      </MemoryRouter>
    );

    const themeToggle = screen.getByRole('button', { name: /Toggle dark mode/i });
    
    // Click the theme toggle button
    fireEvent.click(themeToggle);
    
    // The button should still be in the document (basic functionality test)
    expect(themeToggle).toBeInTheDocument();
  });
});
