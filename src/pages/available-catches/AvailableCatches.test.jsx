import {it, expect } from 'vitest';
import { render }  from '@testing-library/react';
import AvailableCatches from './AvailableCatches';

it('should render the AvailableCatches component without errors', () => {
  expect(() => render(<AvailableCatches />)).not.toThrow();
});
