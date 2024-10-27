import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import DeleteCategory from '../components/Categories/DeleteCategory';
import '@testing-library/jest-dom';

const categoryId = '123';
const categoriesURL = 'https://backend.local/api/categories/';

const server = setupServer(
  http.get(`${categoriesURL}:categoryId`, (req) => {
    const { categoryId: reqCategoryId } = req.params;
    if (reqCategoryId === categoryId) {
      return HttpResponse.json({ description: 'Sample Category' });
    }
    return HttpResponse.json(null, { status: 404 });
  }),
  http.delete(`${categoriesURL}${categoryId}/`, () => {
    return new HttpResponse(null, { status: 204 });
  }),
  http.options(`${categoriesURL}:categoryId`, () => {
    return HttpResponse.json(null, { status: 200 });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('DeleteCategory', () => {
  let alertMock: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    alertMock.mockRestore();
  });

  it('renders the delete button', () => {
    render(<DeleteCategory categoryId={categoryId} onDeleteSuccess={vi.fn()} />);
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('deletes the category and calls onDeleteSuccess', async () => {
    const onDeleteSuccessMock = vi.fn();

    render(<DeleteCategory categoryId={categoryId} onDeleteSuccess={onDeleteSuccessMock} />);
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(onDeleteSuccessMock).toHaveBeenCalled();
    });
  });

  // it('fetches category name and confirms it in success alert on delete', async () => {
  //   const onDeleteSuccessMock = vi.fn();
  //   const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
  
  //   render(<DeleteCategory categoryId={categoryId} onDeleteSuccess={onDeleteSuccessMock} />);
  
  //   // Wait for the category name to be fetched and displayed
  //   await waitFor(() => expect(alertMock).toHaveBeenCalledWith('Successfully deleted category: Sample Category'));
    
  //   // Trigger delete action
  //   fireEvent.click(screen.getByRole('button', { name: /delete/i }));
  
  //   await waitFor(() => {
  //     expect(alertMock).toHaveBeenCalledWith('Successfully deleted category: Sample Category');
  //     expect(onDeleteSuccessMock).toHaveBeenCalled();
  //   });
  
  //   alertMock.mockRestore();
  // });
  

  it('shows an error alert if delete fails with associated shoes', async () => {
    server.use(
      http.delete(`${categoriesURL}${categoryId}/`, () => {
        return HttpResponse.json(
          { message: 'Cannot delete category with associated shoes.' },
          { status: 500 }
        );
      })
    );

    render(<DeleteCategory categoryId={categoryId} onDeleteSuccess={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Cannot delete category with associated shoes.');
    });
  });
});
