import {it, expect } from 'vitest';
import { render }  from '@testing-library/react';
import App from './App';

it('should render the main App component without errors', () => {
  expect(() => render(<App />)).not.toThrow();
});