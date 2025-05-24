"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Driver {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isDriving: boolean; // Pretpostavljamo da backend vraća `isActive` boolean
}

export default function DriverList() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDrivers = async () => {
      const res = await fetch("/api/drivers");
      const data = await res.json();
      if (data.success) {
        setDrivers(data.drivers);
      }
      setLoading(false);
    };
    fetchDrivers();
  }, []);

  if (loading) return <p>Loading drivers...</p>;

  return (
    <div className="mt-6">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">Drivers</h3>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {drivers.map((driver) => (
          <li
            key={driver.id}
            onClick={() => router.push(`/admin/drivers/${driver.id}`)}
            className="cursor-pointer bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200 border border-gray-200 hover:border-gray-300"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold text-gray-700">{driver.name}</p>
                <p className="text-sm text-gray-500">{driver.email}</p>
                {driver.phone && <p className="text-sm text-gray-500">{driver.phone}</p>}
              </div>

              {/* Status indicator */}
              <div className="relative group">
                <span
                  className={`w-3 h-3 rounded-full block ${
                    driver.isDriving ? "bg-green-500" : "bg-red-500"
                  }`}
                ></span>
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {driver.isDriving ? "Active" : "Not Active"}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
