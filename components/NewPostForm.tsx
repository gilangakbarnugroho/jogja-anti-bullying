"use client";

import { useState } from "react";
import { db, auth } from "../firebase/firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

const NewPostForm = () => {
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!auth.currentUser) {
      alert("Anda harus login untuk membuat postingan.");
      return;
    }

    try {
      await addDoc(collection(db, "posts"), {
        content,
        user: auth.currentUser.uid, // UID dari pengguna saat ini
        name: auth.currentUser.displayName, // Nama pengguna dari akun Google
        profilePicture: auth.currentUser.photoURL || "", // Foto profil dari akun Google
        timestamp: serverTimestamp(),
      });
      setContent(""); // Reset form setelah submit
      router.push("/ruang-bincang");
    } catch (error) {
      console.error("Error adding post:", error);
      alert("Gagal menambahkan postingan.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-4 border rounded-lg mb-4"
        placeholder="Apa yang ingin Anda bagikan?"
        required
      ></textarea>
      <button
        type="submit"
        className="btn-bluetiful"
      >
        Tambahkan Post
      </button>
    </form>
  );
};

export default NewPostForm;
