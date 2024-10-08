"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, getDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../../../firebase/firebaseConfig";
import Image from "next/image";
import PostCard from "../../../components/PostCard"; // Import PostCard

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  likes: number;
  views: number;
}

export default function GelarPelajar() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Periksa apakah pengguna adalah admin
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

  // Ambil data dari Firestore dengan caching menggunakan useMemo
  const fetchPosts = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "gelarPosts"));
      const postsData: Post[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];
      setPosts(postsData);
    } catch (error) {
      console.error("Error fetching posts: ", error);
      alert("Error fetching posts. Periksa pengaturan Firestore.");
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Fungsi untuk menghapus posting jika isAdmin
  const handleDelete = async (id: string) => {
    if (!isAdmin) {
      alert("Anda tidak memiliki izin untuk menghapus postingan.");
      return;
    }
    try {
      await deleteDoc(doc(db, "gelarPosts", id));
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
      alert("Postingan berhasil dihapus.");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="bg-bluetiful text-white pt-10 text-center">
        <div className="flex justify-center items-center">
          <Image src="/gelar-pelajar.png" width={720} height={720} alt="Gelar Pelajar" className="w-72 h-80" priority />
        </div>
        <h1 className="text-4xl font-bold mt-4">Gelar Pelajar</h1>
        <p className="text-lg mt-2">Wahana ekspresi potensi berbasis Multiple Intelligence untuk merealisasikan minat, bakat, dan kreativitas pelajar.</p>
      </header>

      <div className="container mx-auto px-4 py-10">
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
      </div>
    </div>
  );
}
