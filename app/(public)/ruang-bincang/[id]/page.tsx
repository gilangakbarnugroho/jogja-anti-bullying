"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";
import CommentForm from "../../../../components/CommentForm";
import CommentList from "../../../../components/CommentList";
import UpvoteDownvote from "../../../../components/UpvoteDownvote";
import BookmarkButton from "../../../../components/BookmarkButton";
import ReportButton from "../../../../components/ReportButton";
import Link from "next/link";
import Image from "next/image";

interface Post {
  id: string;
  content: string;
  user: string;
  timestamp: any;
  title: string;
  category: string;
  profilePicture?: string;
  name: string;
}

const DetailPost = () => {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [recommendations, setRecommendations] = useState<Post[]>([]);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const currentId = window.location.pathname.split("/").pop();
    if (currentId) setId(currentId);
  }, []);

  // Fetch detail post berdasarkan ID
  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const docRef = doc(db, "posts", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPost({
            id: docSnap.id,
            ...docSnap.data(),
          } as Post);
        } else {
          console.error("Post tidak ditemukan!");
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
        const querySnapshot = await getDocs(collection(db, "posts"));
        const postsData: Post[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];

        // Ambil 5 post sebagai rekomendasi, kecuali post yang sedang dibuka
        setRecommendations(postsData.filter((post) => post.id !== id).slice(0, 5));
      } catch (error) {
        console.error("Error fetching recommendations: ", error);
      }
    };

    fetchRecommendations();
  }, [id]);

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
    <div className="container mx-auto px-4 py-10 mt-20 flex">
      {/* Main Content */}
      <div className="w-full lg:w-3/4">
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          {/* Profil pengguna di samping username */}
          <Link href={`/profile/${post.user}`} className="flex items-center space-x-3 hover:opacity-75">
              {post.profilePicture ? (
                <Image
                  src={post.profilePicture}
                  alt={`${post.name}'s profile picture`}
                  width={30}
                  height={30}
                  className="rounded-full"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gray-200" />
              )}
              <div className="font-semibold text-bluetiful">{post.name || post.user}</div>
            </Link>
          <p className="text-xl text-gray-800 my-3">{post.content}</p>
          <p className="text-sm text-gray-500">Dibuat pada: {new Date(post.timestamp.seconds * 1000).toLocaleString()}</p>

          <div className="flex items-center space-x-4">
            {/* Upvote / Downvote */}
            <UpvoteDownvote postId={post.id} />

            {/* Bookmark */}
            <BookmarkButton postId={post.id} />

            {/* Report */}
            <ReportButton postId={post.id} contentType="post" />
          </div>

          {/* Form komentar */}
          <CommentForm postId={post.id} />

          {/* List Komentar */}
          <CommentList postId={post.id} />
        </div>
      </div>

      {/* Sidebar untuk Rekomendasi Post */}
      <div className="hidden lg:block w-1/4 ml-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Rekomendasi Lain</h2>
          <ul>
            {recommendations.map((rec) => (
              <li key={rec.id} className="mb-4">
                <Link href={`/ruang-bincang/${rec.id}`} className="hover:underline text-blue-500">
                  <div className="flex items-center">
                    <Image src="/default-thumbnail.jpg" alt={rec.title} width={50} height={50} className="rounded-md mr-4" />
                    <div>
                      <h3 className="font-bold">{rec.title}</h3>
                      <p className="text-sm text-gray-600">{rec.category}</p>
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
};

export default DetailPost;
