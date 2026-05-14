import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { getUserProfile } from '../services/userService';
import { toast } from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('zinda_token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const logout = useCallback(() => {
    localStorage.removeItem('zinda_token');
    localStorage.removeItem('zinda_user');
    setToken(null);
    setUser(null);
  }, []);

  const fetchUser = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getUserProfile();
      if (data?.user) {
        setUser(data.user);
        localStorage.setItem('zinda_user', JSON.stringify(data.user));
      }
    } catch (error) {
      console.error('Fetch user error:', error);
      setError(error.message);
      
      // Only logout on definite auth failure, not network errors
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (credentials) => {
    try {
      const { data } = await api.post('/auth/login', credentials);
      localStorage.setItem('zinda_token', data.token);
      localStorage.setItem('zinda_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      localStorage.setItem('zinda_token', data.token);
      localStorage.setItem('zinda_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      throw err;
    }
  };

  const googleLogin = async (googleData) => {
    try {
      const { data } = await api.post('/auth/google-login', googleData);
      localStorage.setItem('zinda_token', data.token);
      localStorage.setItem('zinda_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      throw err;
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('zinda_user', JSON.stringify(updatedUser));
  };

  const refreshUser = async () => {
    try {
      const data = await getUserProfile();
      if (data?.user) {
        setUser(data.user);
        localStorage.setItem('zinda_user', JSON.stringify(data.user));
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      error,
      login,
      register,
      googleLogin,
      logout,
      updateUser,
      refreshUser,
      isAuthenticated: !!token && !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};
