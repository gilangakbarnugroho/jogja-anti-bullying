"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";

function Clients() {
  const logosRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (logosRef.current) {
      const ul = logosRef.current;
      const clonedUl = ul.cloneNode(true) as HTMLUListElement;
      clonedUl.setAttribute("aria-hidden", "true");
      ul.parentNode?.appendChild(clonedUl);
    }
  }, []);

  return (
    <div className="flex flex-col w-full py-10">
      <div className="flex flex-wrap max-w-6xl mx-auto items-center justify-center">
        <span className="text-base font-light !leading-relaxed tracking-widest text-center uppercase text-gray-400">
          Institusi
        </span>
      </div>
      <span className="text-3xl font-bold !leading-relaxed tracking-wide text-bluetiful text-center mt-2">
          Partner & Kerja Sama
        </span>
      <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)] mt-8">
        <ul
          ref={logosRef}
          className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll"
        >
          <li className="w-20 h-20">
            <Image src="/clients/client - 1.png" alt="Dinas Pendidikan Pemuda dan Olahraga Kota Yogyakarta" height={70} width={70} />
          </li>
          <li className="w-20 h-20">
            <Image src="/clients/client - 2.png" alt="Dinas Pendidikan Pemuda dan Olahraga Kota Yogyakarta" height={70} width={70} />
          </li>
          <li className="w-20 h-20">
            <Image src="/clients/client - 3.png" alt="Dinas Pendidikan Pemuda dan Olahraga Kota Yogyakarta" height={70} width={70} />
          </li>
          <li className="w-20 h-20">
            <Image src="/clients/client - 4.png" alt="Dinas Pendidikan Pemuda dan Olahraga Kota Yogyakarta" height={70} width={70} />
          </li>
          <li className="w-20 h-20">
            <Image src="/clients/client - 5.png" alt="Dinas Pendidikan Pemuda dan Olahraga Kota Yogyakarta" height={70} width={70} />
          </li>
          <li className="w-20 h-20">
            <Image src="/clients/client - 6.png" alt="Dinas Pendidikan Pemuda dan Olahraga Kota Yogyakarta" height={70} width={70} />
          </li>
          <li className="w-20 h-20">
            <Image src="/clients/client - 7.png" alt="Dinas Pendidikan Pemuda dan Olahraga Kota Yogyakarta" height={70} width={70} />
          </li>
          <li className="w-20 h-20">
            <Image src="/clients/client - 8.png" alt="Dinas Pendidikan Pemuda dan Olahraga Kota Yogyakarta" height={70} width={70} />
          </li>
          <li className="w-20 h-20">
            <Image src="/clients/client - 9.png" alt="Dinas Pendidikan Pemuda dan Olahraga Kota Yogyakarta" height={70} width={70} />
          </li>
          <li className="w-20 h-20">
            <Image src="/clients/client - 10.png" alt="Dinas Pendidikan Pemuda dan Olahraga Kota Yogyakarta" height={70} width={70} />
          </li>
          <li className="w-20 h-20">
            <Image src="/clients/client - 11.png" alt="Dinas Pendidikan Pemuda dan Olahraga Kota Yogyakarta" height={70} width={70} />
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Clients;
