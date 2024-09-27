import React, { useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; 
import 'swiper/css/navigation'; 
import 'swiper/css/pagination';
import Image from "next/image";

export default function Gelar() {
  return (
    <div className="bg-bluetiful py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between bg-bluetiful p-6 rounded-lg">
          {/* Bagian Kiri: Deskripsi dan Tombol */}
          <div className="text-white md:w-1/3 mb-6 md:mb-0">
            <h2 className="text-4xl font-bold mb-4">Gelar Pelajar</h2>
            <p className="text-lg mb-4">
              Wahana ekspresi potensi berbasis Multiple intelligence untuk
              merealisasikan minat, bakat, dan kreativitas pelajar.
            </p>
            <button className="px-4 py-2 bg-white text-blue-500 rounded-full">
              Halaman Gelar Pelajar
            </button>
          </div>

          {/* Bagian Kanan: Slider */}
          <div className="md:w-2/3">
            <Swiper
              spaceBetween={20}
              slidesPerView={2}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
              }}
              className="mySwiper"
            >
              {/* Slide 1 */}
              <SwiperSlide>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img
                    src="/test/1.png"
                    alt="Post 1"
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                        NEW POST
                      </span>
                      <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">
                        ARTICLE
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">Lorem Ipsum</h3>
                    <p className="text-gray-500 text-sm">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at justo nibh.
                    </p>
                    <p className="text-gray-400 text-xs mt-4">03/09/2023</p>
                  </div>
                </div>
              </SwiperSlide>

              {/* Slide 2 */}
              <SwiperSlide>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img
                    src="/test/2.png"
                    alt="Post 2"
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                        NEW POST
                      </span>
                      <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">
                        ARTICLE
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">Lorem Ipsum</h3>
                    <p className="text-gray-500 text-sm">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at justo nibh.
                    </p>
                    <p className="text-gray-400 text-xs mt-4">03/09/2023</p>
                  </div>
                </div>
              </SwiperSlide>

              {/* Slide 3 */}
              <SwiperSlide>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img
                    src="/test/3.png"
                    alt="Post 3"
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                        NEW POST
                      </span>
                      <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">
                        ARTICLE
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">Lorem Ipsum</h3>
                    <p className="text-gray-500 text-sm">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at justo nibh.
                    </p>
                    <p className="text-gray-400 text-xs mt-4">03/09/2023</p>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
}