import Image from 'next/image';
import React from 'react';

export default function GelarPelajar() {
  return (
    <div className="bg-blue-50 min-h-screen">
      <header className="bg-bluetiful text-white pt-10 text-center">
        <div className="flex justify-center items-center">
            <Image
              src="/gelar-pelajar.png"
              width={720}
              height={720}
              alt="Gelar Pelajar"
              className="w-72 h-72"
            />
        </div>
        <h1 className="text-4xl font-bold mt-4">Gelar Pelajar</h1>
        <p className="text-lg mt-2">
          Wahana ekspresi potensi berbasis Multiple Intelligence untuk
          merealisasikan minat, bakat, dan kreativitas pelajar.
        </p>
        <div className='mt-8 min-w-screen'>
            <Image 
            src="/batik.png"
            width={1920}
            height={160}
            alt='batik'
            />
        </div>
      </header>

      <div className="container mx-auto px-4 py-10">
        <div className="flex justify-center space-x-4 mb-6">
          <button className="px-4 py-2 bg-bluetiful text-white rounded-full focus:outline-none">
            Semua
          </button>
          <button className="px-4 py-2 bg-white text-blue-500 border border-blue-500 rounded-full focus:outline-none">
            Terbaru
          </button>
          <button className="px-4 py-2 bg-white text-blue-500 border border-blue-500 rounded-full focus:outline-none">
            Populer
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/** Card 1 **/}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src="/test/1.png"
              alt="Post Image"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="space-x-2 mb-2">
                <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                  NEW POST
                </span>
                <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">
                  ARTICLE
                </span>
              </div>
              <h2 className="font-bold text-xl mb-2">Judul Post</h2>
              <p className="text-gray-600 text-sm mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
                at justo nibh.
              </p>
              <p className="text-gray-400 text-xs">03/09/2023</p>
            </div>
          </div>

          {/** Card 2 **/}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src="/test/2.png"
              alt="Post Image"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="mb-2 space-x-2">
                <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                  NEW POST
                </span>
                <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">
                  ARTICLE
                </span>
              </div>
              <h2 className="font-bold text-xl mb-2">Judul Post</h2>
              <p className="text-gray-600 text-sm mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
                at justo nibh.
              </p>
              <p className="text-gray-400 text-xs">03/09/2023</p>
            </div>
          </div>

          {/** Card 3 **/}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src="/test/3.png"
              alt="Post Image"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="space-x-2 mb-2">
                <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                  NEW POST
                </span>
                <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">
                  ARTICLE
                </span>
              </div>
              <h2 className="font-bold text-xl mb-2">Judul Post</h2>
              <p className="text-gray-600 text-sm mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
                at justo nibh.
              </p>
              <p className="text-gray-400 text-xs">03/09/2023</p>
            </div>
          </div>

          {/** Duplicate other cards as needed **/}
        </div>
      </div>
    </div>
  );
}
