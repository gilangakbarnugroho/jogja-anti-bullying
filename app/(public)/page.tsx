'use client';

import { FC } from 'react';
import Head from "next/head";
import Clients from "@/components/Home/Clients";
import Hero from "@/components/Home/Hero";

const HomePage: FC = () => {
  return (
    <div className="relative max-w-screen overflow-hidden">
      <Head>
        <title>
          Jogja Anti Bullying &mdash; Kanal Digital Anti Bullying
        </title>
      </Head>

      <div className="relative flex flex-col w-full">

        {/* Illustration behind content */}
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 pointer-events-none opacity-50 blur-3xl w-full max-w-full h-auto"
          aria-hidden="true"
        >
          <svg
            className="w-full h-auto"
            viewBox="0 0 720 360"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="illustration-02">
                <stop stopColor="#FFF" offset="0%" />
                <stop stopColor="#3377E2" offset="77.402%" />
                <stop stopColor="#3377E2" offset="100%" />
              </linearGradient>
            </defs>
            <g transform="translate(0 -3)" fill="url(#illustration-02)" fillRule="evenodd">
              <circle cx="0" cy="0" r="128" />
              <circle cx="720" cy="320" r="240" />
            </g>
          </svg>
        </div>

        <Hero />
        <Clients />
      </div>
    </div>
  );
};

export default HomePage;
