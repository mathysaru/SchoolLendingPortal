import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Signup(){
  const { signup } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  async function submit(e){
    e.preventDefault();
    setErr('');
    try{
      await signup(name, email, password, 'student');
      nav('/');
    }catch(error){
      setErr(error.message);
    }
  }

  return (
    <div className="max-w-md mx-auto card-neu p-6 rounded-xl">
      <h2 className="text-2xl font-semibold mb-2">Sign up</h2>
      {err && <div className="text-sm text-red-600 mb-2">{err}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input type="text" placeholder="Full name" required className="w-full p-3 border rounded" value={name} onChange={e=>setName(e.target.value)} />
        <input type="email" placeholder="Email" required className="w-full p-3 border rounded" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" placeholder="Password (min 6 chars)" required className="w-full p-3 border rounded" value={password} onChange={e=>setPassword(e.target.value)} />
        <div className="flex justify-end">
          <button type="submit" className="btn-soft rounded">Create account</button>
        </div>
      </form>
    </div>
  );
}
