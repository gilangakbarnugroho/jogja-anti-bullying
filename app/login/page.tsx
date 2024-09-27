"use client";

import { useRouter } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useEffect } from "react";

const LoginPage = () => {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Simpan pengguna ke Firestore jika belum ada
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        name: user.displayName,
        email: user.email,
        profilePicture: user.photoURL,
        role: "user", // Role default, bisa diubah ke admin melalui Firestore
      });

      router.push("/"); // Arahkan pengguna ke halaman utama setelah login
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      alert("Terjadi kesalahan saat login dengan Google.");
    }
  };

  useEffect(() => {
    if (auth.currentUser) {
      router.push("/"); // Jika sudah login, arahkan langsung ke halaman utama
    }
  }, [router]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <div className="flex flex-col items-center">
        <button
          onClick={handleGoogleLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Login dengan Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
