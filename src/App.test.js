import { render, screen, cleanup } from '@testing-library/react';
import App from './App';

afterEach(cleanup)

test('Renders app', () => {
  const { asFragment } = render(<App />);
  expect(asFragment(<App />)).toMatchSnapshot()
});
