import React, { createContext, useContext, useEffect, useState } from 'react';
import { getUserFromToken } from '../utils/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const userData = getUserFromToken(token);
      setUser(userData);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('access_token', token);
    const userData = getUserFromToken(token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);