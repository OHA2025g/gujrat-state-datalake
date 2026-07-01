import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('gcsr_token');
    if (!token) { setLoading(false); return; }
    api.get('/auth/me')
      .then((r) => setUser(r.data))
      .catch(() => localStorage.removeItem('gcsr_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    const r = await api.post('/auth/login', { username, password });
    localStorage.setItem('gcsr_token', r.data.access_token);
    setUser(r.data.user);
    return r.data;
  };

  const logout = () => {
    localStorage.removeItem('gcsr_token');
    setUser(null);
    window.location.assign('/login');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
