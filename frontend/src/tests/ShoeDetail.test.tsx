import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ShoeDetail from '../components/Shoes/ShoeDetail';
import { shoesURL } from '../components/Common/Endpoints';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { AuthProvider } from '../components/Common/Auth.Service';

// Mock data for the tests
const mockShoe = {
  id: '1',
  name: 'Sample Shoe',
  description: 'A sample description of the shoe.',
  price: 100,
  quantity: 5,
  images: [{ image: 'image_url_1.jpg' }],
};

// MSW server setup
const server = setupServer(
  // Successful response with mock data
  http.get(`${shoesURL}1`, () => HttpResponse.json(mockShoe)),
  // Response with 500 status for error handling
  http.get(`${shoesURL}404`, () => HttpResponse.json({ status: 500, message: 'Fetch failed', data: { images: [] } }))
);

// Start/stop server for tests
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Define navigateMock globally for use in tests
const navigateMock = vi.fn();
// Partially mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock, // Mock useNavigate only
  };
});

// Render helper with MemoryRouter
const renderComponent = (initialRoute = '/shoe/1') =>
  render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <AuthProvider>

      <Routes>
        <Route path="/shoe/:id" element={<ShoeDetail />} />
      </Routes>
      </AuthProvider>
     
    </MemoryRouter>
  );

describe('ShoeDetail Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays loading message initially', () => {
    renderComponent();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  // it('displays error message on fetch failure', async () => {
  //   renderComponent('/shoe/404');
  //   await waitFor(() => expect(screen.getByText(/error/i)).toBeInTheDocument());
  // });

  // it('displays "No shoe found" when shoe data is missing', async () => {
  //   server.use(
  //     http.get(`${shoesURL}1`, () => HttpResponse.json([]))
  //   );

  //   renderComponent();
  //   await waitFor(() => {
  //     expect(screen.getByText(/no shoe found/i)).toBeInTheDocument();
  //   });
  // });

  it('displays shoe details correctly', async () => {
    renderComponent();
    await waitFor(() => screen.getByText(/sample shoe/i));
    expect(screen.getByText(/a sample description of the shoe/i)).toBeInTheDocument();
    expect(screen.getByText(/100/i)).toBeInTheDocument();
    expect(screen.getByText(/5/i)).toBeInTheDocument();
  });

  // it('renders "Manage Images" and "Edit" buttons if authenticated', async () => {
  //   renderComponent();
  //   await waitFor(() => {
  //     expect(screen.getByText(/manage images/i)).toBeInTheDocument();
  //     expect(screen.getByText(/edit/i)).toBeInTheDocument();
  //   });
  // });

  // it('navigates to manage images page when "Manage Images" button is clicked', async () => {
  //   renderComponent();
  //   await waitFor(() => screen.getByText(/manage images/i));
  //   fireEvent.click(screen.getByText(/manage images/i));
  //   expect(navigateMock).toHaveBeenCalledWith('/shoe/1/images');
  // });

  // it('navigates to edit page when "Edit" button is clicked', async () => {
  //   renderComponent();
  //   await waitFor(() => screen.getByText(/edit/i));
  //   fireEvent.click(screen.getByText(/edit/i));
  //   expect(navigateMock).toHaveBeenCalledWith('/edit-shoe/1/');
  // });

  // it('displays "Delete" button and calls onDeleteSuccess upon successful deletion', async () => {
  //   renderComponent();

  //   await waitFor(() => expect(screen.getByText(/delete/i)).toBeInTheDocument());
  //   fireEvent.click(screen.getByText(/delete/i));

  //   await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/shoes'));
  // });

  it('navigates back when "Back" button is clicked', async () => {
    renderComponent();
    await waitFor(() => expect(screen.getByText(/back/i)).toBeInTheDocument());
    fireEvent.click(screen.getByText(/back/i));
    expect(navigateMock).toHaveBeenCalled(); // Verifies back navigation
  });
});
