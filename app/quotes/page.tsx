// pages/quotes.js
import React from 'react';

export default function Quotes() {
  return (
    <div className="bg-blue-50 min-h-screen py-10">
      <div className="container mx-auto px-4 mt-14">
        {/* Bagian Input Post */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center">
            <img
              src="/test/1.png"
              alt="User Avatar"
              className="w-10 h-10 rounded-full mr-4"
            />
            <input
              type="text"
              placeholder="Berikan cerita motivasi atau quotes anti-bully mu!"
              className="w-full p-2 bg-gray-100 rounded-lg border border-gray-200 focus:outline-none"
            />
          </div>

          {/* Toolbar untuk Attachment */}
          <div className="flex justify-between mt-4">
            <div className="flex items-center space-x-4 text-gray-400">
              <button className="hover:text-blue-500">
                <i className="fas fa-image"></i>
              </button>
              <button className="hover:text-blue-500">
                <i className="fas fa-video"></i>
              </button>
              <button className="hover:text-blue-500">
                <i className="fas fa-paperclip"></i>
              </button>
              <button className="hover:text-blue-500">
                <i className="fas fa-smile"></i>
              </button>
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-full">
              Quotes
            </button>
          </div>
        </div>

        {/* Bagian Feed */}
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-md p-4 flex space-x-4"
            >
              <img
                src="/test/1.png"
                alt="User Avatar"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold">Lorem Ipsum</h3>
                    <p className="text-sm text-gray-500">@username • 1m</p>
                  </div>
                </div>
                <p className="text-gray-700 mt-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Phasellus at justo nibh. Proin ullamcorper, eros a mattis
                  tincidunt, nunc lorem ornare quam, sed laoreet velit massa a
                  diam.
                </p>
                <div className="flex items-center justify-between text-gray-500 mt-2">
                  <div className="flex space-x-2">
                    <button className="hover:text-blue-500">
                      <i className="far fa-comment"></i> 124
                    </button>
                    <button className="hover:text-blue-500">
                      <i className="fas fa-retweet"></i> 124
                    </button>
                    <button className="hover:text-blue-500">
                      <i className="far fa-heart"></i> 2.2k
                    </button>
                  </div>
                  <button className="hover:text-blue-500">
                    <i className="fas fa-share"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
