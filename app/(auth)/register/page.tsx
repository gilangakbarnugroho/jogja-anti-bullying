"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth, db, storage } from "../../../firebase/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";

const RegisterPage = () => {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={process.env.RECAPTCHA_SITE_KEY as string}>
      <RegisterForm />
    </GoogleReCaptchaProvider>
  );
};

const RegisterForm = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false); // Status verifikasi reCAPTCHA
  const [profilePicture, setProfilePicture] = useState<File | null>(null); // File gambar profil
  const [loading, setLoading] = useState(false);

  // Fungsi untuk mengunggah gambar profil ke Firebase Storage
  const uploadProfilePicture = async (userId: string, file: File) => {
    const storageRef = ref(storage, `profilePictures/${userId}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const handleGoogleRegister = async () => {
    if (!executeRecaptcha) {
      setError("ReCAPTCHA belum siap. Silakan coba lagi.");
      return;
    }

    try {
      setLoading(true);
      // Jalankan reCAPTCHA v3 dan dapatkan token verifikasi
      const token = await executeRecaptcha("register");
      if (!token) {
        setError("Verifikasi reCAPTCHA gagal. Silakan coba lagi.");
        setLoading(false);
        return;
      }

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      let photoURL = user.photoURL || ""; // Gambar profil dari Google

      if (!userSnap.exists()) {
        // Jika pengguna belum terdaftar di Firestore, simpan data baru
        if (profilePicture) {
          // Jika pengguna memilih gambar profil sendiri, unggah ke Firebase Storage
          photoURL = await uploadProfilePicture(user.uid, profilePicture);
        }

        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          profilePicture: photoURL,
          role: "user",
          emailVerified: user.emailVerified || false,
        });

        alert("Pendaftaran berhasil menggunakan akun Google!");
      } else {
        alert("Akun Google ini sudah terdaftar. Silakan login.");
      }

      await signOut(auth); // Logout setelah registrasi
      router.push("/login");
      setLoading(false);
    } catch (error) {
      console.error("Error during Google registration:", error);
      setError("Pendaftaran menggunakan Google gagal. Silakan coba lagi.");
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (auth.currentUser) {
      router.push("/ruang-bincang"); // Jika sudah login, arahkan langsung ke halaman utama
    }
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="container mx-auto p-4 max-w-sm">
        <h1 className="text-3xl text-center font-bold text-gray-700 mb-6">Register</h1>
        <div className="flex flex-col items-center space-y-4">

          {/* Pilih gambar profil */}
          {/* <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" /> */}

          {/* Register dengan Google */}
          <button
            onClick={handleGoogleRegister}
            className="flex items-center justify-center shadow-md bg-white text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 space-x-2 w-full sm:w-64"
            disabled={loading}
          >
            <FcGoogle size={24} />
            <span>{loading ? "Mendaftar..." : "Register dengan Google"}</span>
          </button>

          {/* Pesan Error */}
          {error && <p className="text-red-500 text-sm italic mt-2">{error}</p>}

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
