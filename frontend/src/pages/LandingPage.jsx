import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[#eef2ff] px-4 py-10">
      {/* Hero Section */}
      <section className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between mb-16">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Welcome to{" "}
            <span className="text-[#6c63ff]">School Equipment Portal</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Manage, borrow, and track all school equipment effortlessly.
            Designed for students, staff, and administrators to streamline
            equipment usage and availability.
          </p>
          <div className="flex gap-4">
            <Link
              to="/login"
              className="px-6 py-3 rounded card-neu hover:shadow-md transition"
            >
              Let's go
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <img
            src="/school.png"
            alt="School Illustration"
            className="w-full max-w-md rounded-xl shadow-lg card-neu"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-16">
        <div className="card-neu p-6 shadow-inner hover:shadow-lg transition rounded-xl">
          <img
            src="/borrow.jpg"
            alt="Borrow"
            className="w-16 h-16 mx-auto mb-4"
          />
          <h3 className="text-xl font-semibold mb-2">Borrow Equipment</h3>
          <p className="text-gray-600 text-sm">
            Students can easily request and borrow equipment with a few clicks.
          </p>
        </div>
        <div className="card-neu p-6 shadow-inner hover:shadow-lg transition rounded-xl">
          <img
            src="/manageinventory.jpg"
            alt="Manage"
            className="w-16 h-16 mx-auto mb-4"
          />
          <h3 className="text-xl font-semibold mb-2">Manage Inventory</h3>
          <p className="text-gray-600 text-sm">
            Admins and staff can efficiently track and manage all school
            equipment.
          </p>
        </div>
        <div className="card-neu p-6 shadow-inner hover:shadow-lg transition rounded-xl">
          <img
            src="/trackusage.jpg"
            alt="Track"
            className="w-16 h-16 mx-auto mb-4"
          />
          <h3 className="text-xl font-semibold mb-2">Track Usage</h3>
          <p className="text-gray-600 text-sm">
            Monitor equipment usage history and availability at a glance.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-4xl text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-800">
          Start managing your school equipment today!
        </h2>
        <p className="text-gray-600">
          Sign up now to join students, staff, and administrators in
          streamlining equipment lending and tracking.
        </p>
      </section>
      <div className="p-6">
        <Link
          to="/signup"
          className="px-8 py-3 rounded btn-soft bg-gradient-to-r from-[#6c63ff] to-[#574fd6] text-white shadow-md hover:shadow-lg transition"
        >
          Start your journey
        </Link>
      </div>
    </div>
  );
}
