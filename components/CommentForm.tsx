"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface CommentFormProps {
  postId: string; // ID post untuk menambahkan komentar
}

const CommentForm: React.FC<CommentFormProps> = ({ postId }) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null); // Simpan informasi user
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // Ambil informasi user dari auth Firebase
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            uid: currentUser.uid,
            name: userData.name,
            profilePicture: userData.profilePicture,
            email: currentUser.email,
          });
        } else {
          setUser({
            uid: currentUser.uid,
            name: currentUser.displayName,
            profilePicture: currentUser.photoURL,
            email: currentUser.email,
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!user) {
      setError("Anda harus login untuk berkomentar.");
      setLoading(false);
      return;
    }

    if (content.trim() === "") {
      setError("Isi komentar tidak boleh kosong.");
      setLoading(false);
      return;
    }

    try {
      // Simpan komentar ke Firestore
      await addDoc(collection(db, `posts/${postId}/comments`), {
        content,
        user: user.uid, // Simpan UID user
        name: user.name, // Simpan nama user
        profilePicture: user.profilePicture, // Simpan foto profil user
        timestamp: serverTimestamp(),
      });

      setContent(""); // Reset form
      setError(null);
      router.refresh(); // Refresh halaman
    } catch (err) {
      console.error("Error adding comment: ", err);
      setError("Terjadi kesalahan saat menambahkan komentar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 my-4">
      <div className="flex items-center space-x-3">
        {/* Tampilkan foto profil user */}
        {user?.profilePicture ? (
          <Image
            src={user.profilePicture}
            alt={`${user.name}'s profile picture`}
            width={30}
            height={30}
            className="rounded-full"
          />
        ) : (
          <div className="w-5 h-5 rounded-full bg-gray-200" />
        )}
        <h3 className="text-md text-gray-500 font-semibold">{user?.name || "Pengguna"}</h3>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
        placeholder="Tambahkan komentar Anda..."
      ></textarea>

      <button
        type="submit"
        className="self-end px-6 py-2 btn-bluetiful transition duration-200 disabled:bg-gray-300"
        disabled={loading}
      >
        {loading ? "Mengirim..." : "Kirim"}
      </button>

      {/* Tampilkan error jika ada */}
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default CommentForm;
