"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, getDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../../../../firebase/firebaseConfig";
import PostCard from "../../../../components/PostCard"; // Tambahkan PostCard
import Loader from "../../../../components/ui/Loader";

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  likes: number;
  views: number;
}

export default function ManageGelar() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Tambahkan state isLoading
  const [isAdmin, setIsAdmin] = useState(false); // Status admin

  useEffect(() => {
    const checkAdminStatus = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(docRef);
        if (userDoc.exists() && userDoc.data().role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      }
    };
    checkAdminStatus();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true); // Set isLoading to true saat memulai fetch
      try {
        const querySnapshot = await getDocs(collection(db, "gelarPosts"));
        const postsData: Post[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      } finally {
        setIsLoading(false); // Set isLoading to false ketika fetch selesai
      }
    };
    fetchPosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content || !file) {
      alert("Judul, konten, dan gambar wajib diisi!");
      return;
    }

    const MAX_SIZE = 2 * 1024 * 1024; // Batas ukuran gambar maksimum 2MB
    if (file.size > MAX_SIZE) {
      setError("Ukuran gambar maksimal adalah 2MB. Silakan pilih gambar lain.");
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

          await addDoc(collection(db, "gelarPosts"), {
            title,
            content,
            imageUrl: downloadURL,
            createdAt: new Date().toLocaleDateString(),
            likes: 0,
            views: 0,
          });

          setTitle("");
          setContent("");
          setFile(null);
          setUploading(false);
          alert("Postingan berhasil ditambahkan!");
        }
      );
    } catch (error) {
      console.error("Error adding post:", error);
      setUploading(false);
      alert("Error adding post.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) {
      alert("Anda tidak memiliki izin untuk menghapus postingan.");
      return;
    }

    try {
      await deleteDoc(doc(db, "gelarPosts", id));
      setPosts(posts.filter((post) => post.id !== id));
      alert("Postingan berhasil dihapus.");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-10">
        <form onSubmit={handleSubmit} className="mb-6">
          <h2 className="text-2xl font-bold text-bluetiful mb-4">Tambah Postingan Baru</h2>
          <input
            type="text"
            placeholder="Judul Postingan"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-2 w-full px-4 py-2 border rounded"
            required
          />
          <textarea
            placeholder="Konten Postingan"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mb-2 w-full px-4 py-2 border rounded"
            required
          ></textarea>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            className="mb-2 w-full"
            accept="image/*"
            required
          />
          <button
            type="submit"
            className={`px-7 py-3 mt-2 shadow-md rounded-full ${uploading ? "bg-gray-500" : "bg-bluetiful text-white"} ${uploading ? "cursor-not-allowed" : "hover:bg-white hover:text-bluetiful font-semibold"}`}
            disabled={uploading}
          >
            {uploading ? "Mengunggah..." : "Tambah Post"}
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              content={post.content}
              imageUrl={post.imageUrl}
              createdAt={post.createdAt}
              likes={post.likes}
              onDelete={() => handleDelete(post.id)}
              isAdmin={isAdmin}
            />
          ))}
        </div>

        {isLoading && <Loader />} 
      </div>
    </div>
  );
}
