import { render, screen, waitFor } from '@testing-library/react';
import Categories from '../components/Categories/Categories';
import useSWR from 'swr';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mock SWR hook
vi.mock('swr', () => ({
  __esModule: true,
  default: vi.fn(),
}));

// Mock axiosInstance
vi.mock('../components/Common/Auth.Service', () => ({
  axiosInstance: {
    get: vi.fn(),
  },
}));

describe('Categories Component', () => {
  const mockCategories = [
    { code: 'CAT001', description: 'Category 1' },
    { code: 'CAT002', description: 'Category 2' },
  ];

  test('displays loading state initially', () => {
    // Mock SWR to return a loading state
    (useSWR as ReturnType<typeof vi.fn>).mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
    });

    render(
      <BrowserRouter>
        <Categories />
      </BrowserRouter>
    );

    // Assert that the loading message is shown
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('displays error message when there is an error', () => {
    // Mock SWR to return an error
    (useSWR as ReturnType<typeof vi.fn>).mockReturnValue({
      data: null,
      error: { message: 'Failed to fetch categories' },
      isLoading: false,
    });

    render(
      <BrowserRouter>
        <Categories />
      </BrowserRouter>
    );

    // Assert that the error message is shown
    expect(screen.getByText('Error loading data: Failed to fetch categories')).toBeInTheDocument();
  });

  test('displays list of categories when data is available', async () => {
    // Mock SWR to return data
    (useSWR as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockCategories,
      error: null,
      isLoading: false,
    });

    render(
      <BrowserRouter>
        <Categories />
      </BrowserRouter>
    );

    // Assert that the categories are rendered
    await waitFor(() => {
      expect(screen.getByText('CAT001:')).toBeInTheDocument();
      expect(screen.getByText('Category 1')).toBeInTheDocument();
      expect(screen.getByText('CAT002:')).toBeInTheDocument();
      expect(screen.getByText('Category 2')).toBeInTheDocument();
    });
  });

  test('renders "Add New" button with correct link', () => {
    (useSWR as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockCategories,
      error: null,
      isLoading: false,
    });

    render(
      <BrowserRouter>
        <Categories />
      </BrowserRouter>
    );

    // Check if the "Add New" button is present and links to /add-category
    const addButton = screen.getByText('Add New');
    expect(addButton.closest('a')).toHaveAttribute('href', '/add-category');
  });
});
