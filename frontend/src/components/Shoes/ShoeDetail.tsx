import React from 'react';
import useSWR from 'swr';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import ShoeImageGallery from './ShoeImageGallery';
import { shoesURL } from '../Common/Endpoints';
import { axiosInstance, useAuthService } from '../Common/Auth.Service';
import DeleteShoe from './DeleteShoe';

interface Shoe {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  images: { image: string }[];
}

async function fetchShoe(id: string): Promise<Shoe> {
  const res = await axiosInstance.get(`${shoesURL}${id}`);
  return res.data;
}

const ShoeDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: shoe, error, isValidating: loading } = useSWR(id ? `shoe-${id}` : null, () => fetchShoe(id!));
  const { isAuthenticated } = useAuthService();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!shoe) {
    return <p>No shoe found.</p>;
  }

  return (
    <>
      <div>
        <h2>Shoe Detail Page</h2>
        <p>Name: {shoe.name}</p>
        <p>Description: {shoe.description}</p>
        <p>Price: {shoe.price}</p>
        <p>Availability quantity: {shoe.quantity}</p>
        <ShoeImageGallery images={shoe.images} /> {/* Use the gallery component */}
        {isAuthenticated && (
          <Link to={`/edit-shoe/${shoe.id}/`}>
            <Button>Edit</Button>
          </Link>
        )}
        {isAuthenticated && (<DeleteShoe shoeId={shoe.id} onDeleteSuccess={() => navigate('/shoes')} />)}
        <Button
          variant="secondary"
          onClick={() => navigate(-1)}
          style={{ marginLeft: '10px' }}
        >
          Back
        </Button>
      </div>
    </>
  );
};

export default ShoeDetail;
