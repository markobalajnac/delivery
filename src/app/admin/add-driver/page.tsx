"use client";

import { useState } from "react";
import { useToast } from "@/components/ToastProvider";


export default function AddDriverPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");

    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const data = {
    name,
    email,
    phone,
    password,
  };

  try {
    const res = await fetch("/api/create-driver", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok && result.success) {
      showToast("Vozač uspešno dodat", "success");
      // Očisti formu ako hoćeš:
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
    } else {
      showToast("Greška: " + result.error, "error");
    }
  } catch {
    showToast("Greška pri konekciji sa serverom", "error");
  }
};

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-200 to-purple-300">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Add driver</h1>
                <form onSubmit={handleSubmit} className="space-y-4">

                    <label className="block mb-2">
                        Name:
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />

                    </label>




                    <label className="block mb-2">
                        Email:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </label>

                    <label className="block mb-2">
                        Password:
                        <input
                            type="text"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />

                    </label>




                    <label className="block mb-2">
                        Phone:
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </label>



                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                    >
                        Add driver
                    </button>
                </form>
            </div>
        </div>


    );
}
