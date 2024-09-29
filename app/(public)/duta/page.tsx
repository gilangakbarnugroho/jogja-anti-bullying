"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { db } from "../../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface UserProfile {
  id: string;
  name: string;
  profilePicture: string;
}

export default function Duta() {
  const [users, setUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const userData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as UserProfile[];
      setUsers(userData);
    };

    fetchUsers();
  }, []);

  const getValidImageUrl = (url: string | undefined) => {
    if (!url) return "/default-profile.png"; // Default image jika tidak ada URL
    return url.startsWith("http://") || url.startsWith("https://") ? url : "/default-profile.png";
  };

  return (
    <div className="bg-bluetiful min-h-screen py-10">
      <div className="container mx-auto px-4 mt-20">
        {/* Section 1: Siswa Berprestasi */}
        <section className="mb-16">
          <div className="text-center text-white mb-8">
            <h2 className="text-4xl font-bold mb-4">Siswa Berprestasi</h2>
            <p className="text-lg mb-4">
              Berikut adalah profil dari siswa yang berprestasi dan berperan aktif dalam kegiatan anti-bullying.
            </p>
          </div>

          {/* Swiper untuk menampilkan profil Siswa Berprestasi */}
          <Swiper
            spaceBetween={30}
            slidesPerView={3}
            pagination={{ clickable: true }}
            className="rounded-xl overflow-hidden shadow-lg"
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {users.map((user) => (
              <SwiperSlide key={user.id}>
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="relative w-40 h-40 mx-auto mb-4">
                    <Image
                      src={getValidImageUrl(user.profilePicture)}
                      alt={`Profile ${user.name}`}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-bluetiful text-xl mb-4">{user.name}</h3>
                  <Link href={`/profile/${user.id}`}>
                    <button className="btn-bluetiful transition">
                      Lihat Profil
                    </button>
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* Section 2: Komunitas */}
        {/* <section className="mb-16">
          <div className="text-center text-white mb-8">
            <h2 className="text-4xl font-bold mb-4">Komunitas Anti Bullying</h2>
            <p className="text-lg mb-4">Profil dari komunitas yang berperan aktif dalam gerakan anti-bullying.</p>
          </div>

          <Swiper
            spaceBetween={30}
            slidesPerView={3}
            pagination={{ clickable: true }}
            className="rounded-xl overflow-hidden shadow-lg"
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {users.slice(0, 6).map((user) => (
              <SwiperSlide key={user.id}>
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="relative w-40 h-40 mx-auto mb-4">
                    <Image
                      src={getValidImageUrl(user.profilePicture)}
                      alt={`Profile ${user.name}`}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-xl mb-2">{user.name}</h3>
                  <Link href={`/profile/${user.id}`}>
                    <button className="bg-bluetiful text-white px-4 py-2 rounded-full hover:bg-blue-800 transition">
                      Lihat Profil
                    </button>
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section> */}

      </div>
    </div>
  );
}
