import {it, expect } from 'vitest';
import { render }  from '@testing-library/react';
import home from './Home';

it('should render the Home component without errors', () => {
  expect(() => render(<home />)).not.toThrow();
});