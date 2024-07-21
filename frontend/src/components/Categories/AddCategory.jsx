import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { categoriesURL } from "../Common/Endpoints";
import { axiosInstance } from "../Common/Auth.Service";

export default function AddCategory() {
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      code: "",
      description: ""
    },
  });
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    try {
      await axiosInstance.post(categoriesURL, data);
      setSuccessMsg("Category creation is successful.");
      reset();
      navigate("/categories");
    } catch (error) {
      console.error("Error adding category:", error);
      setError(error.response.data.message);
    }
  };

  return (
    <div className="container">
      <h1>Add Category</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {successMsg && <p className="success-msg">{successMsg}</p>}
        {error && <p className="error-msg">{error}</p>}
        <Form.Group className="mb-3" controlId="code">
          <Form.Label>Code</Form.Label>
          <Form.Control
            type="text"
            {...register("code", { required: "This is required", maxLength: {value: 6, message: "Code must not be more than 6 characters long" } })}
            placeholder="Code"
          />
          {errors.code && <p className="errorMsg">{errors.name.message}</p>}
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
          Add Category
        </Button>
      </form>
    </div>
  );
}
