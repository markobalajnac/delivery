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
        <button onClick={handleLogout}>Logout</button>
      </main>
    );
}