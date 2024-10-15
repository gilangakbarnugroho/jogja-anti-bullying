"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import Image from "next/image";
import PostCard from "../../../components/PostCardDuta";
import Modal from "../../../components/ui/Modal";
import DutaPostForm from "../../../components/DutaPostForm"; // Ganti nama jika diperlukan
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; 

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl: string;
  createdAt: { seconds: number };
  likes: number;
  approved: boolean;
}

export default function DutaPelajar() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Fetch posts dengan filtering approved
  const fetchPosts = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "dutaPosts")); 
      const postsData: Post[] = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((post) => post.approved === true) as Post[];
      setPosts(postsData);
    } catch (error) {
      console.error("Error fetching posts: ", error);
      alert("Error fetching posts. Periksa pengaturan Firestore.");
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const optimizedPosts = useMemo(() => posts, [posts]);

  const toggleModal = () => {
    setShowModal((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col bg-bluetiful">
      {/* Gambar Batik - Bagian Atas */}
      <div className="w-full mt-20">
        <Image src="/batik.png" width={1920} height={720} alt="batik" className="w-full" />
      </div>

      {/* Konten di bawah gambar batik */}
      <div className="flex flex-col md:flex-row w-full">
        {/* Header Section - di kiri */}
        <div className="w-full md:w-1/3 bg-bluetiful text-white pt-10 text-left p-6">
          <div className="flex justify-center items-center">
            <Image
              src="/gelar-pelajar.png" // Ganti jika ada gambar untuk DutaPelajar
              width={400}
              height={400}
              alt="Duta Pelajar"
              className="w-72 h-80"
              priority
            />
          </div>
          <div className="flex flex-col items-start justify-start mt-4 ml-8 xl:ml-24">
            <h1 className="text-4xl font-bold">Duta Pelajar</h1>
            <p className="text-lg mt-2">
              Praktik social worker bagi siswa sebagai agen perubahan dalam mengkampanyekan budaya damai anti-bully.
            </p>

            <button
              className="mt-6 px-6 py-3 bg-white text-bluetiful font-semibold rounded-full shadow-lg hover:bg-bluetiful hover:text-white transition"
              onClick={toggleModal}
            >
              Unggah Kegiatan Duta Pelajar
            </button>
          </div>
        </div>

        {/* PostCard Section - di kanan dengan swiper */}
        <div className="w-full md:w-2/3 p-6">
          <Swiper
            spaceBetween={20}
            slidesPerView={1} // Default 1 untuk mobile
            breakpoints={{
              640: { // Ketika layar lebih besar dari 640px (tablet)
                slidesPerView: 1,
              },
              768: { // Ketika layar lebih besar dari 768px (desktop kecil)
                slidesPerView: 2,
              },
              1024: { // Ketika layar lebih besar dari 1024px (desktop)
                slidesPerView: 3,
              },
            }}
            pagination={{ clickable: true }}
          >
            {optimizedPosts.map((post) => (
              <SwiperSlide key={post.id}>
                <PostCard
                  id={post.id}
                  title={post.title}
                  content={post.content}
                  category={post.category}
                  imageUrl={post.imageUrl}
                  createdAt={post.createdAt?.seconds || Date.now() / 1000}
                  likes={post.likes}
                  isAdmin={false}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Modal untuk form upload DutaPost */}
      {showModal && (
        <Modal onClose={toggleModal}>
          <DutaPostForm onClose={toggleModal} />
        </Modal>
      )}
    </div>
  );
}
