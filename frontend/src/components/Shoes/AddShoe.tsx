import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { shoesURL, categoriesURL, shoeimagesURL } from "../Common/Endpoints";
import { axiosInstance } from "../Common/Auth.Service";
import { useSWRConfig } from "swr";

interface ShoeFormInputs {
  category: string;
  price: number;
  name: string;
  description: string;
  quantity: number;
  images: FileList;
}

interface Category {
  code: string;
  description: string;
}

const AddShoe: React.FC = () => {
  const navigate = useNavigate();
  const { mutate } = useSWRConfig();
  const [categories, setCategories] = useState<Category[]>([]);
  const [successMsg, setSuccessMsg] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ShoeFormInputs>({
    defaultValues: {
      category: "",
      price: 0,
      name: "",
      description: "",
      quantity: 1,
      images: [] as unknown as FileList,
    },
  });
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

    fetchCategories();
  }, []);

  const onSubmit: SubmitHandler<ShoeFormInputs> = async (data) => {
    try {
      const shoeResponse = await axiosInstance.post(shoesURL, {
        category: data.category,
        price: data.price,
        name: data.name,
        description: data.description,
        quantity: data.quantity,
      });

      const shoeId = shoeResponse.data.id;

      for (const image of Array.from(data.images)) {
        const formData = new FormData();
        formData.append("shoe", shoeId);
        formData.append("image", image);

        await axiosInstance.post(shoeimagesURL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      setSuccessMsg("Shoe creation is successful.");
      reset();
      mutate(shoesURL);
      navigate("/");
    } catch (error: any) {
      console.error("Error adding shoe:", error);
      setError(error.response.data.message);
    }
  };

  return (
    <div className="container">
      <h1>Add Shoe</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {successMsg && <p className="success-msg">{successMsg}</p>}
        {error && <p className="error-msg">{error}</p>}
        <Form.Group className="mb-3" controlId="category">
          <Form.Label>Category</Form.Label>
          <Form.Select
            {...register("category", { required: "This is required" })}
            defaultValue=""
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
            placeholder="Name"
          />
          {errors.name && <p className="errorMsg">{errors.name.message}</p>}
        </Form.Group>
        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea" rows={3}
            {...register("description", { required: "This is required" })}
            placeholder="Description"
          />
          {errors.description && <p className="errorMsg">{errors.description.message}</p>}
        </Form.Group>
        <Form.Group controlId="images" className="mb-3">
          <Form.Label>Images</Form.Label>
          <Form.Control
            type="file"
            {...register("images", { required: "This is required" })}
            multiple
          />
          {errors.images && <p className="errorMsg">{errors.images.message}</p>}
        </Form.Group>
        <Form.Group className="mb-3" controlId="price">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            {...register("price", { required: "This is required", min: 0 })}
            placeholder="Price"
          />
          {errors.price && <p className="errorMsg">{errors.price.message}</p>}
        </Form.Group>
        <Form.Group className="mb-3" controlId="quantity">
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="number"
            {...register("quantity", { required: "This is required", min: 0 })}
            placeholder="Quantity"
          />
          {errors.quantity && <p className="errorMsg">{errors.quantity.message}</p>}
        </Form.Group>
        <Button type="submit" variant="primary">
          Add Shoe
        </Button>
      </form>
    </div>
  );
};

export default AddShoe;
