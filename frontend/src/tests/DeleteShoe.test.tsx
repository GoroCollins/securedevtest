import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeleteShoe from '../components/Shoes/DeleteShoe';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { shoesURL } from '../components/Common/Endpoints';
import { vi } from 'vitest';

const shoeId = '123';
const onDeleteSuccess = vi.fn();

const server = setupServer(
  http.delete(`${shoesURL}${shoeId}/`, () => {
    return new HttpResponse(null, { status: 200} );
  })
);

// Enable API mocking before tests.
beforeAll(() => server.listen());
// Reset any request handlers that we may add during the tests.
afterEach(() => server.resetHandlers());
// Clean up after the tests are finished.
afterAll(() => server.close());

describe('DeleteShoe', () => {
  it('renders the delete button', () => {
    render(<DeleteShoe shoeId={shoeId} onDeleteSuccess={onDeleteSuccess} />);
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('calls the delete API and triggers onDeleteSuccess on success', async () => {
    render(<DeleteShoe shoeId={shoeId} onDeleteSuccess={onDeleteSuccess} />);
    const deleteButton = screen.getByRole('button', { name: /delete/i });

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(onDeleteSuccess).toHaveBeenCalled();
    });
  });

//   it('logs an error message if the delete API fails', async () => {
//     const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
//     server.use(
//       http.delete(`${shoesURL}${shoeId}/`, () => {
//         return HttpResponse.json( { status:500, error: 'Failed to delete shoe' });
//       })
//     );

//     render(<DeleteShoe shoeId={shoeId} onDeleteSuccess={onDeleteSuccess} />);
//     const deleteButton = screen.getByRole('button', { name: /delete/i });

//     fireEvent.click(deleteButton);

//     await waitFor(() => {
//       expect(consoleSpy).toHaveBeenCalledWith('Error deleting shoe:', 'Failed to delete shoe');
//     });

//     consoleSpy.mockRestore();
//   });
});
