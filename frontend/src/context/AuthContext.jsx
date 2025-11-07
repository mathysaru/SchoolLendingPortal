import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';

const AuthContext = createContext();
export function useAuth(){ return useContext(AuthContext); }

export function AuthProvider({ children }){
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('app_user')) || null; } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  useEffect(() => {
    if (user) localStorage.setItem('app_user', JSON.stringify(user)); else localStorage.removeItem('app_user');
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem('token', token); else localStorage.removeItem('token');
  }, [token]);

  async function signup(name, email, password, role='student'){
    try{
      const res = await api.post('/auth/signup', { name, email, password, role });
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data.user;
    }catch(err){
      // normalized error message
      const message = err?.response?.data?.error || err.message || 'Signup failed';
      throw new Error(message);
    }
  }

  async function login(email, password){
    try{
      const res = await api.post('/auth/login', { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data.user;
    }catch(err){
      const message = err?.response?.data?.error || err.message || 'Login failed';
      throw new Error(message);
    }
  }

  function logout(){
    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
