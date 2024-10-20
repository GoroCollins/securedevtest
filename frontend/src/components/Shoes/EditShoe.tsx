import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { shoesURL, categoriesURL, shoeimagesURL } from "../Common/Endpoints";
import { axiosInstance } from "../Common/Auth.Service";
import { useSWRConfig } from "swr";

interface ShoeFormInputs {
  id: string;
  category: string;
  price: number;
  name: string;
  description: string;
  quantity: number;
  newImages: FileList;
}

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
}

interface ShoeImage {
  id: string;
  url: string;
}

const EditShoe: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { mutate } = useSWRConfig();
  const [categories, setCategories] = useState<Category[]>([]);
  const [shoe, setShoe] = useState<Shoe | null>(null);
  const [images, setImages] = useState<ShoeImage[]>([]);
  const [successMsg, setSuccessMsg] = useState<string>("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ShoeFormInputs>();

  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get(categoriesURL);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchShoe = async () => {
      try {
        const response = await axiosInstance.get(`${shoesURL}${id}`);
        setShoe(response.data);
        setValue("category", response.data.category);
        setValue("name", response.data.name);
        setValue("description", response.data.description);
        setValue("price", response.data.price);
        setValue("quantity", response.data.quantity);
      } catch (error) {
        console.error("Error fetching shoe:", error);
      }
    };

    const fetchShoeImages = async () => {
      try {
        const response = await axiosInstance.get(`${shoeimagesURL}?shoe=${id}`);
        setImages(response.data);
      } catch (error) {
        console.error("Error fetching shoe images:", error);
      }
    };

    fetchCategories();
    fetchShoe();
    fetchShoeImages();
  }, [id, setValue]);

  const onSubmit: SubmitHandler<ShoeFormInputs> = async (data) => {
    try {
      await axiosInstance.put(`${shoesURL}${id}/`, {
        id: data.id,
        category: data.category,
        price: data.price,
        name: data.name,
        description: data.description,
        quantity: data.quantity,
      });

      if (data.newImages.length > 0) {
        for (const image of Array.from(data.newImages)) {
          const formData = new FormData();
          formData.append("shoe", id!);
          formData.append("image", image);

          await axiosInstance.post(shoeimagesURL, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        }
      }

      setSuccessMsg("Shoe update is successful.");
      reset();
      mutate(shoesURL);
      navigate("/");
    } catch (error: any) {
      console.error("Error updating shoe:", error);
      setError(error.response.data.message);
    }
  };

  if (!shoe) return <p>Loading...</p>;

  return (
    <div className="container">
      <h1>Edit Shoe</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {successMsg && <p className="success-msg">{successMsg}</p>}
        {error && <p className="error-msg">{error}</p>}
        <Form.Group className="mb-3" controlId="category">
          <Form.Label>Category</Form.Label>
          <Form.Select
            {...register("category", { required: "This is required" })}
            defaultValue={shoe.category}
          >
            <option value="" disabled hidden>
              Select Category
            </option>
            {categories.map((category) => (
              <option key={category.code} value={category.code}>
                {category.description}
              </option>
            ))}
          </Form.Select>
          {errors.category && (
            <p className="errorMsg">{errors.category.message}</p>
          )}
        </Form.Group>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            {...register("name", { required: "This is required" })}
            defaultValue={shoe.name}
            placeholder="Name"
          />
          {errors.name && <p className="errorMsg">{errors.name.message}</p>}
        </Form.Group>
        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea" rows={3}
            {...register("description", { required: "This is required" })}
            defaultValue={shoe.description}
            placeholder="Description"
          />
          {errors.description && <p className="errorMsg">{errors.description.message}</p>}
        </Form.Group>
        <Form.Group className="mb-3" controlId="price">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            {...register("price", { required: "This is required", min: 0 })}
            defaultValue={shoe.price}
            placeholder="Price"
          />
          {errors.price && <p className="errorMsg">{errors.price.message}</p>}
        </Form.Group>
        <Form.Group className="mb-3" controlId="quantity">
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="number"
            {...register("quantity", { required: "This is required", min: 0 })}
            defaultValue={shoe.quantity}
            placeholder="Quantity"
          />
          {errors.quantity && <p className="errorMsg">{errors.quantity.message}</p>}
        </Form.Group>
        <Form.Group controlId="newImages" className="mb-3">
          <Form.Label>New Images</Form.Label>
          <Form.Control type="file" 
            {...register("newImages")}
            multiple
          />
          {errors.newImages && <p className="errorMsg">{errors.newImages.message}</p>}
        </Form.Group>
        <Button type="submit" variant="primary">
          Update Shoe
        </Button>
      </form>
    </div>
  );
};

export default EditShoe;
