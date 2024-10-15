"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";
import Image from "next/image";
import Loader from "../../../../components/ui/Loader";
import useSWR from "swr";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: { seconds: number };
  author: string;
  likes: number;
}

// Fungsi untuk memformat timestamp
const formatTimestamp = (timestamp: { seconds: number }) => {
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};

// Fungsi untuk memisahkan konten per paragraf
const formatContent = (content: string) => {
  return content.split("\n").map((paragraph, index) => (
    <p key={index} className="mb-4">
      {paragraph}
    </p>
  ));
};

// Fetcher function untuk SWR
const fetchPostDetail = async (id: string) => {
  const docRef = doc(db, "dutaPosts", id); // Ganti koleksi menjadi dutaPosts
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { ...docSnap.data(), id } as Post;
  } else {
    throw new Error("Post not found");
  }
};

const fetchApprovedPosts = async () => {
  const approvedPostsQuery = query(
    collection(db, "dutaPosts"), // Ganti koleksi menjadi dutaPosts
    where("approved", "==", true)
  );
  const querySnapshot = await getDocs(approvedPostsQuery);
  const approvedPosts = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Post[];
  return approvedPosts;
};

const DetailDuta = () => { // Ubah nama komponen menjadi DetailDuta
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id || "";

  const { data: post, error, isLoading } = useSWR(
    id ? `dutaPost/${id}` : null,
    () => fetchPostDetail(id),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Cache data selama 1 menit
    }
  );

  const [recommendedPosts, setRecommendedPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const posts = await fetchApprovedPosts();
      const filteredPosts = posts.filter((p) => p.id !== id); // Exclude current post
      setRecommendedPosts(filteredPosts);
    };
    fetchRecommendations();
  }, [id]);

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
    <div className="container mx-auto px-4 py-10 mt-20 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Konten utama */}
      <div className="lg:col-span-2">
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h1 className="text-3xl text-bluetiful font-bold mb-4">{post.title}</h1>
          {/* Tampilkan informasi author */}
          <p className="text-sm text-gray-500 mb-2">Author: {post.author}</p>
          <p className="text-sm text-gray-500 mb-4">{formatTimestamp(post.createdAt)}</p>
          <Image
            src={post.imageUrl}
            alt="Post Image"
            width={800}
            height={450}
            className="w-full object-cover rounded-md mb-4"
            loading="lazy"
          />
          {/* Format konten menjadi paragraf berdasarkan enter/spasi */}
          <div className="text-lg text-gray-800">{formatContent(post.content)}</div>
        </div>
      </div>

      {/* Side Panel untuk rekomendasi */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-bluetiful mb-4">Artikel Lainnya</h2>
        {recommendedPosts.length > 0 ? (
          <ul className="space-y-4">
            {recommendedPosts.map((recommendedPost) => (
              <li key={recommendedPost.id}>
                <Link href={`/duta/${recommendedPost.id}`}>
                  <div className="hover:bg-gray-100 p-2 rounded-md cursor-pointer">
                    <h3 className="text-md font-semibold text-bluetiful">{recommendedPost.title}</h3>
                    <p className="text-sm text-gray-500">
                      {formatTimestamp(recommendedPost.createdAt)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Tidak ada artikel yang direkomendasikan.</p>
        )}
      </div>
    </div>
  );
};

export default DetailDuta;
