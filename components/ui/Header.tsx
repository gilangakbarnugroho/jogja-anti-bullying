"use client";

import Link from "next/link";
import Logo from "./Logo";
import React, { useState, useEffect } from "react";
import { CgOptions } from "react-icons/cg";
import { LuSearch } from "react-icons/lu";
import { FaTimes } from "react-icons/fa";
import { isAdmin, auth } from "../../firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import { VscAccount } from "react-icons/vsc";

const links = [
  ["Ruang Bincang", "/ruang-bincang"],
  ["Duta", "/duta"],
  ["Gelar", "/gelar"],
  ["Quotes", "/quotes"],
];

function Header() {
  const [open, setOpen] = useState(false); // Open state for off-canvas menu
  const [top, setTop] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const [isAdminUser, setIsAdminUser] = useState(false);

  // Cek apakah user adalah admin
  useEffect(() => {
    const checkAdmin = async () => {
      const adminStatus = await isAdmin();
      setIsAdminUser(adminStatus);
    };
    checkAdmin();
  }, []);

  // Update tampilan header saat scroll
  const scrollHandler = () => {
    window.pageYOffset > 10 ? setTop(false) : setTop(true);
  };

  useEffect(() => {
    scrollHandler();
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [top]);

  // Mengatur state user berdasarkan Firebase Authentication
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <header className={`fixed w-full z-30 bg-opacity-90 transition duration-300 ease-in-out ${!top ? "bg-white backdrop-blur-md shadow-lg" : ""}`}>
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <div className="flex items-center justify-between py-5">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex space-x-8 items-center text-bluetiful">
            {links.map((val, key) => (
              <Link href={val[1]} key={key} className="hover:underline">
                {val[0]}
              </Link>
            ))}
            {isAdminUser && (
              <Link href="/dashboard-admin" className="hover:underline text-bluetiful">
                Dashboard
              </Link>
            )}
          </div>

          {/* Search & Profile/Account - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/search" className="bg-bluetiful rounded-full p-2 text-white hover:bg-white hover:text-bluetiful">
              <LuSearch size={20} />
            </Link>

            {user ? (
              <Link href="/profile" className="bg-bluetiful rounded-full p-2 text-white hover:bg-white hover:text-bluetiful">
                <VscAccount size={20} />
              </Link>
            ) : (
              <Link href="/login" className="btn-bluetiful">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden text-bluetiful">
            <button onClick={() => setOpen(true)}>
              <CgOptions size={32} />
            </button>
          </div>
        </div>
      </div>

      {/* Off-Canvas Menu for Mobile */}
      <div
        className={`fixed top-0 right-0 h-full w-1/2 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-5 border-b">
            {/* Close Button */}
            <button onClick={() => setOpen(false)} className="text-bluetiful font-semibold">
              <FaTimes />
            </button>
          </div>

          <div className="flex flex-col p-5 text-bluetiful space-y-5">
            {links.map((val, key) => (
              <Link href={val[1]} key={key} className="hover:underline" onClick={() => setOpen(false)}>
                {val[0]}
              </Link>
            ))}
            {isAdminUser && (
              <Link href="/dashboard-admin" className="hover:underline text-bluetiful">
                Dashboard
              </Link>
            )}
            <Link href="/search" className="btn-bluetiful flex items-center justify-start space-x-3">
              <LuSearch size={24} />
              <span>Search</span>
            </Link>
            {user ? (
              <Link href="/profile" className="btn-bluetiful flex space-x-2" onClick={() => setOpen(false)}>
                <VscAccount size={24} />
                <span>Profil</span>
              </Link>
            ) : (
              <Link href="/login" className="btn-bluetiful flex space-x-2" onClick={() => setOpen(false)}>
                <VscAccount size={24} />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop when menu is open */}
      {open && <div className="fixed inset-0 bg-black opacity-30 z-40" onClick={() => setOpen(false)}></div>}
    </header>
  );
}

export default Header;
