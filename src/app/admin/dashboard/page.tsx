"use client";

import { useEffect } from "react";

export default function AdminDashboard() {
  useEffect(() => {
    // Ovde može ići neka logika kao što je fetch podataka u budućnosti
    console.log("Admin dashboard loaded");
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4 hidden md:block">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <ul className="space-y-2">
          <li className="text-gray-700 hover:text-blue-600 cursor-pointer">Dashboard</li>
          <li className="text-gray-700 hover:text-blue-600 cursor-pointer">Orders</li>
          <li className="text-gray-700 hover:text-blue-600 cursor-pointer">Users</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Welcome, Admin</h1>

        {/* Primer: Admin kartice */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
            <p className="text-2xl font-bold text-blue-600">123</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <h3 className="text-lg font-semibold mb-2">Active Couriers</h3>
            <p className="text-2xl font-bold text-green-600">8</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <h3 className="text-lg font-semibold mb-2">Users</h3>
            <p className="text-2xl font-bold text-purple-600">42</p>
          </div>
        </div>
      </main>
    </div>
  );
}
