import React, { createContext, useState, useContext, useEffect } from 'react';
import { LocalDB } from '../config/firebase';
import { generateId } from '../utils/helpers';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await LocalDB.getCurrentUser();
      setUser(currentUser);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const loggedUser = await LocalDB.loginUser(email, password);
    setUser(loggedUser);
    return loggedUser;
  };

  const register = async (name, email, password, neighborhood) => {
    const newUser = {
      id: generateId(),
      name,
      email,
      password,
      neighborhood,
      avatar: '😊',
      createdAt: new Date().toISOString(),
    };
    await LocalDB.saveUser(newUser);
    setUser(newUser);
    return newUser;
  };

  const logout = async () => {
    await LocalDB.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};