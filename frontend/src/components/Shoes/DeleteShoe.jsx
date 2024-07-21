import React from 'react';
import { Button } from 'react-bootstrap';
import { axiosInstance } from '../Common/Auth.Service';
import { shoesURL } from '../Common/Endpoints';

const DeleteShoe = ({ shoeId, onDeleteSuccess }) => {
  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`${shoesURL}${shoeId}/`);
      onDeleteSuccess();
    } catch (error) {
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
