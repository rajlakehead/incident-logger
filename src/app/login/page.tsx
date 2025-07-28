'use client';

import { auth, googleProvider } from "@/lib/firebase";
import { useAuth } from "@/lib/useAuth";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.push("/incidents");
  }, [user, router]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      alert("Login failed");
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl mb-6 text-black">Senior Care Incident Logger</h1>
      <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded">
        Login with Google
      </button>
    </main>
  );
}
