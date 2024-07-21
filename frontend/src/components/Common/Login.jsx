import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthService } from "./Auth.Service";

export default function Login() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { login } = useAuthService();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    try {
      const response = await login(data.username, data.password); // Await the login function
      if (response.status === 200) {
        navigate(state?.from?.pathname || "/"); // Use state?.from?.pathname
        reset();
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status code outside of the range 2xx
        setError(error.response.data.message);
      } else if (error.request) {
        // Request made but no response received
        setError("Network error. Please try again later.");
      } else {
        // Something else happened in making the request
        console.log(error.message);
        setError("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* {successMsg && <p className="success-msg">{successMsg}</p>} */}
        <Form.Group className="mb-3" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            {...register("username", { required: "This is required" })}
            placeholder="username"
          />
          {errors.username && (
            <p className="errorMsg">{errors.username.message}</p>
          )}
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            {...register("password", { required: "This is required" })}
            placeholder="password"
          />
          {errors.password && (
            <p className="errorMsg">{errors.password.message}</p>
          )}
        </Form.Group>
        {error && <p className="error-msg">{error}</p>}
        <Button type="submit" variant="primary">
          Login
        </Button>
        <Button variant="secondary" onClick={() => navigate(-1)} style={{ marginLeft: '10px' }}>
          Back
        </Button>
      </form>
    </>
  );
}
