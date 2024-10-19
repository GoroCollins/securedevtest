import React from 'react';
import { Button } from 'react-bootstrap';
import { axiosInstance } from '../Common/Auth.Service';
import { categoriesURL } from '../Common/Endpoints';

interface DeleteCategoryProps {
  categoryId: string;
  onDeleteSuccess: () => void;
}

const DeleteCategory: React.FC<DeleteCategoryProps> = ({ categoryId, onDeleteSuccess }) => {
  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`${categoriesURL}${categoryId}/`);
      onDeleteSuccess(); // Call the callback function if delete is successful
    } catch (error: any) {
      if (error.response && error.response.status === 500) {
        // Handle the specific case of a 500 error (internal server error)
        alert('Cannot delete category with associated shoes.');
      } else {
        console.error('Error deleting category:', error);
        alert('An error occurred while deleting the category.');
      }
    }
  };

  return (
    <Button variant="danger" onClick={handleDelete}>
      Delete
    </Button>
  );
};

export default DeleteCategory;
