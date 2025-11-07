import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  async function submit(e){
    e.preventDefault();
    setErr('');
    try{
      await login(email, password);
      nav('/');
    }catch(error){
      setErr(error.message);
    }
  }

  return (
    <div className="max-w-md mx-auto card-neu p-6 rounded-xl">
      <h2 className="text-2xl font-semibold mb-2">Login</h2>
      <p className="text-sm text-gray-500 mb-4">Use your email and password</p>
      {err && <div className="text-sm text-red-600 mb-2">{err}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input type="email" placeholder="Email" required className="w-full p-3 border rounded" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" placeholder="Password" required className="w-full p-3 border rounded" value={password} onChange={e=>setPassword(e.target.value)} />
        <div className="flex justify-between items-center">
          <button type="submit" className="btn-soft rounded">Login</button>
          <a href="/signup" className="text-sm text-gray-600">Create an account</a>
        </div>
      </form>
    </div>
  );
}
