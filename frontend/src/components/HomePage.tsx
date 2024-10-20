import React, { useEffect, useState } from 'react';
import Shoes from './Shoes/Shoes';
import Footer from './Footer';
import { axiosInstance } from './Common/Auth.Service';

interface ShoesProps {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
}

export default function HomePage({ count, setCount }: ShoesProps) {
  const [user, setUser] = useState<{ name?: string; username?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data using useEffect
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get('/dj-rest-auth/user/');
        setUser(response.data);
        setError(null); // Reset error on success
      } catch (err) {
        setError('Error loading user information');
        setUser(null);
      } finally {
        setLoading(false); // Set loading to false after fetching completes
      }
    };

    fetchUserData();
  }, []); // Empty dependency array ensures this runs once on component mount

  return (
    <>
      {/* Check loading state */}
      {loading ? (
        <h1>Loading user information...</h1>
      ) : user ? (
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
