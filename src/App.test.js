import { describe, it, expect } from 'vitest';
import { render }  from '@testing-library/react';
//import { render, screen }  from '@testing-library/react';
import App from '../App';

import '@testing-library/jest-dom';

describe('Application Smoke Test', () => {
  it('should render the main App component without errors', () => {
    render(<App />);

   // const titleElement = screen.getByText()

   // expect(titleElement).toBeInTheDocument();
  });
});