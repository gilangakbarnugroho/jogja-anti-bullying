"use client";
import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../firebase/firebaseConfig";

interface GelarPostFormProps {
  onClose: () => void; // Fungsi untuk menutup modal
}

const GelarPostForm: React.FC<GelarPostFormProps> = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content || !category || !file) {
      alert("Judul, konten, kategori, dan gambar wajib diisi!");
      return;
    }

    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert("Ukuran gambar maksimal adalah 2MB. Silakan pilih gambar lain.");
      return;
    }

    try {
      setUploading(true);
      const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error("Error uploading file:", error);
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          const currentUser = auth.currentUser;
          const author = currentUser ? currentUser.email : "Anonim";

          await addDoc(collection(db, "gelarPosts"), {
            title,
            content,
            category,
            imageUrl: downloadURL,
            createdAt: new Date(), 
            author,
            approved: false, 
            likes: 0,
          });

          alert("Postingan berhasil diunggah! Tunggu persetujuan admin.");
          onClose(); 
        }
      );
    } catch (error) {
      console.error("Error adding post:", error);
      setUploading(false);
      alert("Error adding post.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-bluetiful">Unggah GelarPost Baru</h2>
      <input
        type="text"
        placeholder="Judul Postingan"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-4 py-2 border rounded"
        required
      />
      <textarea
        placeholder="Konten Postingan"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full px-4 py-2 border rounded"
        required
      ></textarea>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full px-4 py-2 border rounded"
        required
      >
        <option value="">Pilih Kategori</option>
        <option value="Pendidikan">Pendidikan</option>
        <option value="Sosial">Sosial</option>
        <option value="Budaya">Budaya</option>
        <option value="Teknologi">Teknologi</option>
      </select>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
        className="w-full"
        accept="image/*"
        required
      />
      <button
        type="submit"
        className={`px-7 py-3 mt-2 shadow-md rounded-full ${uploading ? "bg-gray-500" : "bg-bluetiful text-white"} ${uploading ? "cursor-not-allowed" : "hover:bg-white hover:text-bluetiful font-semibold"}`}
        disabled={uploading}
      >
        {uploading ? "Mengunggah..." : "Unggah Post"}
      </button>
    </form>
  );
};

export default GelarPostForm;
