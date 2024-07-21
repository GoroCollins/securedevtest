import axios from "axios";
import { createContext, useContext, useMemo, useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;
import { userURL } from "./Endpoints";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    'X-CSRFToken': getCsrfToken(), // Function to retrieve the CSRF token from cookies
  },
});

function getCsrfToken() {
  const cookieValue = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
  return cookieValue ? cookieValue.split('=')[1] : null;
}

axiosInstance.interceptors.request.use(
  config => {
    const token = getCsrfToken();
    if (token) {
      config.headers['X-CSRFToken'] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

function getRefreshToken() {
  const cookieValue = document.cookie.split('; ').find(row => row.startsWith('refresh_token='));
  return cookieValue ? cookieValue.split('=')[1] : null;
}

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getRefreshToken(); // Function to retrieve the refresh token
        if (!refreshToken) {
          throw new Error("Refresh token not provided");
        }
        await axiosInstance.post(`/users/auth/refresh/`, { refresh_token: refreshToken });
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token expired:", refreshError);
      }
    }
    return Promise.reject(error);
  }
);

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get(userURL);
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const login = async (username, password) =>   {
    try { const response = await axiosInstance.post(`/users/auth/`, {
      username,
      password,
    });
    setIsAuthenticated(true);
    await fetchUser(); // Assuming the user info is in response.data.user
    return response;
  } catch(error) {
    console.error("Login error:", error)
    throw error;
  }
};

  const logout = async () => {
    const response = await axiosInstance.delete(`/users/auth/`);
    setIsAuthenticated(false);
    setUser(null);
    return response;
  };

  const checkAuthStatus = async () => {
    try {
      const response = await axiosInstance.get(`/users/auth/status`);
      setIsAuthenticated(response.data.isAuthenticated);
      if (response.data.isAuthenticated) {
        await fetchUser(); // Fetch user data if authenticated
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to check auth status:", error);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value = useMemo(
    () => ({
      login,
      logout,
      isAuthenticated,
      user,
    }),
    [isAuthenticated, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthService = () => {
  return useContext(AuthContext);
};
