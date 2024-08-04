import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SWRConfig } from 'swr';
import Shoes from '../components/Shoes/Shoes';
import { axiosInstance, useAuthService } from '../components/Common/Auth.Service';
import { categoriesURL, shoesURL } from '../components/Common/Endpoints';
// import { vi, expect, describe, test } from 'vitest';

// Mock axiosInstance and useAuthService
vi.mock('../components/Common/Auth.Service.jsx', () => ({
  axiosInstance: {
    get: vi.fn(),
  },
  useAuthService: vi.fn(),
}));

const mockCategories = [
  { code: 'cat1', description: 'Category 1' },
  { code: 'cat2', description: 'Category 2' },
];

const mockShoes = [
  {
    id: 1,
    name: 'Shoe 1',
    description: 'Description 1',
    price: 100,
    quantity: 10,
    category: 'cat1',
    images: [{ image: 'image1.jpg' }],
  },
  {
    id: 2,
    name: 'Shoe 2',
    description: 'Description 2',
    price: 150,
    quantity: 5,
    category: 'cat2',
    images: [{ image: 'image2.jpg' }],
  },
];

// Utility function to render with SWRConfig
const renderWithSWRConfig = (ui) => {
  return render(
    <SWRConfig value={{ dedupingInterval: 0, provider: () => new Map() }}>
      {ui}
    </SWRConfig>
  );
};

test('renders the Shoes component', async () => {
  axiosInstance.get.mockImplementation((url) => {
    switch (url) {
      case categoriesURL:
        return Promise.resolve({ data: mockCategories });
      case shoesURL:
        return Promise.resolve({ data: mockShoes });
      default:
        return Promise.reject(new Error('not found'));
    }
  });

  useAuthService.mockReturnValue({ isAuthenticated: true });

  renderWithSWRConfig(<Shoes count={4} setCount={vi.fn()} />);

  expect(screen.getByText('Loading...')).toBeInTheDocument();

  await waitFor(() => expect(screen.getByText('Category 1')).toBeInTheDocument());
  await waitFor(() => expect(screen.getByText('Shoe 1')).toBeInTheDocument());
});

test('updates search term and filters shoes', async () => {
  axiosInstance.get.mockImplementation((url) => {
    switch (url) {
      case categoriesURL:
        return Promise.resolve({ data: mockCategories });
      case shoesURL:
        return Promise.resolve({ data: mockShoes });
      default:
        return Promise.reject(new Error('not found'));
    }
  });

  useAuthService.mockReturnValue({ isAuthenticated: true });

  renderWithSWRConfig(<Shoes count={4} setCount={vi.fn()} />);

  await waitFor(() => expect(screen.getByText('Shoe 1')).toBeInTheDocument());

  const searchInput = screen.getByPlaceholderText('Search...');
  fireEvent.change(searchInput, { target: { value: 'Shoe 2' } });

  expect(screen.queryByText('Shoe 1')).not.toBeInTheDocument();
  expect(screen.getByText('Shoe 2')).toBeInTheDocument();
});

test('filters shoes by category', async () => {
  axiosInstance.get.mockImplementation((url) => {
    switch (url) {
      case categoriesURL:
        return Promise.resolve({ data: mockCategories });
      case `${shoesURL}?category=cat1`:
        return Promise.resolve({ data: mockShoes.filter(shoe => shoe.category === 'cat1') });
      case shoesURL:
        return Promise.resolve({ data: mockShoes });
      default:
        return Promise.reject(new Error('not found'));
    }
  });

  useAuthService.mockReturnValue({ isAuthenticated: true });

  renderWithSWRConfig(<Shoes count={4} setCount={vi.fn()} />);

  await waitFor(() => expect(screen.getByText('Shoe 1')).toBeInTheDocument());

  const categorySelect = screen.getByRole('combobox');
  fireEvent.change(categorySelect, { target: { value: 'cat1' } });

  await waitFor(() => expect(screen.queryByText('Shoe 2')).not.toBeInTheDocument());
  expect(screen.getByText('Shoe 1')).toBeInTheDocument();
});

test('loads more shoes when "Load More" is clicked', async () => {
  const setCountMock = vi.fn();
  axiosInstance.get.mockImplementation((url) => {
    switch (url) {
      case categoriesURL:
        return Promise.resolve({ data: mockCategories });
      case shoesURL:
        return Promise.resolve({ data: mockShoes });
      default:
        return Promise.reject(new Error('not found'));
    }
  });

  useAuthService.mockReturnValue({ isAuthenticated: true });

  renderWithSWRConfig(<Shoes count={4} setCount={setCountMock} />);

  await waitFor(() => expect(screen.getByText('Shoe 1')).toBeInTheDocument());

  const loadMoreButton = screen.getByText('Load More');
  fireEvent.click(loadMoreButton);

  expect(setCountMock).toHaveBeenCalledWith(8); // Assuming initial count was 4
});
