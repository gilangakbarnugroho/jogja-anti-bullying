"use client";

import { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth } from "../firebase/firebaseConfig";

const categories = [
  "Bullying di Sekolah",
  "Kesehatan Mental",
  "Cyberbullying",
  "Dukungan Emosional",
];

const NewPostForm = () => {
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(categories[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Pastikan pengguna login
    if (!auth.currentUser) {
      alert("Anda harus login untuk menambahkan postingan.");
      return;
    }

    if (content.trim()) {
      try {
        await addDoc(collection(db, "posts"), {
          content,
          user: auth.currentUser.email, // Menyimpan email pengguna yang login
          userId: auth.currentUser.uid,
          category, // Ambil kategori yang dipilih pengguna
          timestamp: serverTimestamp(),
          upvotes: [],
          downvotes: [],
        });
        setContent(""); // Reset form setelah postingan ditambahkan
        alert("Postingan berhasil ditambahkan!");
      } catch (error) {
        console.error("Error menambahkan postingan:", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border rounded-lg"
        placeholder="Tulis sesuatu..."
      />
      {/* <div className="mt-2">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Pilih Kategori:
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 text-white bg-bluetiful rounded-md shadow-sm"
        >
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div> */}
      <button
        type="submit"
        className="btn-bluetiful mt-2"
      >
        Kirim Postingan
      </button>
    </form>
  );
};

export default NewPostForm;
