import React from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import { axiosInstance } from '../Common/Auth.Service';
import { Button, Form } from 'react-bootstrap';

interface UserProfileForm {
  username: string;
  email: string;
  name: string;  // Handling name instead of first_name and last_name
}

const fetcher = (url: string) => axiosInstance.get(url).then(res => res.data);

const UserProfile: React.FC = () => {
  const { data: user, error, mutate } = useSWR('/dj-rest-auth/user/', fetcher);
  console.log("User Data:", user)
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<UserProfileForm>();

  React.useEffect(() => {
    if (user) {
      setValue('username', user.username);
      setValue('email', user.email);
      setValue('name', user.name);  // Populate the form with name
    }
  }, [user, setValue]);

  const onSubmit = async (data: UserProfileForm) => {
    try {
      await axiosInstance.patch('/dj-rest-auth/user/', data);
      mutate();  // Refresh the data after updating
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  if (error) return <p>Error loading user profile</p>;
  if (!user) return <p>Loading...</p>;

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group controlId="username">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          readOnly
          {...register('username')}
        />
      </Form.Group>

      <Form.Group controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          {...register('email', { required: true })}
        />
        {errors.email && <p>Email is required</p>}
      </Form.Group>

      <Form.Group controlId="name">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          {...register('name', { required: true })}
        />
        {errors.name && <p>Name is required</p>}
      </Form.Group>

      <Button type="submit">Update Profile</Button>
    </Form>
  );
};

export default UserProfile;
