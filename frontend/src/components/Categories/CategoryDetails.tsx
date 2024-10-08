import React from 'react';
import useSWR from 'swr';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { categoriesURL } from '../Common/Endpoints';
import { axiosInstance } from '../Common/Auth.Service';
import './Categories.css';
import DeleteCategory from './DeleteCategory';

interface Category {
  code: string;
  description: string;
}

async function fetchCategory(id: string): Promise<Category> {
  const res = await axiosInstance.get(`${categoriesURL}${id}`);
  return res.data;
}

const CategoryDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: category, error, isValidating: loading } = useSWR(id ? `category-${id}` : null, () => fetchCategory(id!));

  // Callback to handle successful delete
  const handleDeleteSuccess = () => {
    navigate('/categories'); // Navigate back to the categories page after deletion
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!category) {
    return <p>No category found.</p>;
  }

  return (
    <div className="category-detail">
      <h2>Category Detail Page</h2>
      <p>Code: {category.code}</p>
      <p>Description: {category.description}</p>
      
      <div className="category-actions">
        <Link to={`/edit-category/${category.code}`}>
          <Button variant="primary">Edit</Button>
        </Link>
        
        {/* Pass handleDeleteSuccess to DeleteCategory */}
        <DeleteCategory categoryId={category.code} onDeleteSuccess={handleDeleteSuccess} />
        
        <Button
          variant="secondary"
          onClick={() => navigate(-1)}
          style={{ marginLeft: '10px' }}
        >
          Back
        </Button>
      </div>
    </div>
  );
};

export default CategoryDetail;
