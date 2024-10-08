import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { categoriesURL } from "../Common/Endpoints";
import { axiosInstance } from "../Common/Auth.Service";

interface CategoryFormInputs {
  code: string;
  description: string;
}

const EditCategory: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<CategoryFormInputs>();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axiosInstance.get(`${categoriesURL}${id}`);
        const category = response.data;
        setValue("code", category.code);
        setValue("description", category.description);
      } catch (error: any) {
        console.error("Error fetching category:", error);
        setError("Failed to fetch category details.");
      }
    };

    fetchCategory();
  }, [id, setValue]);

  const onSubmit: SubmitHandler<CategoryFormInputs> = async (data) => {
    try {
      await axiosInstance.put(`${categoriesURL}${id}/`, { code: data.code, description: data.description });
      setSuccessMsg("Category updated successfully.");
      reset();
      navigate("/categories");
    } catch (error: any) {
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
};

export default EditCategory;
