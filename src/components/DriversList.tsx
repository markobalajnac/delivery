"use client";

import { useEffect, useState } from "react";

interface Driver {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export default function DriverList() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

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
      <h3 className="text-xl font-semibold mb-4">Drivers List</h3>
      <ul className="space-y-2">
        {drivers.map((driver) => (
          <li key={driver.id} className="bg-gray-100 p-4 rounded-md shadow-sm">
            <p><strong>Name:</strong> {driver.name}</p>
            <p><strong>Email:</strong> {driver.email}</p>
            {driver.phone && <p><strong>Phone:</strong> {driver.phone}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
