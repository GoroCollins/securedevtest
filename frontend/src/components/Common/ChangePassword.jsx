import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Form } from "react-bootstrap";
import { estimatePasswordStrength, getPasswordSuggestions } from "./PasswordStrength.jsx";

export default function ChangePassword() {
  const { register, handleSubmit, formState: { errors }, reset, getValues } = useForm({
    defaultValues: {
      username: "",
      password: ""
    }
  });
  const [suggestions, setSuggestions] = useState([]);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [successMsg, setSuccessMsg] = useState("");


  const onSubmit = (data) => {
    console.log(data); // implement authentication here
    setSuccessMsg("Password updated successfully.");
    reset();
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    const strength = estimatePasswordStrength(newPassword);
    setPasswordStrength(strength);
    setSuggestions(getPasswordSuggestions());
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {successMsg && <p className="success-msg">{successMsg}</p>}
        <Form.Group className="mb-3" controlId="newpassword">
        <Form.Label>New Password</Form.Label>
        <Form.Control
          type="password"
          {...register("newpassword", {
            required: 'This is required',
            validate: {
              checkLength: (value) => value.length >= 6,
              matchPattern: (value) =>
                /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$*])/.test(value),
            },
          })}
          placeholder="New Password"
          onChange={handlePasswordChange}
        />
        {errors.newpassword && <p className="errorMsg">{errors.newpassword.message}</p>}
        {passwordStrength && (
          <p>Password strength: {passwordStrength}</p>
        )}
        {suggestions.length > 0 && (
          <div className="password-suggestions">
            <p>Suggestions:</p>
            <ul>
              {suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
</Form.Group>
<Form.Group className="mb-3" controlId="confirmpassword">
<Form.Label>Confirm Password</Form.Label>
        <Form.Control
          type="password"
          {...register("confirmpassword", {
            required: 'This is required',
            validate: {
              confirmPassword: (value) => value === getValues("newpassword") || "Passwords do not match",
            },
          })}
          placeholder="Confirm Password"
        />
        {errors.confirmpassword && <p className="errorMsg">{errors.confirmpassword.message}</p>}
        </Form.Group>
        <Button type="submit" variant="primary">
          Submit
        </Button>
      </form>
    </>
  );
}
