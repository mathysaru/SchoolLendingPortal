import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminItems from "./pages/AdminItems";
import ManageBookings from "./pages/ManageBookings";
import NavBar from "./components/NavBar";
import { useAuth } from './context/AuthContext';

export default function App() {
  const { user } = useAuth();
  return (
    <div className="py-4 bg-[#eef2ff] shadow-sm">
      <NavBar />
      <main className="p-6 max-w-6xl mx-auto">
        <Routes>
          <Route path="/" element={user ? <Home /> : <LandingPage />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin/items" element={<AdminItems />} />
          <Route path="/manage" element={<ManageBookings />} />
        </Routes>
      </main>
    </div>
  );
}
