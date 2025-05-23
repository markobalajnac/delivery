"use client"; // mora da stoji da bi ovo bila client komponenta

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";
import { getFirestore, doc, getDoc } from "firebase/firestore";


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
            setError("Nepoznata uloga korisnika");
        }
      } else {
        setError("Nije pronadjen korisnicki profil u bazi")
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
    <form onSubmit={handleLogin} className="max-w-md mx-auto p-4 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Prijava</h2>

      <label className="block mb-2">
        Email:
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded mt-1"
        />
      </label>

      <label className="block mb-2">
        Lozinka:
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded mt-1"
        />
      </label>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Loading..." : "Login"}
      </button>
    </form>
  );
}
