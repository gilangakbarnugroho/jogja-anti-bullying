// pages/berprestasi.js
import React from 'react';

export default function Berprestasi() {
  return (
    <div className="bg-bluetiful min-h-screen py-10">
      <div className="container mx-auto px-4 mt-20">
        {/* Section 1: Siswa Berprestasi */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row items-center justify-between bg-bluetiful p-6 rounded-lg shadow-lg">
            <div className="text-white md:w-1/3 mb-6 md:mb-0">
              <h2 className="text-4xl font-bold mb-4">Siswa Berprestasi</h2>
              <p className="text-lg mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at justo nibh. 
              </p>
              <button className="px-4 py-2 bg-white text-blue-500 rounded-full">
                Explore
              </button>
            </div>
            <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Post 1 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src="/test/1.png"
                  alt="Siswa Berprestasi 1"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">Lorem Ipsum</h3>
                  <p className="text-gray-400 text-xs">2023</p>
                </div>
              </div>
              {/* Post 2 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src="/test/2.png"
                  alt="Siswa Berprestasi 2"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">Lorem Ipsum</h3>
                  <p className="text-gray-400 text-xs">2023</p>
                </div>
              </div>
              {/* Post 3 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src="/test/3.png"
                  alt="Siswa Berprestasi 3"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">Lorem Ipsum</h3>
                  <p className="text-gray-400 text-xs">2023</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Komunitas */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row items-center justify-between bg-bluetiful p-6 rounded-lg shadow-lg">
            <div className="text-white md:w-1/3 mb-6 md:mb-0">
              <h2 className="text-4xl font-bold mb-4">Komunitas</h2>
              <p className="text-lg mb-4">
                Komunitas Anti Bullying
              </p>
              <button className="px-4 py-2 bg-white text-blue-500 rounded-full">
                Explore
              </button>
            </div>
            <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Post 1 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src="/test/1.png"
                  alt="Komunitas Anti Bullying 1"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">Lorem Ipsum</h3>
                  <p className="text-gray-400 text-xs">2023</p>
                </div>
              </div>
              {/* Post 2 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src="/test/2.png"
                  alt="Komunitas Anti Bullying 2"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">Lorem Ipsum</h3>
                  <p className="text-gray-400 text-xs">2023</p>
                </div>
              </div>
              {/* Post 3 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src="/test/3.png"
                  alt="Komunitas Anti Bullying 3"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">Lorem Ipsum</h3>
                  <p className="text-gray-400 text-xs">2023</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Kisah Inspiratif */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row items-center justify-between bg-bluetiful p-6 rounded-lg shadow-lg">
            <div className="text-white md:w-1/3 mb-6 md:mb-0">
              <h2 className="text-4xl font-bold mb-4">Kisah Inspiratif</h2>
              <p className="text-lg mb-4">
                Kisah Inspiratif
              </p>
              <button className="px-4 py-2 bg-white text-blue-500 rounded-full">
                Explore
              </button>
            </div>
            <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Post 1 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src="/test/1.png"
                  alt="Kisah Inspiratif 1"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">Lorem Ipsum</h3>
                  <p className="text-gray-400 text-xs">2023</p>
                </div>
              </div>
              {/* Post 2 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src="/test/2.png"
                  alt="Kisah Inspiratif 2"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">Lorem Ipsum</h3>
                  <p className="text-gray-400 text-xs">2023</p>
                </div>
              </div>
              {/* Post 3 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src="/test/3.png"
                  alt="Kisah Inspiratif 3"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">Lorem Ipsum</h3>
                  <p className="text-gray-400 text-xs">2023</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
