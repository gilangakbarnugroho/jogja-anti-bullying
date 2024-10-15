'use client'

import { FC } from 'react';
import Head from "next/head"
import Clients from "@/components/Home/Clients"
import Hero from "@/components/Home/Hero"
import Duta from "@/components/Home/Duta"
import Gelar from "@/components/Home/Gelar"

const HomePage: FC = () => {
  return (
    <div>
      <Head>
        <title>
          Jogja Anti Bullying &mdash; Kanal Digital Anti Bullying
        </title>
      </Head>
      <div className="flex flex-col w-full">
        <Hero />
        <Clients />
      </div>
    </div>
  );
};

export default HomePage;