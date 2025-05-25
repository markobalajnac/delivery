"use client";

import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useToast } from "@/components/ToastProvider";
import { useRouter } from "next/navigation";

export default function StartDeliveryPage() {
    const [formData, setFormData] = useState({
        customerName: "",
        address: "",
        phone: "",
        packageDescription: "",
    });

    const { showToast } = useToast();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    async function createDelivery(data: typeof formData, driverId: string) {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch(`/api/drivers/${driverId}/deliveries`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    recipientName: data.customerName,
                    address: data.address,
                    phone: data.phone,
                    packageDetails: data.packageDescription,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create delivery");
            }

            setSuccess(true);
            setFormData({
                customerName: "",
                address: "",
                phone: "",
                packageDescription: "",
            });

            showToast("Delivery started successfully!", "success");

            // Preusmeri na dashboard
            setTimeout(() => {
                router.back();;
            }, 3000);

        } catch (err: any) {
            const msg = err.message || "Something went wrong";
            setError(msg);
            showToast(msg, "error");
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            const msg = "User is not logged in";
            setError(msg);
            showToast(msg, "error");
            return;
        }

        createDelivery(formData, user.uid);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
            <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Start New Delivery</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1" htmlFor="customerName">
                            Customer Name
                        </label>
                        <input
                            id="customerName"
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleChange}
                            type="text"
                            required
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1" htmlFor="address">
                            Address
                        </label>
                        <input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            type="text"
                            required
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1" htmlFor="phone">
                            Phone Number
                        </label>
                        <input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            type="text"
                            required
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1" htmlFor="packageDescription">
                            Package Description
                        </label>
                        <textarea
                            id="packageDescription"
                            name="packageDescription"
                            value={formData.packageDescription}
                            onChange={handleChange}
                            required
                            rows={3}
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        />
                    </div>

                    {error && <p className="text-red-600">{error}</p>}
                    {success && <p className="text-green-600">Delivery started successfully!</p>}

                    <div className="flex justify-between">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md"
                            disabled={loading}
                        >
                            {loading ? "Starting..." : "Start Delivery"}
                        </button>

                        {/* Dugme za povratak nazad */}
                        <button
                            onClick={() => router.back()}
                            className="mt-4 text-gray-600 underline"
                            disabled={loading}
                            type="button"
                        >
                            Go Back
                        </button>
                    </div>

                </form>


            </div>
        </div>
    );
}
