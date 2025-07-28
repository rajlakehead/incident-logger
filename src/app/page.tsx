"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/useAuth";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Wait for Firebase Auth to load

    if (user) {
      router.replace("/incidents");
    } else {
      router.replace("/login"); // or "/" if your login page is the root
    }
  }, [user, loading, router]);

  return <p className="text-center mt-20">Redirecting...</p>;
}
