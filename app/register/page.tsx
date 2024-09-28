"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import ReCAPTCHA from "react-google-recaptcha";

const RegisterPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false); // Untuk status verifikasi reCAPTCHA

  // Fungsi untuk verifikasi reCAPTCHA
  const handleCaptchaVerify = (value: string | null) => {
    setIsVerified(value !== null);
  };

  // Fungsi untuk registrasi dengan Google
  const handleGoogleRegister = async () => {
    if (!isVerified) {
      setError("Tolong verifikasi bahwa Anda bukan robot.");
      return;
    }

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
          emailVerified: user.emailVerified || false,
        });
        alert("Pendaftaran berhasil menggunakan akun Google!");
      } else {
        alert("Akun Google ini sudah terdaftar. Silakan login.");
      }

      // Logout setelah registrasi
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error during Google registration:", error);
      setError("Pendaftaran menggunakan Google gagal. Silakan coba lagi.");
    }
  };

  useEffect(() => {
    if (auth.currentUser) {
      router.push("/ruang-bincang"); // Jika sudah login, arahkan langsung ke halaman utama
    }
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="container mx-auto p-4 max-w-md bg-white rounded-lg">
        <h1 className="text-3xl text-center font-bold text-gray-700 mb-6">Register</h1>
        <div className="flex flex-col items-center space-y-4">

          {/* Register dengan Google */}
          <button
            onClick={handleGoogleRegister}
            className="flex items-center justify-center shadow-md bg-white text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 space-x-2 w-full sm:max-w-xs"
          >
            <FcGoogle size={24} />
            <span>Register dengan Google</span>
          </button>

          {/* reCAPTCHA */}
          <div className="mt-4">
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string} // Site Key dari reCAPTCHA
              onChange={handleCaptchaVerify}
            />
          </div>

          {/* Pesan Error */}
          {error && <p className="text-red-500 text-xs italic">{error}</p>}

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
