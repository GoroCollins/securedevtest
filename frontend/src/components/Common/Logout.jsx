import React, { useEffect, useState } from 'react';
import { useAuthService } from '../Common/Auth.Service';
import { useLocation, useNavigate } from 'react-router-dom';

const Logout = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { state } = useLocation();
  const { logout } = useAuthService();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        const response = await logout();
        if (response.status === 200) {
          navigate("/");
        }
      } catch (error) {
        if (error.response) {
          setError(error.response.data.message);
        } else if (error.request) {
          setError("Network error. Please try again later.");
        } else {
          setError("An error occurred. Please try again later.");
        }
      }
    };

    logoutUser();
  }, [logout, navigate, state]);

  return (
    <div>
      {error && <p className="error-msg">{error}</p>}
      {!error && <p>Logging out...</p>}
    </div>
  );
};

export default Logout;
