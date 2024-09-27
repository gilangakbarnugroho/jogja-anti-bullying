// pages/anti-bullying.js
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; 
import 'swiper/css/navigation'; 
import 'swiper/css/pagination';

export default function Duta() {
  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4">
        {/* Section 1: Duta Anti Bullying */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-4xl font-bold text-bluetiful">Duta Anti Bullying</h2>
              <p className="text-lg text-gray-600">
                Praktik social worker bagi siswa sebagai agen perubahan dalam mengkampanyekan budaya damai anti-bully.
              </p>
            </div>
            <button className="bg-bluetiful text-white px-4 py-2 rounded-full">
              Halaman Duta Anti-Bully
            </button>
          </div>

          <Swiper
            spaceBetween={20}
            slidesPerView={4}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
            className="mySwiper"
          >
            {/* Slide 1 */}
            <SwiperSlide>
              <div className="bg-white rounded-lg shadow-md overflow-hidden my-4">
                <img
                  src="/test/1.png"
                  alt="Duta 1"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">Lorem Ipsum</h3>
                  <p className="text-gray-500 text-sm">SMPN 1 Jogja</p>
                </div>
              </div>
            </SwiperSlide>

            {/* Slide 2 */}
            <SwiperSlide>
              <div className="bg-white rounded-lg shadow-md overflow-hidden my-4">
                <img
                  src="/test/2.png"
                  alt="Duta 2"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">Lorem Ipsum</h3>
                  <p className="text-gray-500 text-sm">SMPN 1 Jogja</p>
                </div>
              </div>
            </SwiperSlide>

            {/* Slide 3 */}
            <SwiperSlide>
              <div className="bg-white rounded-lg shadow-md overflow-hidden my-4">
                <img
                  src="/test/3.png"
                  alt="Duta 3"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">Lorem Ipsum</h3>
                  <p className="text-gray-500 text-sm">SMPN 1 Jogja</p>
                </div>
              </div>
            </SwiperSlide>

            {/* Slide 4 */}
            <SwiperSlide>
              <div className="bg-white rounded-lg shadow-md overflow-hidden my-4">
                <img
                  src="/test/1.png"
                  alt="Duta 4"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">Lorem Ipsum</h3>
                  <p className="text-gray-500 text-sm">SMPN 1 Jogja</p>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </section>

        {/* Section 2: Quotes Anti-Bully */}
        <section>
          <h2 className="text-4xl font-bold text-bluetiful mb-6">Quotes Anti-Bully</h2>
          <p className="text-lg text-gray-600 mb-6">
            Pitutur luhur atau petuah bijak berbasis kearifan lokal Budaya Jawa.
          </p>

          <Swiper
            spaceBetween={20}
            slidesPerView={3}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="mySwiper"
          >
            {/* Slide 1 */}
            <SwiperSlide>
              <div className="bg-blue-500 text-white rounded-lg shadow-md p-6">
                <p className="text-sm">Setiap orang berhak merasa aman tanpa perundungan.</p>
                <div className="mt-4 flex items-center">
                  <div className="rounded-full bg-white w-8 h-8 overflow-hidden">
                    <img
                      src="/test/1.png"
                      alt="User 1"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="ml-2">Username</p>
                  <div className="ml-auto text-xs">2.3k Likes</div>
                </div>
              </div>
            </SwiperSlide>

            {/* Slide 2 */}
            <SwiperSlide>
              <div className="bg-blue-500 text-white rounded-lg shadow-md p-6">
                <p className="text-sm">Setiap orang berhak merasa aman tanpa perundungan.</p>
                <div className="mt-4 flex items-center">
                  <div className="rounded-full bg-white w-8 h-8 overflow-hidden">
                    <img
                      src="/test/2.png"
                      alt="User 2"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="ml-2">Username</p>
                  <div className="ml-auto text-xs">2.3k Likes</div>
                </div>
              </div>
            </SwiperSlide>

            {/* Slide 3 */}
            <SwiperSlide>
              <div className="bg-blue-500 text-white rounded-lg shadow-md p-6">
                <p className="text-sm">Setiap orang berhak merasa aman tanpa perundungan.</p>
                <div className="mt-4 flex items-center">
                  <div className="rounded-full bg-white w-8 h-8 overflow-hidden">
                    <img
                      src="/test/3.png"
                      alt="User 3"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="ml-2">Username</p>
                  <div className="ml-auto text-xs">2.3k Likes</div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </section>
      </div>
    </div>
  );
}