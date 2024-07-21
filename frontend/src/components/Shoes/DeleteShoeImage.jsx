import React from 'react';
import { Button } from 'react-bootstrap';
import { axiosInstance } from '../Common/Auth.Service';
import { shoeimagesURL } from '../Common/Endpoints';

const DeleteShoeImage = ({ imageId, onDeleteSuccess }) => {
  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`${shoeimagesURL}${imageId}/`);
      onDeleteSuccess();
    } catch (error) {
      console.error('Error deleting shoe image:', error.response.data.error);
    }
  };

  return (
    <Button variant="danger" onClick={handleDelete}>
      Delete Image
    </Button>
  );
};

export default DeleteShoeImage;
// Will have the images being deleted from the backend instead.