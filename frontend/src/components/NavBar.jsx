import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const handleLogout = () => { 
    setConfirmLogout(false);
    logout();
    nav("/");
  };

  return (
    <header className="py-4 bg-[#eef2ff] shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-inner card-neu">
            <img
              src="/favicon.svg"
              alt="Book Logo"
              width={"20px"}
              height={"20px"}
              className="w-8 h-8 object-contain"
            />
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-700">
              School Equipment Portal
            </div>
            <div className="text-xs text-muted">Borrow • Manage • Track</div>
          </div>
        </Link>

        {/* Links */}
        <nav className="flex items-center gap-4">
          {user && (
            <Link
              to="/"
              className="px-4 py-2 rounded card-neu hover:shadow-md transition"
            >
              Home
            </Link>
          )}

          {(user?.role === "admin" || user?.role === "staff") && (
            <Link
              to="/manage"
              className="px-4 py-2 rounded card-neu hover:shadow-md transition"
            >
              Manage
            </Link>
          )}

          {!user ? (
            <>
              <Link to="/login" className="px-4 py-2 rounded btn-soft">
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded btn-soft bg-gradient-to-r from-[#6c63ff] to-[#574fd6] text-white"
              >
                Sign up
              </Link>
            </>
          ) : (
            <div className="relative">
              {/* Profile button */}
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded card-neu shadow-inner hover:shadow-md transition"
              >
                <img
                  src="/user.jpg" // <-- optional user icon
                  alt="User Icon"
                  width={"19px"}
                  height={"19px"}
                  className="w-5 h-5 rounded-full"
                />
                <span>{user.name}</span>
                <span className="text-xs text-muted">({user.role})</span>
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#f7f9ff] rounded-xl shadow-lg card-neu flex flex-col py-2 z-10">
                  {user.role === "admin" && (
                    <Link
                      to="/admin/items"
                      className="px-4 py-2 hover:bg-[#e1e4f0] rounded transition"
                      onClick={() => setProfileOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {setConfirmLogout(true); setProfileOpen(!profileOpen)}}
                    className="px-4 py-2 hover:bg-[#e1e4f0] rounded transition text-red-600 text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
          {confirmLogout && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              <div className="bg-[#f7f9ff] card-neu rounded-xl p-6 shadow-lg z-10 max-w-sm w-full text-center">
                <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
                <p className="text-sm text-muted mb-6">
                  Are you sure you want to log out?
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setConfirmLogout(false)}
                    className="px-4 py-2 rounded card-neu hover:shadow-md transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded btn-soft bg-red-600 text-white"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
