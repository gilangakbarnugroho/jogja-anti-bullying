"use client"

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Gunakan 'next/navigation' di Next.js 13
import { doc, getDoc, collection, getDocs, updateDoc, addDoc } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig"; // Firestore Configuration
import Link from "next/link";
import Image from "next/image";
import { AiOutlineLike, AiFillLike, AiOutlineExclamationCircle } from "react-icons/ai"; // Import icon untuk like dan report

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  likes: number;
  views: number;
}

export default function DetailPost() {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [recommendations, setRecommendations] = useState<Post[]>([]);
  const [id, setId] = useState<string | null>(null);
  const [hasLiked, setHasLiked] = useState(false); 
  const [isReported, setIsReported] = useState(false);

  useEffect(() => {
    if (!router) return;
    const currentId = new URL(window.location.href).pathname.split("/").pop();
    if (currentId) {
      setId(currentId);
    }
  }, [router]);

  // Fetch detail post berdasarkan ID setelah ID tersedia
  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      try {
        const docRef = doc(db, "gelarPosts", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const postData = docSnap.data() as Post;
          setPost({
            ...postData,
            id,
          });
        } else {
          console.log("Dokumen tidak ditemukan");
        }
      } catch (error) {
        console.error("Error fetching post detail: ", error);
      }
    };
    fetchPost();
  }, [id]);

  // Fetch rekomendasi post setelah ID tersedia
  useEffect(() => {
    if (!id) return;
    const fetchRecommendations = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "gelarPosts"));
        const postsData: Post[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];
        setRecommendations(postsData.filter((post) => post.id !== id).slice(0, 5)); 
      } catch (error) {
        console.error("Error fetching recommendations: ", error);
      }
    };

    fetchRecommendations();
  }, [id]);

  // Fungsi untuk menambah Like
  const handleLike = async () => {
    if (!id || hasLiked || !post) return; 
    try {
      const postRef = doc(db, "gelarPosts", id);
      await updateDoc(postRef, { likes: post.likes + 1 });
      setPost({ ...post, likes: post.likes + 1 });
      setHasLiked(true); 
    } catch (error) {
      console.error("Error liking the post: ", error);
    }
  };

  // Fungsi untuk melaporkan artikel
  const handleReport = async () => {
    if (!id || isReported || !post) return;
    try {
      await addDoc(collection(db, "reportedPosts"), {
        postId: id,
        reportedAt: new Date().toLocaleString(),
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
      });
      setIsReported(true); 
      alert("Artikel telah dilaporkan ke admin.");
    } catch (error) {
      console.error("Error reporting the post: ", error);
    }
  };

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-10 mt-20">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          Postingan tidak ditemukan atau terjadi kesalahan.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 flex mt-20">
      {/* Main Content */}
      <div className="w-full lg:w-3/4">
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h1 className="text-3xl text-bluetiful font-bold mb-4">{post.title}</h1>
          <p className="text-sm text-gray-500 mb-4">Dibuat pada: {post.createdAt}</p>
          <img src={post.imageUrl} alt="Post Image" className="w-full h-96 object-cover rounded-md mb-4" />
          <p className="text-lg text-gray-800">{post.content}</p>
          
          {/* Tombol Like dan Report */}
          <div className="flex items-center space-x-4 mt-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 ${hasLiked ? "text-blue-500" : "text-gray-500"} hover:text-blue-600`}
              disabled={hasLiked} 
            >
              {hasLiked ? <AiFillLike size={24} /> : <AiOutlineLike size={24} />}
              <span>{post.likes}</span>
            </button>
            <button
              onClick={handleReport}
              className={`flex items-center space-x-1 text-red-500 hover:text-red-700`}
              disabled={isReported} 
            >
              <AiOutlineExclamationCircle size={24} />
              <span>Laporkan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar untuk Rekomendasi Post */}
      <div className="hidden md:block md:w-1/4 ml-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl text-gray-800 font-bold mb-4">Rekomendasi Artikel Lain</h2>
          <ul>
            {recommendations.map((rec) => (
              <li key={rec.id} className="mb-4">
                <Link href={`/gelar/${rec.id}`} className="hover:underline text-blue-500">
                  <div className="flex items-center">
                    <img src={rec.imageUrl} alt={rec.title} className="w-16 h-16 object-cover rounded-md mr-4" />
                    <div>
                      <h3 className="font-bold">{rec.title}</h3>
                      <p className="text-sm text-gray-600">{rec.createdAt}</p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
