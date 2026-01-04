import React, { createContext, useContext, useState, useEffect } from "react";
import {AuthService } from "../services/authService";

// Create the authentication context
const AuthContext = createContext();

const authService = new AuthService()

// Custom hook for using the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign-in function
  const login = async (email, password) => {
    try {
      console.log(email,password)
      const response = await authService.login(email, password);
      console.log("resp: ", response)
      console.log("Setting user ", response.data.user, " as current user.")
      setCurrentUser(response.data.user);
      return response.user;
    } catch (error) {
      const message = error.message|| "Login failed";
      throw new Error(message);
    }
  };

  const register = async (email, username) => {
    try {
      const response = await authService.register(email, username);
      return response
    }catch(error){
      console.log(error)
      const message = error.message|| "Registration failed";
      throw new Error(message);
    }
  }

  // Sign-out function
  const logout = () => {
    console.log("logging out..")
    setCurrentUser(null);
    setAccesToken("")
    authService.logout();
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!currentUser;
  };

  // Load user from token on initial render
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        console.log("Getting access token...")
        const token = authService.getAccessToken();
        console.log("token, ", token)
        if (token) {
          const user = await authService.verifyToken(token);
          console.log("Setting user ", user ," as current user.")
          setCurrentUser(user);
        }
      } catch (error) {
        // Token is invalid
        console.log(error)
        console.log("deleting token...")
        authService.deleteAccessToken();
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Context value object that will be shared
  const value = {
    currentUser,
    login,
    logout,
    register,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};