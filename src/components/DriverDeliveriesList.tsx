"use client";

import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

interface Delivery {
  id: string;
  recipientName: string;
  address: string;
  phone: string;
  packageDetails: string;
  status: string;
  createdAt: string;
}

export default function DriverDeliveriesList() {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    async function fetchDeliveries() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/drivers/${user.uid}/deliveries`);
        if (!res.ok) {
          throw new Error("Failed to fetch deliveries");
        }
        const data: Delivery[] = await res.json();
        setDeliveries(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchDeliveries();
  }, [user]);

  if (!authChecked) {
    return <p>Loading authentication...</p>;
  }

  if (!user) {
    return <p>Please log in to see your deliveries.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">My Deliveries</h2>

      {loading && <p>Loading deliveries...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && deliveries.length === 0 && <p>No deliveries found.</p>}

      <ul>
        {deliveries.map((delivery) => (
          <li
            key={delivery.id}
            className="border border-gray-300 rounded p-4 mb-3 shadow-sm"
          >
            <p>
              <strong>Recipient:</strong> {delivery.recipientName}
            </p>
            <p>
              <strong>Address:</strong> {delivery.address}
            </p>
            <p>
              <strong>Phone:</strong> {delivery.phone}
            </p>
            <p>
              <strong>Package Details:</strong> {delivery.packageDetails}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={
                  delivery.status === "pending"
                    ? "text-yellow-600"
                    : delivery.status === "delivered"
                    ? "text-green-600"
                    : "text-gray-600"
                }
              >
                {delivery.status}
              </span>
            </p>
            <p>
              <strong>Created at:</strong>{" "}
              {new Date(delivery.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
