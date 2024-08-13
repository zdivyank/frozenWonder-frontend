import React, { createContext, useContext, useState, useEffect } from "react";
import { CONFIGS } from "../../config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState('');

  const AuthorizationToken = `Bearer ${token}`;

  const storeTokenInLS = (serverToken) => {
    setToken(serverToken);
    return localStorage.setItem("token", serverToken);
  };

  let isLoggedIn = !!token;

  const LogoutUser = () => {
    setToken("");
    setUser("");
    setRole("");
    return localStorage.removeItem("token");
  }

  const userAuthentication = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${CONFIGS.API_BASE_URL}/user`, {
        method: "GET",
        headers: {
          Authorization: AuthorizationToken,
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.userData);
        await fetchUserRole(data.userData._id);
        setIsLoading(false);
      } else {
        console.log('error fetching userdata')
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error Fetching user data", error)
      setIsLoading(false);
    }
  }
  

  const fetchUserRole = async (userId) => {
    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/fetchrole`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: AuthorizationToken,
        },
        body: JSON.stringify({ _id: userId }),
      });

      if (response.ok) {
        const data = await response.json();
        setRole(data.role);
      } else {
        console.log('Error fetching role');
      }
    } catch (error) {
      console.log('Error fetching role', error);
    }
  };

  useEffect(() => {
    if (token) {
      userAuthentication();
    } else {
      setIsLoading(false);
    }
  }, [token])

  return (
    <AuthContext.Provider value={{ isLoggedIn, storeTokenInLS, LogoutUser, user, role, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const AuthContextValue = useContext(AuthContext);
  if (!AuthContextValue) {
    throw new Error("useAuth used outside of the provider");
  }
  return AuthContextValue;
}