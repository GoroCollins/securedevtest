import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddShoe from '../components/Shoes/AddShoe';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { shoesURL, categoriesURL, shoeimagesURL } from '../components/Common/Endpoints';
import { vi } from 'vitest';
import { SWRConfig } from 'swr';
import { BrowserRouter } from 'react-router-dom';

const server = setupServer(
  // Mock categories fetch
  http.get(categoriesURL, () => {
    return HttpResponse.json([
      { code: '1', description: 'Sneakers' },
      { code: '2', description: 'Boots' },
    ]);
  }),
  
  // Mock shoe creation
  http.post(shoesURL, () => {
    return HttpResponse.json({ id: '123' }, { status: 201 });
  }),

  // Mock shoe images upload
  http.post(shoeimagesURL, () => {
    return HttpResponse.json({}, { status: 201 });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('AddShoe Component', () => {
  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <BrowserRouter>
        <SWRConfig value={{ provider: () => new Map() }}>
          {ui}
        </SWRConfig>
      </BrowserRouter>
    );
  };

  it('renders the form with all input fields and button', async () => {
    renderWithProviders(<AddShoe />);
    
    // Check form fields and button
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Images/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Quantity/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Shoe/i })).toBeInTheDocument();
  });

  test("displays error messages for required fields when submitted empty", async () => {
    render(
      <BrowserRouter>
        <AddShoe />
      </BrowserRouter>
    );
  
    // Click the submit button without filling out any fields
    fireEvent.click(screen.getByRole("button", { name: /Add Shoe/i }));
  
    await waitFor(() => {
      // Find all elements with "This is required" error message
      const errorMessages = screen.getAllByText(/This is required/i);
      expect(errorMessages.length).toBe(4); // Adjust this number based on the required fields
    });
  });

//   it('submits the form successfully and navigates to home on success', async () => {
//     renderWithProviders(<AddShoe />);
    
//     fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: '1' } });
//     fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Test Shoe' } });
//     fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'A great shoe' } });
//     fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: 100 } });
//     fireEvent.change(screen.getByLabelText(/Quantity/i), { target: { value: 2 } });
    
//     // Mock a file upload for images
//     const file = new File(['image'], 'image.png', { type: 'image/png' });
//     fireEvent.change(screen.getByLabelText(/Images/i), {
//       target: { files: [file] },
//     });
    
//     fireEvent.click(screen.getByRole('button', { name: /Add Shoe/i }));

//     await waitFor(() => {
//       expect(screen.getByText(/Shoe creation is successful./i)).toBeInTheDocument();
//     });
//   });

//   it('displays error message when the API returns an error', async () => {
//     // Mock error response for shoe creation
//     server.use(
//       http.post(shoesURL, () => HttpResponse.json({ message: 'Failed to add shoe' }, { status: 500 }))
//     );

//     renderWithProviders(<AddShoe />);
    
//     fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: '1' } });
//     fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Test Shoe' } });
//     fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'A great shoe' } });
//     fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: 100 } });
//     fireEvent.change(screen.getByLabelText(/Quantity/i), { target: { value: 2 } });

//     const file = new File(['image'], 'image.png', { type: 'image/png' });
//     fireEvent.change(screen.getByLabelText(/Images/i), {
//       target: { files: [file] },
//     });
    
//     fireEvent.click(screen.getByRole('button', { name: /Add Shoe/i }));

//     await waitFor(() => {
//       expect(screen.getByText(/Failed to add shoe/i)).toBeInTheDocument();
//     });
//   });
});
