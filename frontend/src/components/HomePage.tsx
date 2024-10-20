import React from 'react';
import useSWR from 'swr';
import { axiosInstance } from './Common/Auth.Service';
import Shoes from './Shoes/Shoes';
import Footer from './Footer';

interface ShoesProps {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
}

// Fetcher function for SWR
const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);

export default function HomePage({ count, setCount }: ShoesProps) {
  // Fetch current user information
  const { data: user, error } = useSWR('/dj-rest-auth/user/', fetcher);

  if (error) return <p>Error loading user information</p>;

  return (
    <>
      {/* Check if the user data exists (authenticated) and show personalized welcome */}
      {user ? (
        <h1>Welcome {user.name || user.username} to Mobi hand made sandals</h1>
      ) : (
        <h1>Welcome to Mobi hand made sandals</h1>
      )}
      <br />
      <Shoes count={count} setCount={setCount} />
      <Footer />
      <footer>© {new Date().getFullYear()} SkyLimTech Inc™ All rights reserved.</footer>
    </>
  );
}
