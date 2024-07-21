import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { categoriesURL } from "../Common/Endpoints";
import { axiosInstance } from "../Common/Auth.Service";

export default function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axiosInstance.get(`${categoriesURL}${id}`);
        console.log(response)
        const category = response.data;
        setValue("code", category.code);
        setValue("description", category.description);
      } catch (error) {
        console.error("Error fetching category:", error);
        setError("Failed to fetch category details.");
      }
    };

    fetchCategory();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      await axiosInstance.put(`${categoriesURL}${id}/`, { code: data.code, description: data.description });
      console.log(data.description)
      setSuccessMsg("Category updated successfully.");
      reset();
      navigate("/categories");
    } catch (error) {
      console.error("Error updating category:", error);
      setError("Failed to update category.");
    }
  };

  return (
    <div className="container">
      <h1>Edit Category</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {successMsg && <p className="success-msg">{successMsg}</p>}
        {error && <p className="error-msg">{error}</p>}
        <Form.Group className="mb-3" controlId="code">
          <Form.Label>Code</Form.Label>
          <Form.Control
            type="text"
            {...register("code")}
            placeholder="Code"
            readOnly
          />
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
        <Button type="submit" variant="primary">
          Update Category
        </Button>
      </form>
    </div>
  );
}
