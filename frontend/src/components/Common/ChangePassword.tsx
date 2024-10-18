import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { changePassword } from './Account.Service'; // Import the password change service
import { estimatePasswordStrength, getPasswordSuggestions } from './PasswordStrength'; // Import the password utility functions

interface IFormInput {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<IFormInput>();
  const [message, setMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordSuggestions, setPasswordSuggestions] = useState<string[]>([]);
  
  const newPassword = watch("newPassword");
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const onSubmit: SubmitHandler<IFormInput> = async ({ oldPassword, newPassword }) => {
    try {
      await changePassword(oldPassword, newPassword);
      setMessage("Password changed successfully.");
      reset(); // Clear the form
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login'); // Redirect to login page
      }, 2000); // Optional: 2-second delay before redirect
    } catch (error) {
      setMessage("Error: " + error);
    }
  };

  // Watch for newPassword changes to dynamically show strength and suggestions
  useEffect(() => {
    if (newPassword) {
      const strength = estimatePasswordStrength(newPassword);
      const suggestions = getPasswordSuggestions(newPassword);
      setPasswordStrength(strength);
      setPasswordSuggestions(suggestions);
    }
  }, [newPassword]);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Old Password</label>
          <input
            type="password"
            {...register('oldPassword', { required: 'Old password is required' })}
          />
          {errors.oldPassword && <p>{errors.oldPassword.message}</p>}
        </div>

        <div>
          <label>New Password</label>
          <input
            type="password"
            {...register('newPassword', {
              required: 'New password is required',
              minLength: { value: 8, message: 'New password must be at least 8 characters' }
            })}
          />
          {errors.newPassword && <p>{errors.newPassword.message}</p>}
          
          {/* Show password strength */}
          {newPassword && <p>Password Strength: {passwordStrength}</p>}

          {/* Show password suggestions */}
          {passwordSuggestions.length > 0 && (
            <ul>
              {passwordSuggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label>Confirm New Password</label>
          <input
            type="password"
            {...register('confirmPassword', {
              required: 'Please confirm your new password',
              validate: value => value === newPassword || 'Passwords do not match'
            })}
          />
          {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit">Change Password</button>
      </form>

      <p>{message}</p>
    </div>
  );
};

export default ChangePassword;
