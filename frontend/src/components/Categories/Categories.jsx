import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { categoriesURL } from '../Common/Endpoints';
import useSWR from 'swr';
import { axiosInstance } from '../Common/Auth.Service';
import './Categories.css';

export default function Categories() {
  const {
    data: categoriesData,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useSWR(
    categoriesURL,
    async () => await axiosInstance.get(categoriesURL).then((res) => res.data),
    { refreshInterval: 100000 }
  );

  // Display loading message
  if (categoriesLoading) {
    return <p>Loading...</p>;
  }

  // Display error message
  if (categoriesError) {
    return <p>Error loading data: {categoriesError.message}</p>;
  }

  return (
    <>
      <h2>Available categories</h2>
      <div className="categories-container">
        <Link to="/add-category">
          <Button>Add New</Button>
        </Link>
      </div>
      <ol className="categories-list">
        {categoriesData.map((category) => (
          <li key={category.code}>
            <Link to={`/category/${category.code}`}><strong>{category.code}:</strong></Link> {category.description}
          </li>
        ))}
      </ol>
    </>
  );
}
