"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

interface Driver {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isDriving: boolean;
}

export default function DriverDetailPage() {
  const { id } = useParams();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDriver = async () => {
      const res = await fetch(`/api/drivers/${id}`);
      const data = await res.json();
      if (data.success) {
        setDriver(data.driver);
      }
      setLoading(false);
    };
    if (id) fetchDriver();
  }, [id]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!driver) return <p className="p-4 text-red-500">Driver not found.</p>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-xl mx-auto">
      <button
        className="mb-4 text-sm text-blue-600 hover:underline"
        onClick={() => router.back()}
      >
        &larr; Back to drivers list
      </button>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
        {driver.name}
        <span
          className={`inline-block w-4 h-4 rounded-full ml-3 ${
            driver.isDriving ? "bg-green-600" : "bg-red-600"
          }`}
          title={driver.isDriving ? "Active (Driving)" : "Inactive"}
        />
      </h2>

      <div className="space-y-3 text-gray-700">
        <p>
          <strong>Email:</strong> {driver.email}
        </p>
        {driver.phone && (
          <p>
            <strong>Phone:</strong> {driver.phone}
          </p>
        )}
      </div>
    </div>
  );
}
