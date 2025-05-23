"use client";

import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";

export default function CourierPage() {
  const router = useRouter();
      const handleLogout = () => {
          deleteCookie("session");
          router.push("/login");
      };
    return (
      <main className="p-10">
        <h1 className="text-3xl font-bold">Welcome, Courier</h1>
        <button className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700 disabled:opacity-50" onClick={handleLogout}>Logout</button>
      </main>
    );
}