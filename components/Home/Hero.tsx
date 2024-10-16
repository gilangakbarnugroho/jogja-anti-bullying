import Image from "next/image"
import Link from "next/link"
import React from "react"
import { BsArrowUpRightCircleFill } from "react-icons/bs";

function Hero() {
  return (
    <div className="relative mx-auto items-center pt-8 md:pt-36">
      <div className="flex flex-col md:flex-row max-w-6xl mx-auto my-auto justify-center items-center py-24 md:py-10 px-10 rtl">
       {/* Section header */}
       <div className="text-center pb-4 md:pb-16">
        <h1 className="text-5xl md:text-6xl font-bold leading-tighter mb-4"> <span className="text-bluetiful">Kanal Digital Anti Bullying</span></h1>
          <div className="max-w-3xl mx-auto">
            <p className="text-md md:text-xl text-bluetiful tracking-wider mb-6">Gerakan Digital untuk Stop Bullying: Program, Artikel, dan Sumber Daya untuk Membuat Perubahan</p>
              <div className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center">
                <div className='mt-4 mb-4 md:mt-4 sm:w-auto sm:mb-0'>
                <Link
                href="/search"
                className="btn-bluetiful"
                >
                Explore
                </Link>
                </div>
              </div>
            </div>
          </div>
      </div>

      <div className="relative max-w-6xl xl:max-w-7xl mx-5 md:mx-auto rtl">

        {/* Our Programs */}
        <div className="max-w-3xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 items-start lg:max-w-none mb-8">

          {/* 1st Program */}
          <div className="flex flex-col h-full p-6 bg-white shadow-xl shadow-bluetiful-50 rounded-tl-lg rounded-tr-[4rem] rounded-bl-[4rem] rounded-br-lg" data-aos="fade-up">
            <div>
              <div className="w-full mb-4 flex flex-row grow"><div>
                <blockquote className="text-left text-sm font-light text-bluetiful">Halaman</blockquote>
                <blockquote className="text-left text-4xl font-bold text-bluetiful">Gelar Pelajar</blockquote>
              </div>
            <div className="grow"></div>
              <Image className="mb-4" src="/icon-gelar.png" width={100} height={100} alt="Gelar Pelajar" />
            </div>
          </div>

          <blockquote className="text-sm text-justify text-bluetiful mb-4">Wahana ekspresi potensi berbasis Multiple Intellegence untuk memfasilitasi minat, bakat, dan kreativitas pelajar.</blockquote>
          <div className="grow"></div>

            <div className="pt-6 border-t border-gray-300 text-center w-full flex">
              <Link className="btn-bluetiful-program w-full" href="/gelar" rel="noopener" target="_blank">Gelar Pelajar </Link>
            </div>
          </div>

          {/* 2nd Program */}
          <div className="flex flex-col h-full p-6 bg-white shadow-xl shadow-bluetiful-50 rounded-tl-lg rounded-tr-[4rem] rounded-bl-[4rem] rounded-br-lg" data-aos="fade-up">
            <div>
              <div className="w-full mb-4 flex flex-row grow"><div>
                <blockquote className="text-left text-sm font-light text-bluetiful">Halaman</blockquote>
                <blockquote className="text-left text-3xl font-bold text-bluetiful">Duta Anti Bullying</blockquote>
              </div>
            <div className="grow"></div>
              <Image className="mb-4" src="/icon-duta.png" width={100} height={100} alt="Duta Anti Bullying" />
            </div>
          </div>

          <blockquote className="text-sm text-justify text-bluetiful mb-4">Praktik social worker bagi siswa sebagai agen perubahan dalam mengkampanyekan budaya damai anti-bullly</blockquote>
          <div className="grow"></div>

            <div className="pt-6 border-t border-gray-300 text-center w-full flex">
              <Link className="btn-bluetiful-program w-full" href="/duta" rel="noopener" target="_blank">Duta Anti Bullying</Link>
            </div>
          </div>

          {/* 3rd Program */}
          <div className="flex flex-col h-full p-6 bg-white shadow-xl shadow-bluetiful-50 rounded-tl-lg rounded-tr-[4rem] rounded-bl-[4rem] rounded-br-lg" data-aos="fade-up">
            <div>
              <div className="w-full mb-4 flex flex-row grow"><div>
                <blockquote className="text-left text-sm font-light text-bluetiful">Halaman</blockquote>
                <blockquote className="text-left text-3xl font-bold text-bluetiful">Ruang Berbincang</blockquote>
              </div>
            <div className="grow"></div>
              <Image className="mb-4" src="/icon-ruangbincang.png" width={100} height={100} alt="Ruang berbincang" />
            </div>
          </div>

          <blockquote className="text-sm text-justify text-bluetiful mb-4">Forum inspiratif untuk sharing anti-bullying</blockquote>
          <div className="grow"></div>

            <div className="pt-6 border-t border-gray-300 text-center w-full flex">
              <Link className="btn-bluetiful-program w-full" href="/ruang-bincang" rel="noopener" target="_blank">Ruang Berbincang</Link>
            </div>
          </div>

          {/* 4th Program */}
          <div className="flex flex-col h-full p-6 bg-white shadow-xl shadow-bluetiful-50 rounded-tl-lg rounded-tr-[4rem] rounded-bl-[4rem] rounded-br-lg" data-aos="fade-up">
            <div>
              <div className="w-full mb-4 flex flex-row grow"><div>
                <blockquote className="text-left text-sm font-light text-bluetiful">Halaman</blockquote>
                <blockquote className="text-left text-3xl font-bold text-bluetiful">Quotes Anti Bullying</blockquote>
              </div>
            <div className="grow"></div>
              <Image className="mb-4" src="/icon-quotes.png" width={100} height={100} alt="Gelar Pelajar" />
            </div>
          </div>

          <blockquote className="text-sm text-justify text-bluetiful mb-4">Pitutur luhur atau petuah bijak berbasis kearifan lokal Budaya Jawa</blockquote>
          <div className="grow"></div>

            <div className="pt-6 border-t border-gray-300 text-center w-full flex">
              <Link className="btn-bluetiful-program w-full" href="/quotes" rel="noopener" target="_blank">Halaman Gelar Pelajar</Link>
            </div>
          </div>

        </div>
      </div>
      
    </div>
    
  )
}

export default Hero
