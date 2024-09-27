"use client";

import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

const RegisterPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Fungsi untuk registrasi dengan Email dan Password
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // Kirim email verifikasi setelah pendaftaran berhasil
      await sendEmailVerification(user);
      alert("Pendaftaran berhasil! Silakan periksa email Anda untuk verifikasi.");

      // Simpan pengguna ke Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: user.email?.split("@")[0],
        email: user.email,
        profilePicture: "",
        role: "user",
        emailVerified: false, // Set status email verifikasi ke false
      });

      // Logout dan arahkan ke halaman login setelah kirim verifikasi
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error during registration:", error);
      setError("Pendaftaran gagal. Silakan coba lagi.");
    }
  };

  // Fungsi untuk registrasi dengan Google dan verifikasi email
  const handleGoogleRegister = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Cek apakah pengguna sudah terdaftar di Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Simpan data pengguna baru ke Firestore
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          profilePicture: user.photoURL,
          role: "user",
          emailVerified: false,
        });

        // Kirim email verifikasi
        if (!user.emailVerified) {
          await sendEmailVerification(user);
          alert("Pendaftaran berhasil menggunakan akun Google! Silakan periksa email Anda untuk verifikasi.");
        }
      } else {
        alert("Akun Google ini sudah terdaftar. Silakan login.");
      }

      // Logout setelah kirim verifikasi
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error during Google registration:", error);
      setError("Pendaftaran menggunakan Google gagal. Silakan coba lagi.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="container mx-auto p-4 max-w-sm bg-white shadow-md rounded-lg">
        <h1 className="text-3xl text-center font-bold text-gray-700 mb-6">Register</h1>
        <div className="flex flex-col items-center space-y-4">

          {/* Form Registrasi dengan Email dan Password */}
          <form onSubmit={handleRegister} className="w-full">
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
            {message && <p className="text-green-500 text-xs italic mb-4">{message}</p>}

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-700 w-full"
            >
              Register dengan Email
            </button>
          </form>

          {/* Register dengan Google */}
          <button
            onClick={handleGoogleRegister}
            className="flex items-center shadow-md bg-white text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 space-x-2"
          >
            <FcGoogle size={24} />
            <span>Register dengan Google</span>
          </button>

          {/* Link ke Halaman Login */}
          <div>
            <p className="text-sm text-gray-600 mt-4">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Login di sini.
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
