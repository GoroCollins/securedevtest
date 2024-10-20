import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import { axiosInstance } from '../Common/Auth.Service'; // Ensure axiosInstance has auth token setup

interface UserProfileData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

// Fetcher function for SWR
const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);

const UserProfile: React.FC = () => {
  const { data: userData, error, mutate } = useSWR<UserProfileData>('/dj-rest-auth/user/', fetcher);

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = useForm<UserProfileData>();

  // Populate the form when the userData is fetched
  React.useEffect(() => {
    if (userData) {
      setValue('email', userData.email);
      setValue('first_name', userData.first_name);
      setValue('last_name', userData.last_name);
    }
  }, [userData, setValue]);
  
  // Handle form submission to update user profile
  const onSubmit = async (formData: UserProfileData) => {
    try {
      await axiosInstance.patch('/dj-rest-auth/user/', {
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
      });
      mutate(); // Refresh the data after a successful update
      alert('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile.');
    }
  };

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!userData) {
    return <p>Loading user data...</p>;
  }

  return (
    <>
      <h1>User Details</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* Username (read-only) */}
        <Form.Group controlId="formUsername" className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" value={userData.username} readOnly />
        </Form.Group>

        {/* First Name (editable) */}
        <Form.Group controlId="formFirstName" className="mb-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            {...register('first_name', { required: true })}
            placeholder="Enter first name"
          />
        </Form.Group>

        {/* Last Name (editable) */}
        <Form.Group controlId="formLastName" className="mb-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            {...register('last_name', { required: true })}
            placeholder="Enter last name"
          />
        </Form.Group>

        {/* Email (editable) */}
        <Form.Group controlId="formEmail" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            {...register('email', { required: true })}
            placeholder="Enter email"
          />
        </Form.Group>

        {/* Submit Button */}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Update Profile'}
        </Button>
      </Form>
    </>
  );
};

export default UserProfile;
