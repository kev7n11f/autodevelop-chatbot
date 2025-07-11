import { render, screen } from '@testing-library/react';
import App from './App';

test('renders chatbot title', () => {
  render(<App />);
  const linkElement = screen.getByText(/AutoDevelop Chatbot/i);
  expect(linkElement).toBeInTheDocument();
});
