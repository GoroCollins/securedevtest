import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import CategoryDetail from '../components/Categories/CategoryDetails';
import '@testing-library/jest-dom';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

// Set up the mock server
const server = setupServer(
  // Handler for GET request to fetch category details
  http.get('https://backend.local/api/categories/:categoryId', (req) => {
    const { categoryId } = req.params;
    if (categoryId === 'CAT001') {
      return HttpResponse.json(
        { code: 'CAT001', description: 'Category 1 Description' }
      );
    }
    return new HttpResponse(null, { status: 404 });
  }),
  
  // Handler for DELETE request to delete a category
  http.delete('https://backend.local/api/categories/:categoryId', () => {
    return new HttpResponse(null, { status: 204 }); // Simulate a successful deletion
  }),

  // Handler for POST request to simulate category creation failure
  http.post('https://backend.local/api/categories/', () => {
    return HttpResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }),

  // Handler for OPTIONS request (CORS preflight)
  http.options('https://backend.local/api/categories/:categoryId', () => {
    return new HttpResponse(null, { status: 200 });
  })
);

// Start the server before all tests and clean up afterward
beforeAll(() => {
  window.alert = vi.fn();
  server.listen()
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const mockNavigate = vi.fn();

// Mocking react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: 'CAT001' }),
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
}));

describe('CategoryDetail Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders loading state', () => {
    render(<CategoryDetail />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  // test('renders "No category found" message when category does not exist', async () => {
  //   server.use(
  //     http.get('https://backend.local/api/categories/:categoryId', () => {
  //       return new HttpResponse(null, {status: 404, statusText: 'No category found'}); // Send 404 with no body
  //     })
  //   );
  
  //   render(<CategoryDetail />);
  
  //   // Wait for the "No category found" message to appear in the DOM
  //   expect(await screen.findByText(/No category found/i)).toBeInTheDocument();
  // });
  

  test('renders category details on success', async () => {
    render(<CategoryDetail />);

    // Ensure that the category details are displayed after a successful fetch
    expect(await screen.findByText('Code: CAT001')).toBeInTheDocument();
    expect(screen.getByText('Description: Category 1 Description')).toBeInTheDocument();
  });

  test('navigates back when the back button is clicked', async () => {
    render(<CategoryDetail />);

    const backButton = screen.getByRole('button', { name: 'Back' });
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  test('navigates after successful category deletion', async () => {
    render(<CategoryDetail />);

    const deleteButton = screen.getByText(/delete/i);

    await act(async () => {
      fireEvent.click(deleteButton);
    });

    // Ensure the navigation happened to /categories after deletion
    expect(mockNavigate).toHaveBeenCalledWith('/categories');
  });
});
