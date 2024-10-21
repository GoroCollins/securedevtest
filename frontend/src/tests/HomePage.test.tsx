import { render, screen, waitFor } from '@testing-library/react';
import HomePage from '../components/HomePage';
import { vi } from 'vitest';
import axiosMockAdapter from 'axios-mock-adapter';
import { axiosInstance } from '../components/Common/Auth.Service';
import '@testing-library/jest-dom';

// Mock the necessary props
const mockProps = {
  count: 0,
  setCount: vi.fn(),
};

// Mock axiosInstance correctly before other imports
vi.mock('../components/Common/Auth.Service', () => {
  const axios = require('axios');
  
  return {
    // Use a real axios instance for axios-mock-adapter
    axiosInstance: axios.create(), 

    // Mock the useAuthService hook
    useAuthService: () => ({
      login: vi.fn(),
      logout: vi.fn(),
      isAuthenticated: true,
      user: { username: 'mockuser', email: 'mockuser@example.com' },
    }),
  };
});

// After mocking, create axiosMock instance for testing
const axiosMock = new axiosMockAdapter(axiosInstance);

describe('HomePage Component', () => {
  beforeEach(() => {
    axiosMock.reset(); // Reset the axios mock before each test
  });

  test('displays loading state initially', () => {
    render(<HomePage {...mockProps} />);
    expect(screen.getByText('Loading user information...')).toBeInTheDocument();
  });

  test('displays welcome message with username when user data is available', async () => {
    // Mock a successful user response
    axiosMock.onGet('/dj-rest-auth/user/').reply(200, {
      username: 'testuser',
    });

    render(<HomePage {...mockProps} />);

    // Wait for the user data to load and check for the welcome message
    await waitFor(() =>
      expect(screen.getByText('Welcome testuser to Mobi hand made sandals')).toBeInTheDocument()
    );
  });

  test('displays generic welcome message when user is not available', async () => {
    // Mock an error response for user request
    axiosMock.onGet('/dj-rest-auth/user/').reply(500);

    render(<HomePage {...mockProps} />);

    // Wait for the error state and check for the fallback welcome message
    await waitFor(() =>
      expect(screen.getByText('Welcome to Mobi hand made sandals')).toBeInTheDocument()
    );
  });
});
