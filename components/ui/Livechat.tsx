"use client";

import { useState } from "react";

const Livechat = () => {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  const handleIconClick = () => {
    setIsChatOpen((prev) => !prev);
  };

  return (
    <div className="fixed bottom-16 md:bottom-8 right-8 z-50">
      {/* Chat Icon */}
      <div
        className="flex justify-center items-center bg-bluetiful text-white rounded-full shadow-lg w-10 h-10- md:w-14 md:h-14 cursor-pointer hover:bg-white hover:text-bluetiful transition duration-150 ease-in-out"
        onClick={handleIconClick}
        aria-label="Open Chat"
      >
        <svg
          className="w-10 h-10"
          viewBox="8 10 50 50"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M21.0698 24.406C22.2348 22.7963 23.7054 21.4319 25.3978 20.3905C28.8156 18.2874 32.9288 17.6282 36.8327 18.5579C40.7365 19.4875 44.1112 21.9299 46.2142 25.3477C48.3173 28.7655 48.9765 32.8787 48.0469 36.7826C47.1172 40.6864 44.6749 44.0611 41.2571 46.1642L29.6589 53.3009C29.4104 53.4686 29.1176 53.5587 28.8177 53.5598C28.5179 53.5608 28.2245 53.4728 27.9748 53.3067C27.7317 53.1328 27.5455 52.8907 27.4399 52.6111C27.3342 52.3315 27.3137 52.0268 27.3811 51.7356L28.3725 47.5723C25.0665 46.4416 22.2604 44.1897 20.4406 41.207C18.3375 37.7892 17.6783 33.6759 18.6079 29.7721C19.0683 27.8391 19.9048 26.0157 21.0698 24.406ZM30.262 42.367C31.7751 43.8802 34.6236 43.8802 35.5579 43.8802C36.4922 43.8802 39.3407 43.8802 40.8538 42.367L42.3669 40.8539L28.8177 40.8539L30.262 42.367Z"
          />
        </svg>
      </div>

      {/* Chat Box */}
      {isChatOpen && (
        <div className="absolute bottom-20 right-0 bg-white shadow-lg rounded-lg w-72 p-4 border">
          <h2 className="text-lg font-bold text-bluetiful mb-2">
            Selamat Datang!
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Halo! Ada yang bisa kami bantu?
          </p>
          <div className="space-y-2">
            <a
              href="https://api.whatsapp.com/send?phone=62888283123&text=Selamat%20pagi/siang/sore%2C%20tim%20Jogja%20Anti%20Bullying!"
              className="block px-4 py-2 bg-bluetiful text-white rounded-lg text-center hover:bg-bluetiful-500 transition"
            >
              Hubungi Admin JAB
            </a>
            {/* <a
              href="#"
              className="block px-4 py-2 bg-bluetiful text-white rounded-lg text-center hover:bg-bluetiful-800 transition"
            >
              Hubungi Admin Sekolah
            </a> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Livechat;
