import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const isAuthenticated = !!user;

  const login = async (email, password) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo credentials
    if (email === 'demo@linkguardian.com' && password === 'demo123') {
      setUser({
        id: '1',
        name: 'Sarah Chen',
        email: email,
        plan: 'pro',
        avatar: 'https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
      });
      return;
    }
    
    // For any other credentials, create a user
    setUser({
      id: '1',
      name: 'Demo User',
      email: email,
      plan: 'free',
    });
  };

  const logout = () => {
    setUser(null);
  };

  const signup = async (name, email, password, plan = 'free') => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser({
      id: '1',
      name,
      email,
      plan,
    });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};