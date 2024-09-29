"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Swiper as SwiperComponent, SwiperSlide } from "swiper/react";
import Swiper from "swiper";
import "swiper/css";

// Data quotes
const quotes = [
  {
    id: 1,
    image: "/quotes/quote1.jpg",
    caption: "Unlock Your Potential",
  },
  {
    id: 2,
    image: "/quotes/quote2.jpg",
    caption: "Believe in Yourself",
  },
  {
    id: 3,
    image: "/quotes/quote3.jpg",
    caption: "You Become What You Believe",
  },
  {
    id: 4,
    image: "/quotes/quote4.jpg",
    caption: "Stay Positive, Work Hard, Make it Happen",
  },
  {
    id: 5,
    image: "/quotes/quote5.jpg",
    caption: "Dream Big and Dare to Fail",
  },
];

// Fungsi untuk mengacak array
const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Tukar elemen
  }
  return array;
};

const Quotes = () => {
  const [shuffledQuotes, setShuffledQuotes] = useState(quotes);
  const mainSwiperRef = useRef<Swiper | null>(null); // Referensi untuk slider utama
  const gallerySwiperRef = useRef<Swiper | null>(null); // Referensi untuk galeri thumbnail

  useEffect(() => {
    setShuffledQuotes(shuffleArray([...quotes]));
  }, []);

  return (
    <div className="container min-h-screen mx-auto p-4 mt-20">
      <h1 className="text-3xl font-bold mb-6 text-center text-bluetiful">Quotes Jogja Anti Bully</h1>

      {/* Slider Utama */}
      <SwiperComponent
        className="mainSwiper rounded-xl shadow-lg mb-8"
        spaceBetween={10}
        slidesPerView={1}
        onSwiper={(swiper) => {
          mainSwiperRef.current = swiper; // Inisialisasi referensi untuk slider utama
        }}
      >
        {shuffledQuotes.map((quote, index) => (
          <SwiperSlide key={quote.id}>
            <div className="relative w-full h-[300px] sm:h-[500px]">
              <Image
                src={quote.image}
                alt={quote.caption}
                fill
                className="rounded-xl object-cover"
                priority
              />
              <p className="absolute bottom-4 left-4 text-white text-xl font-semibold bg-black bg-opacity-50 px-3 py-1 rounded">
                {quote.caption}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </SwiperComponent>

      {/* Galeri Thumbnail */}
      <div className="gallerySwiper grid grid-cols-4 gap-4 mt-8">
        {shuffledQuotes.map((quote, index) => (
          <div
            key={quote.id}
            className="relative w-full h-24 sm:h-32 cursor-pointer"
            onClick={() => {
              if (mainSwiperRef.current) {
                mainSwiperRef.current.slideTo(index); // Pindahkan slider utama saat thumbnail diklik
              }
            }}
          >
            <Image
              src={quote.image}
              alt={quote.caption}
              fill
              className="rounded-lg object-cover"
              priority
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Quotes;
