"use client"; // mora da stoji da bi ovo bila client komponenta

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";
import { getFirestore, doc, getDoc } from "firebase/firestore";


import { setCookie } from "cookies-next";

const db = getFirestore();

export default function LoginForm() {

    const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Uzmi Firebase token i stavi ga u cookie
    const token = await user.getIdToken();
    if (token) {
      //setCookie("session", token);
      setCookie("session", token, { path: "/" });
    }

      //uhvati korisnicki dokument iz baze
      const docRef = doc(db,"users", user.uid);
      const docSnap = await getDoc(docRef);

      if(docSnap.exists()) {
        const userData = docSnap.data();
        const role = userData.role;

        if(role === "admin") {
            router.push("/admin");
        } else if(role === "courier"){
            router.push("/courier");
        } else {
            setError("Unauthorized role");
        }
      } else {
        setError("User role not found.")
      }


      // Uspešna prijava
      //alert("Uspešno ste se prijavili!");
      // Ovde možeš redirect, ili stanje da sačuvaš u kontekst ili cookie
    } catch (error: any) {
       // console.error(error); // opcionalno: za tebe, u konzoli
  switch (error.code) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      setError("Incorrect email or password.");
      break;
    case "auth/too-many-requests":
      setError("Too many failed attempts. Please try again later.");
      break;
    default:
      setError("An error occurred. Please try again.");
  }
      
    } finally {
      setLoading(false);
    }
  }

  return (
     <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-200 to-purple-300">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h1>
            <form onSubmit={handleLogin} className="space-y-4">

      <label className="block mb-2">
        Email:
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </label>

      <label className="block mb-2">
        Password:
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </label>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition duration-200"
      >
        {loading ? "Loading..." : "Login"}
      </button>
    </form>
      </div>
    </div>
    
    
  );
}
