import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import '@testing-library/jest-dom';

describe('App Component Structure', () => {
  it('should render the main app and content containers', () => {
    const { container } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const appContainer = container.querySelector('.app-container');
    const contentContainer = container.querySelector('.content-container');

    expect(appContainer).toBeInTheDocument();
    expect(contentContainer).toBeInTheDocument();
  });
});