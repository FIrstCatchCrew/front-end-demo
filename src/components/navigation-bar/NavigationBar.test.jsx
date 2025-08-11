import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // 1. Import MemoryRouter
import NavigationBar from './NavigationBar';
import '@testing-library/jest-dom';

describe('NavigationBar Component', () => {
  it('should render all navigation links', () => {
    // 2. Wrap the component in MemoryRouter
    render(
      <MemoryRouter>
        <NavigationBar />
      </MemoryRouter>
    );

    // 3. Assert that each link is present in the document
    expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /New Catch/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Available Catches/i })).toBeInTheDocument();
  });
});