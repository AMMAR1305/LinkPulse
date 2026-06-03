import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('access_token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Validate token on mount
  useEffect(() => {
    const validate = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.data);
        } catch (e) {
          console.error('Token validation failed', e);
          logout();
        }
      }
      setLoading(false);
    };
    validate();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.data.twoFactorRequired) {
      return res.data.data;
    }
    const { token, ...user } = res.data.data;
    localStorage.setItem('access_token', token);
    setToken(token);
    setUser(user);
    navigate('/dashboard');
    return res.data.data;
  };

  const verify2FALogin = async (tempToken, code) => {
    const res = await api.post('/auth/2fa/login-verify', { tempToken, token: code });
    const { token, ...user } = res.data.data;
    localStorage.setItem('access_token', token);
    setToken(token);
    setUser(user);
    navigate('/dashboard');
    return res.data.data;
  };

  const register = async (data) => {
    const res = await api.post('/auth/register', data);
    const { token, ...user } = res.data.data;
    localStorage.setItem('access_token', token);
    setToken(token);
    setUser(user);
    navigate('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    token,
    loading,
    login,
    verify2FALogin,
    register,
    logout,
    setUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
