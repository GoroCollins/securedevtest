import useSWR from "swr";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { categoriesURL, shoesURL } from "../Common/Endpoints";
import { Link } from "react-router-dom";
import "./Shoes.css";
import { useState, useEffect } from "react";
import { axiosInstance, useAuthService } from "../Common/Auth.Service";
import placeholderProfileImage from '../../assets/placeholder.png'

interface Category {
  code: string;
  description: string;
}

interface Shoe {
  id: string;
  category: string;
  price: number;
  name: string;
  description: string;
  quantity: number;
  images: { image: string }[];
}

interface ShoesProps {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
}

const Shoes: React.FC<ShoesProps> = ({ count, setCount }) => {
  const [searchTerm, setSearchTerm] = useState<string>(""); // State for search term
  const [selectedCategory, setSelectedCategory] = useState<string>(""); // State to store selected category
  const { isAuthenticated } = useAuthService();

  // Fetching categories data
  const {
    data: categoriesData,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useSWR<Category[]>(
    categoriesURL,
    async () => await axiosInstance.get(categoriesURL).then((res) => res.data),
    { refreshInterval: 100000 }
  );

  // Fetching shoes data with category filter
  const {
    data: shoesData,
    error: shoesError,
    isLoading: shoesLoading,
    mutate,
  } = useSWR<Shoe[]>(
    () =>
      selectedCategory ? `${shoesURL}?category=${selectedCategory}` : shoesURL,
    async () =>
      await axiosInstance
        .get(
          selectedCategory
            ? `${shoesURL}?category=${selectedCategory}`
            : shoesURL
        )
        .then((res) => res.data),
    { refreshInterval: 100000 }
  );

  // Re-fetch shoes data when selected category changes
  useEffect(() => {
    mutate();
  }, [selectedCategory, mutate]);

  // Display loading message
  if (categoriesLoading || shoesLoading) {
    return <p>Loading...</p>;
  }

  // Display error message
  if (categoriesError || shoesError) {
    return <p>Error loading data: {categoriesError?.message || shoesError?.message}</p>;
  }

  // Filter the shoes based on the search term
  const filteredShoes = shoesData?.filter((shoe) =>
    shoe.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to load more shoes
  const LoadMore = () => {
    setCount(count + 4);
    mutate();
  };

  return (
    <>
      <div className="search-container">
        {/* Categories dropdown */}
        <select
          onChange={(e) => setSelectedCategory(e.target.value)}
          value={selectedCategory}
          className="select-category"
        >
          <option value="">All Categories</option>
          {categoriesData?.map((category) => (
            <option key={category.code} value={category.code}>
              {category.description}
            </option>
          ))}
        </select>
        {/* Search bar */}
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        {isAuthenticated && (
          <Link to="/add-shoe">
            <Button>Add New</Button>
          </Link>
        )}
      </div>

      {/* Check if no shoes are found for the selected category */}
      {shoesData && filteredShoes?.length === 0 && selectedCategory ? (
        <p>There are no shoes for this category.</p>
      ) : filteredShoes?.length === 0 ? (
        <p>No shoes match your search.</p>
      ) : (
        <div className="shoes-container">
          {filteredShoes
            ?.slice(0, count) // Limit the display to 'count' number of shoes
            .map((shoe, index) => (
              <Card border="dark" key={index} style={{ width: "18rem" }}>
                <Link to={`/shoe/${shoe.id}`}>
                  <Card.Img
                    variant="top"
                    src={shoe.images.length > 0 ? shoe.images[0].image : placeholderProfileImage}
                    alt={shoe.name}
                    className="shoe-image"
                  />
                </Link>
                <Card.Body>
                  <Card.Title>Name: {shoe.name}</Card.Title>
                  <Card.Text>Description: {shoe.description}</Card.Text>
                  <Card.Text>
                    Category: {
                      categoriesData?.find(
                        (category) => category.code === shoe.category
                      )?.description || 'Unknown'
                    }
                  </Card.Text>
                </Card.Body>
              </Card>
            ))}
        </div>
      )}

      <div className="btns">
        <button onClick={LoadMore}>Load More</button>
      </div>
    </>
  );
};

export default Shoes;
