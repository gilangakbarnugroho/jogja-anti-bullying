"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";
import Image from "next/image";
import { AiOutlineLike, AiFillLike, AiOutlineExclamationCircle } from "react-icons/ai";
import Loader from "../../../../components/ui/Loader";
import useSWR from 'swr'; // Tambahkan SWR untuk caching

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  likes: number;
}

// Fetcher function for SWR
const fetchPostDetail = async (id: string) => {
  const docRef = doc(db, "gelarPosts", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { ...docSnap.data(), id } as Post;
  } else {
    throw new Error("Post not found");
  }
};

const DetailGelar = () => {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id || "";

  const { data: post, error, isLoading } = useSWR(id ? `gelarPost/${id}` : null, () => fetchPostDetail(id), {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // Cache data selama 1 menit
  });

  useEffect(() => {
    if (!id) {
      router.push("/gelar");
    }
  }, [id, router]);

  if (isLoading) {
    return <Loader />;
  }

  if (error || !post) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg">
        Postingan tidak ditemukan atau terjadi kesalahan.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 mt-20">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl text-bluetiful font-bold mb-4">{post.title}</h1>
        <p className="text-sm text-gray-500 mb-4">Dibuat pada: {post.createdAt}</p>
        <Image
          src={post.imageUrl}
          alt="Post Image"
          width={800}
          height={450}
          className="w-full object-cover rounded-md mb-4"
          loading="lazy" 
        />
        <p className="text-lg text-gray-800">{post.content}</p>
      </div>
    </div>
  );
};

export default DetailGelar;
