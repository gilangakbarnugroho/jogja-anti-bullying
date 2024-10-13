"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";
import CommentForm from "../../../../components/CommentForm";
import CommentList from "../../../../components/CommentList";
import UpvoteDownvote from "../../../../components/UpvoteDownvote";
import BookmarkButton from "../../../../components/BookmarkButton";
import ReportButton from "../../../../components/ReportButton";
import Link from "next/link";
import Image from "next/image";
import Loader from "../../../../components/ui/Loader";

interface Post {
  id: string;
  content: string;
  user: string;
  timestamp: any;
  title: string;
  category: string;
  profilePicture?: string;
  name: string;
  isAnonymous: boolean; // Tambahkan field isAnonymous
}

const DetailPost = () => {
  const router = useRouter();
  const params = useParams();

  // Validasi dan ekstraksi `id` dari `params`
  const id = typeof params?.id === "string" ? params.id : "";

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch detail post berdasarkan ID
  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const docRef = doc(db, "posts", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPost({
            id: docSnap.id,
            ...docSnap.data(),
          } as Post);
        } else {
          console.error("Post tidak ditemukan!");
          router.push("/ruang-bincang");
        }
      } catch (error) {
        console.error("Error fetching post detail: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, router]);

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
    <div className="container mx-auto px-4 py-10 mt-20 flex">
      {/* Main Content */}
      <div className="w-full lg:w-4/4">
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          {/* Profil pengguna di samping username */}
          {post.isAnonymous ? (
            <div className="flex items-center space-x-3">
              {/* Tampilan anonim */}
              <div className="w-7 h-7 rounded-full bg-gray-400" />
              <div className="font-semibold text-gray-600">Anonim</div>
            </div>
          ) : (
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
          )}

          <p className="text-xl text-gray-800 my-3">{post.content}</p>

          {/* Tampilkan gambar atau video jika ada */}
          {post.fileURL && post.fileType?.startsWith("image/") && (
                <Image
                    src={post.fileURL}
                    alt="Post Image"
                    width={500}
                    height={300}
                    className="rounded-lg mb-4"
                />
                )}
                {post.fileURL && post.fileType?.startsWith("video/") && (
                    <video controls className="w-full max-w-lg mt-4 rounded-lg">
                    <source src={post.fileURL} type={post.fileType} />
                    Browser Anda tidak mendukung pemutar video.
                </video>
                )}

          <p className="text-sm text-gray-500">
            Dibuat pada: {new Date(post.timestamp.seconds * 1000).toLocaleString("id-ID")}
          </p>

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
    </div>
  );
};

export default DetailPost;
