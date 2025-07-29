import { render, screen, waitFor, act } from '@testing-library/react';
import App from './App';

// Mock fetch for theme API
global.fetch = jest.fn();

describe('App Component', () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorage.clear();
  });

  test('renders chatbot title after loading', async () => {
    // Mock successful theme fetch (GET)
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ theme: 'dark' }),
      })
      .mockResolvedValueOnce({ // Mock theme save (POST)
        ok: true,
        json: async () => ({ success: true }),
      });

    await act(async () => {
      render(<App />);
    });
    
    // Wait for loading to complete and title to appear
    await waitFor(() => {
      const titleElement = screen.getByText(/AutoDevelop Chatbot/i);
      expect(titleElement).toBeInTheDocument();
    });
  });

  test('shows loading state initially', () => {
    // Mock pending fetch
    fetch.mockImplementationOnce(() => new Promise(() => {}));
    
    render(<App />);
    const loadingElement = screen.getByText(/Loading.../i);
    expect(loadingElement).toBeInTheDocument();
  });

  test('falls back to localStorage when fetch fails', async () => {
    // Mock failed fetch for GET
    fetch
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({ // Mock theme save (POST)
        ok: true,
        json: async () => ({ success: true }),
      });
    
    // Set localStorage value
    localStorage.setItem('theme', 'light');

    await act(async () => {
      render(<App />);
    });
    
    // Wait for loading to complete
    await waitFor(() => {
      const titleElement = screen.getByText(/AutoDevelop Chatbot/i);
      expect(titleElement).toBeInTheDocument();
    });
  });
});
