"use client";

import React, { useEffect, useRef } from "react";

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
          <li>
            <img src="./facebook.svg" alt="Facebook" />
          </li>
          <li>
            <img src="./disney.svg" alt="Disney" />
          </li>
          <li>
            <img src="./airbnb.svg" alt="Airbnb" />
          </li>
          <li>
            <img src="./apple.svg" alt="Apple" />
          </li>
          <li>
            <img src="./spark.svg" alt="Spark" />
          </li>
          <li>
            <img src="./samsung.svg" alt="Samsung" />
          </li>
          <li>
            <img src="./quora.svg" alt="Quora" />
          </li>
          <li>
            <img src="./sass.svg" alt="Sass" />
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Clients;
