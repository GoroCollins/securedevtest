import React from 'react';
import { Button } from 'react-bootstrap';
import { axiosInstance } from '../Common/Auth.Service';
import { shoesURL } from '../Common/Endpoints';

interface DeleteShoeProps {
  shoeId: string;
  onDeleteSuccess: () => void;
}

const DeleteShoe: React.FC<DeleteShoeProps> = ({ shoeId, onDeleteSuccess }) => {
  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`${shoesURL}${shoeId}/`);
      onDeleteSuccess();
    } catch (error: any) {
      console.error('Error deleting shoe:', error.response.data.error);
    }
  };

  return (
    <Button variant="danger" onClick={handleDelete}>
      Delete
    </Button>
  );
};

export default DeleteShoe;
