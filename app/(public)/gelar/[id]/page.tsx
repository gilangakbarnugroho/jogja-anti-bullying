"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc, updateDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";
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
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id || "";

  const [post, setPost] = useState<Post | null>(null);
  const [hasLiked, setHasLiked] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
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

  return (
    <div className="container mx-auto px-4 py-10 mt-20">
      {isLoading ? (
        <Loader />
      ) : post ? (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h1 className="text-3xl text-bluetiful font-bold mb-4">{post.title}</h1>
          <p className="text-sm text-gray-500 mb-4">Dibuat pada: {post.createdAt}</p>
          <Image src={post.imageUrl} alt="Post Image" width={800} height={450} className="w-full object-cover rounded-md mb-4" priority />
          <p className="text-lg text-gray-800">{post.content}</p>
        </div>
      ) : (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          Postingan tidak ditemukan atau terjadi kesalahan.
        </div>
      )}
    </div>
  );
};

export default DetailGelar;
