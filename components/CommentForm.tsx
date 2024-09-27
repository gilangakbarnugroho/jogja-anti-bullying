"use client";

import { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth } from "../firebase/firebaseConfig";

interface CommentFormProps {
  postId: string; // ID postingan yang dikomentari
}

const CommentForm: React.FC<CommentFormProps> = ({ postId }) => {
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!auth.currentUser) {
      alert("Anda harus login untuk mengomentari.");
      return;
    }

    if (content.trim()) {
      try {
        await addDoc(collection(db, `posts/${postId}/comments`), {
          content,
          user: auth.currentUser?.email || "Anonim",
          timestamp: serverTimestamp(),
        });

        setContent(""); // Reset form setelah komentar ditambahkan
      } catch (error) {
        console.error("Error menambahkan komentar:", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border rounded-lg"
        placeholder="Tulis komentar Anda..."
      />
      <button
        type="submit"
        className="btn-bluetiful mt-2"
      >
        Kirim Komentar
      </button>
    </form>
  );
};

export default CommentForm;
