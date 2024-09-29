"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebaseConfig";
import Loader from "./ui/Loader";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login"); // Redirect ke login jika belum login
    }
  }, [user, loading, router]);

  if (loading) {
    return 
      <div className="flex items-center justify-center h-screen">
        <Loader /> 
      </div>
  }

  return <>{user ? children : null}</>;
};

export default AuthGuard;
