import {it, expect } from 'vitest';
import { render }  from '@testing-library/react';
import FooterBar from './FooterBar';

it('should render the FooterBar component without errors', () => {
  expect(() => render(<FooterBar />)).not.toThrow();
});
