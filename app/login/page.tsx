"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

const LoginPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  // Fungsi untuk login menggunakan Google
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Cek apakah pengguna sudah ada di Firestore
      const userRef = doc(db, "users", user.uid); // Gunakan `user.uid` sebagai ID dokumen
      const userSnap = await getDoc(userRef);

      // Jika pengguna belum ada, simpan data ke Firestore
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: user.displayName || "Anonymous",
          email: user.email,
          profilePicture: user.photoURL || "/default-profile.png",
        });
      }

      router.push("/ruang-bincang"); // Arahkan ke halaman utama setelah login
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      setError("Terjadi kesalahan saat login dengan Google.");
    }
  };

  useEffect(() => {
    if (auth.currentUser) {
      router.push("/ruang-bincang"); // Jika sudah login, arahkan langsung ke halaman utama
    }
  }, [router]);

  return (
    <div className="h-screen flex items-center">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl text-center font-bold text-gray-700 mb-6">Login</h1>
        <div className="flex flex-col items-center space-y-4">
          {/* Login dengan Google */}
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center shadow-md bg-white text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 space-x-2 w-full sm:max-w-xs"
          >
            <FcGoogle size={24} />
            <span>Login dengan Google</span>
          </button>

          {/* Link untuk Registrasi */}
          <div>
            <p className="text-sm text-gray-300 mt-4">
              Belum punya akun?{" "}
              <Link href="/register" className="text-blue-600 hover:underline">
                Daftar di sini.
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
