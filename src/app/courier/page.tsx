"use client";

import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";
import { useState } from "react";
import Link from "next/link";
import DriverDeliveriesList from "@/components/DriverDeliveriesList";

export default function CourierDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    deleteCookie("session");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="w-full bg-white shadow-md px-4 py-3 flex justify-between items-center">
        <button
          onClick={() => setSidebarOpen(true)}
          className="sm:hidden text-gray-700 focus:outline-none"
          aria-label="Open sidebar"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>

        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Courier Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm sm:text-base"
        >
          Logout
        </button>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40 sm:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`
            fixed top-0 left-0 h-full w-64 bg-white border-r p-4 z-50
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            sm:translate-x-0 sm:static sm:block sm:z-auto
          `}
        >
          <nav className="space-y-2">
            <Link href="/courier/start-delivery" className="block px-3 py-2 rounded-md hover:bg-gray-200 text-gray-700 font-medium">
              Start Delivery
            </Link>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-2 sm:p-6 transition-all duration-300 ease-in-out">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-700">Welcome, courier!</h2>
            <DriverDeliveriesList />
            <p className="text-gray-600 mt-2">You currently have no active deliveries.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
