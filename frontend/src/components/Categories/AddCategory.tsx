import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { categoriesURL } from "../Common/Endpoints";
import { axiosInstance } from "../Common/Auth.Service";

interface CategoryFormInputs {
  code: string;
  description: string;
}

const AddCategory: React.FC = () => {
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [apiError, setApiError] = useState<string>(""); // State for API error messages
  const [loading, setLoading] = useState<boolean>(false); 
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormInputs>({
    defaultValues: {
      code: "",
      description: ""
    },
  });

  const onSubmit: SubmitHandler<CategoryFormInputs> = async (data) => {
    // Reset error messages at the start of submission
    setApiError(""); // Reset API error message
    setLoading(true);
  
    // Perform validation checks and set the error state accordingly
    if (!data.code) {
      setApiError("Code is required");
      return; // Stop further submission if code is empty
    }
    if (!data.description) {
      setApiError("Description is required");
      return; // Stop further submission if description is empty
    }
  
    try {
      await axiosInstance.post(categoriesURL, data);
      setSuccessMsg("Category creation is successful.");
      reset();
      navigate("/categories");
    } catch (error: any) {
      console.error("Error adding category:", error);
      // Handle API error
      if (error.response?.data?.message) {
        setApiError(error.response.data.message);
      } else {
        setApiError("An unexpected error occurred.");
      }
    }  finally {
      setLoading(false); // Re-enable the button after the process
    }
  };
  

  return (
    <div className="container">
      <h1>Add Category</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {successMsg && <p className="success-msg">{successMsg}</p>}
        {apiError && <p className="error-msg">{apiError}</p>} {/* Display API error */}
        <Form.Group className="mb-3" controlId="code">
          <Form.Label>Code</Form.Label>
          <Form.Control
            type="text"
            {...register("code", {
              required: "Code is required",
              maxLength: { value: 6, message: "Code must not be more than 6 characters long" },
            })}
            placeholder="Code"
          />
          {errors.code && <p className="errorMsg">{errors.code.message}</p>}
        </Form.Group>
        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea" rows={3}
            {...register("description", { required: "Description is required" })}
            placeholder="Description"
          />
          {errors.description && <p className="errorMsg">{errors.description.message}</p>}
        </Form.Group>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Submitting..." : "Add Category"}
        </Button>
      </form>
    </div>
  );
};

export default AddCategory;
