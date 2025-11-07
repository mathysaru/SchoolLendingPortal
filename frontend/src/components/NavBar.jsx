import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavBar(){
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <header className="py-4 bg-transparent shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white" style={{background: 'linear-gradient(135deg,#2563eb,#7c3aed)'}}>
            <span className="font-bold">SE</span>
          </div>
          <div>
            <div className="text-lg font-semibold">School Equipment Portal</div>
            <div className="text-xs text-gray-500">Borrow • Manage • Track</div>
          </div>
        </Link>

        <nav className="flex items-center gap-4">
          <Link to="/" className="text-sm text-gray-700">Home</Link>
          {user?.role === 'admin' && <Link to="/admin/items" className="text-sm text-gray-700">Admin</Link>}
          {(user?.role === 'admin' || user?.role === 'staff') && <Link to="/manage" className="text-sm text-gray-700">Manage</Link>}
          {!user ? (
            <>
              <Link to="/login" className="text-sm px-3 py-1 rounded">Login</Link>
              <Link to="/signup" className="text-sm px-3 py-1 rounded bg-gradient-to-r from-accent to-accentDark text-white">Sign up</Link>
            </>
          ) : (
            <>
              <div className="text-sm">{user.name} <span className="text-xs text-gray-400">({user.role})</span></div>
              <button onClick={()=>{ logout(); nav('/'); }} className="text-sm text-red-600">Logout</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
