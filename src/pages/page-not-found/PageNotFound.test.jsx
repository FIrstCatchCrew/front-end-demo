import {it, expect } from 'vitest';
import { render }  from '@testing-library/react';
import PageNotFound from './PageNotFound';

it('should render the PageNotFound component without errors', () => {
  expect(() => render(<PageNotFound />)).not.toThrow();
});
