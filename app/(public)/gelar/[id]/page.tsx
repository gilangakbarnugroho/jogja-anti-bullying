"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc, updateDoc, addDoc, query, limit, collection, where, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";
import Link from "next/link";
import Image from "next/image";
import { AiOutlineLike, AiFillLike, AiOutlineExclamationCircle } from "react-icons/ai";
import Loader from "../../../../components/ui/Loader";

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  likes: number;
}

const DetailGelar = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id || "";

  const [post, setPost] = useState<Post | null>(null);
  const [hasLiked, setHasLiked] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch detail post berdasarkan ID
  useEffect(() => {
    if (!id || id === "") {
      router.push("/gelar");
      return;
    }

    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const docRef = doc(db, "gelarPosts", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const postData = docSnap.data() as Post;
          setPost({ ...postData, id });
        } else {
          console.error("Dokumen tidak ditemukan!");
          router.push("/gelar");
        }
      } catch (error) {
        console.error("Error fetching post detail:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, router]);

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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10 mt-20">
        <Loader />
      </div>
    );
  }

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
    <div className="container mx-auto px-4 py-10 mt-20">
      {/* Main Content */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl text-bluetiful font-bold mb-4">{post.title}</h1>
        <p className="text-sm text-gray-500 mb-4">Dibuat pada: {post.createdAt}</p>
        <Image src={post.imageUrl} alt="Post Image" width={800} height={450} className="w-full object-cover rounded-md mb-4" />
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
  );
};

export default DetailGelar;
