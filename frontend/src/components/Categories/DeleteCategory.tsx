import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { axiosInstance } from '../Common/Auth.Service';
import { categoriesURL } from '../Common/Endpoints';

interface DeleteCategoryProps {
  categoryId: string;
  onDeleteSuccess: () => void;
}

const DeleteCategory: React.FC<DeleteCategoryProps> = ({ categoryId, onDeleteSuccess }) => {
  const [categoryName, setCategoryName] = useState<string | null>(null);

  // Fetch the category name on component mount
  useEffect(() => {
    const fetchCategoryName = async () => {
      try {
        const response = await axiosInstance.get(`${categoriesURL}${categoryId}/`);
        setCategoryName(response.data.description); // Assuming 'description' is the name of the category
      } catch (error) {
        console.error('Error fetching category:', error);
      }
    };

    fetchCategoryName();
  }, [categoryId]);

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`${categoriesURL}${categoryId}/`);
      alert(`Successfully deleted category: ${categoryName}`);
      onDeleteSuccess(); // Call the callback function if delete is successful
    } catch (error: any) {
      if (error.response && error.response.status === 500) {
        alert('Cannot delete category with associated shoes.');
      } else {
        alert('Cannot delete category with associated shoes.');
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
