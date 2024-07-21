import React from 'react';
import useSWR from 'swr';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { categoriesURL } from '../Common/Endpoints';
import { axiosInstance } from '../Common/Auth.Service';
import './Categories.css';
import DeleteCategory from './DeleteCategory';

async function fetchcategory(id) {
    const res = await axiosInstance.get(`${categoriesURL}${id}`);
  return res.data;
}

export default function CategoryDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data: category, error, isValidating: loading } = useSWR(id ? `category-${id}` : null, () => fetchcategory(id));

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
        <>
        <div className="category-detail">
            <h2>Category Detail Page</h2>
            <p>Code: {category.code}</p>
            <p>Description: {category.description}</p>
            <Link to={`/edit-category/${category.code}`}><Button>Edit</Button></Link>
            {/* <Link to={`/delete-category/${category.code}`}><Button>Delete</Button></Link> */}
            <DeleteCategory />
            <Button variant="secondary" onClick={() => navigate(-1)} style={{ marginLeft: '10px' }}>
          Back
        </Button>
        </div>
        </>
    );
}
