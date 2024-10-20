import React, { useEffect, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { axiosInstance } from "../Common/Auth.Service";
import useSWR from "swr";
import placeholderImage from "../../assets/placeholder.png";
import "./ShoeImages.css";
import { shoeimagesURL, shoesURL } from "../Common/Endpoints";
import { useParams } from "react-router-dom";  // Import useParams

interface ShoeImage {
  id: string;
  image: string;
  image_url: string;
}

// Fetcher function for SWR
const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);

const ShoeImages: React.FC = () => {
  const { id: shoeId } = useParams<{ id: string }>();  // Extract shoeId from URL
  const [newImage, setNewImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [shoename, setShoename] = useState<string>("");

  // Fetch the shoe name based on shoeId
  useEffect(() => {
    const fetchShoeDetails = async () => {
      try {
        const response = await axiosInstance.get(`${shoesURL}${shoeId}/`);
        setShoename(response.data.name); // Assuming the name is in response.data.name
      } catch (error) {
        console.error("Error fetching shoe details:", error);
      }
    };
    fetchShoeDetails();
  }, [shoeId]);

  // Use SWR to fetch the images for the shoe
  const { data: images, error, mutate } = useSWR<ShoeImage[]>(
    `${shoeimagesURL}?shoe=${shoeId}`,
    fetcher
  );

  // Handle image upload
  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImage) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("image", newImage);
    try {
      await axiosInstance.post(`${shoeimagesURL}?shoe=${shoeId}`, formData);
      mutate(); // Re-fetch images after adding new one
      setNewImage(null); // Reset input
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    setLoading(false);
  };

  // Handle image delete
  const handleDeleteImage = async (imageId: string) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      await axiosInstance.delete(`${shoeimagesURL}${imageId}/`);
      mutate(); // Re-fetch images after deleting one
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  // Handle image file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  if (error) return <p>Error loading images</p>;
  if (!images) return <p>Loading images...</p>;

  return (
    <div className="shoe-images-container">
      <h3>Manage Images for {shoename}</h3> {/* Display shoename */}
      <div className="images-list">
        {images.length > 0 ? (
          images.map((image) => (
            <Card key={image.id} style={{ width: "18rem" }}>
              <Card.Img
                variant="top"
                src={image.image || placeholderImage}
                alt={`Image for shoe ${shoename}`}
                className="shoe-image"
              />
              <Card.Body>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteImage(image.id)}
                >
                  Delete
                </Button>
              </Card.Body>
            </Card>
          ))
        ) : (
          <p>No images available for this shoe.</p>
        )}
      </div>
      <Form onSubmit={handleAddImage}>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Upload a new image</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} />
        </Form.Group>
        <Button type="submit" disabled={loading || !newImage}>
          {loading ? "Uploading..." : "Add Image"}
        </Button>
      </Form>
    </div>
  );
};

export default ShoeImages;
