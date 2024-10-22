import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddCategory from '../components/Categories/AddCategory';
import { vi } from 'vitest';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../components/Common/Auth.Service';
import '@testing-library/jest-dom';


// Assuming you have a separate file for endpoints
vi.mock('../components/Common/Endpoints.tsx', () => ({
    categoriesURL: 'https://backend.local/api/categories/', // Mock the URL here
  }));
  
// Mocking useNavigate from react-router-dom
vi.mock('react-router-dom', () => {
  const mockNavigate = vi.fn(); // Create the mock function
  return {
    useNavigate: () => mockNavigate, // Return the mock function when useNavigate is called
  };
});

// Mocking axiosInstance
vi.mock('../components/Common/Auth.Service', () => ({
  axiosInstance: {
    post: vi.fn(),
  },
}));

describe('AddCategory Component', () => {
  const mockNavigate = useNavigate();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks(); 
  });

  test('renders form correctly', () => {
    render(<AddCategory />);

    // Check if form fields and buttons are present
    expect(screen.getByLabelText('Code')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Category/i })).toBeInTheDocument();
  });

test('shows error message when code is empty and form is submitted', async () => {
    render(<AddCategory />);
  
    // Trigger form submission without entering data
    fireEvent.click(screen.getByRole('button', { name: /Add Category/i }));
  
    // Expect an error message for the code field
    await waitFor(() => {
      const errorMessages = screen.getAllByText(/code is required/i); // Check for the specific 'code' message
      expect(errorMessages).toHaveLength(1); // Expect only one error message to be displayed
      expect(errorMessages[0]).toHaveTextContent("Code is required"); // Check the specific error message
    });
  });
  

  test('submits form and displays success message on successful submission', async () => {
    // Mock axios post success
    (axiosInstance.post as ReturnType<typeof vi.fn>).mockResolvedValue({});
  
    render(<AddCategory />);
  
    // Log before filling the form
    console.log("Filling form with valid data");
  
    // Fill in the form
    fireEvent.change(screen.getByLabelText('Code'), { target: { value: 'CAT001' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Category 1 description' } });
  
  
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Add Category/i }));
  
    // Check if axios post was called with the full URL
    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith('https://backend.local/api/categories/', {
        code: 'CAT001',
        description: 'Category 1 description',
      });
    });
  
    // Expect success message to be shown and navigation to happen
    await waitFor(() => {
      expect(screen.getByText('Category creation is successful.')).toBeInTheDocument();

  
      // Ensure navigate is called only once
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/categories');
    });
  });
  
  
  

  test('displays error message when the category creation fails', async () => {
    // Mock axios post failure
    (axiosInstance.post as ReturnType<typeof vi.fn>).mockRejectedValue({
      response: { data: { message: 'Failed to create category' } },
    });

    render(<AddCategory />);

    // Fill in the form
    fireEvent.change(screen.getByLabelText('Code'), { target: { value: 'CAT001' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Category 1 description' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Add Category/i }));

    // Expect axios post to have been called
    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith('https://backend.local/api/categories/', {
        code: 'CAT001',
        description: 'Category 1 description',
      });
    });

    // Expect error message to be shown
    await waitFor(() => {
      expect(screen.getByText('Failed to create category')).toBeInTheDocument();
    });
  });
});
