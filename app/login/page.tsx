"use client";

import { useRouter } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState(""); // State untuk email
  const [password, setPassword] = useState(""); // State untuk password
  const [error, setError] = useState<string | null>(null); // State untuk menyimpan pesan error

  // Fungsi untuk login dengan Google
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
        emailVerified: user.emailVerified, // Status verifikasi email
      });

      router.push("/"); // Arahkan pengguna ke halaman utama setelah login
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      setError("Terjadi kesalahan saat login dengan Google.");
    }
  };

  // Fungsi untuk login dengan Email dan Password
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error state

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/"); // Arahkan ke halaman utama setelah login
    } catch (error) {
      console.error("Error during email sign-in:", error);
      setError("Gagal login. Periksa kembali email dan password Anda.");
    }
  };

  useEffect(() => {
    if (auth.currentUser) {
      router.push("/"); // Jika sudah login, arahkan langsung ke halaman utama
    }
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="container mx-auto p-4 max-w-sm bg-white shadow-md rounded-lg">
        <h1 className="text-3xl text-center font-bold text-gray-700 mb-6">Login</h1>
        <div className="flex flex-col items-center space-y-4">

          {/* Form untuk login dengan Email dan Password */}
          <form onSubmit={handleEmailLogin} className="w-full">
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email Anda"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password Anda"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            {/* Pesan Error */}
            {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}

            <button
              type="submit"
              className="bg-bluetiful text-white px-4 py-2 rounded-full hover:bg-blue-700 w-full"
            >
              Login dengan Email
            </button>
          </form>

          {/* Login dengan Google */}
          <div>
            <button
              onClick={handleGoogleLogin}
              className="flex items-center shadow-md bg-white text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 space-x-2"
            >
              <FcGoogle size={24} /> 
              <span>Login dengan Google</span>
            </button>
          </div>

          {/* Link untuk Registrasi */}
          <div>
            <p className="text-sm text-gray-600 mt-4">
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
