import React from 'react';
import { Button } from 'react-bootstrap';
import { axiosInstance } from '../Common/Auth.Service';
import { categoriesURL } from '../Common/Endpoints';

const DeleteCategory = ({ categoryId, onDeleteSuccess }) => {
  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`${categoriesURL}${categoryId}/`);
      onDeleteSuccess();
    } catch (error) {
      console.error('Error deleting category:', error.response.data.error);
      alert('Cannot delete category with associated shoes.');
    }
  };

  return (
    <Button variant="danger" onClick={handleDelete}>
      Delete
    </Button>
  );
};

export default DeleteCategory;
