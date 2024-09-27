"use client";

import Link from "next/link";
import Logo from "./Logo";
import React, { useState, useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { LuSearch } from "react-icons/lu";
import { isAdmin, auth } from "../../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

const links = [
  ["Ruang Bincang", "/ruang-bincang"],
  ["Duta", "/duta"],
  ["Gelar", "/gelar"],
  ["Quotes", "/quotes"],
];

function Header() {
  const [open, setOpen] = useState(false);
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

  // Fungsi untuk logout
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    router.push("/login");
  };

  return (
    <header className={`fixed w-full z-30 md:bg-opacity-90 transition duration-300 ease-in-out ${!top ? "bg-white backdrop-blur-md shadow-lg" : ""}`}>
      <div className="flex flex-col w-full z-30">
        <div className="flex flex-row w-full top-0 items-center px-5 py-5 md:px-10 md:py-5 space-x-10 z-[100]">
          <Link href="/">
            <Logo />
          </Link>
          <div className="grow"></div>
          <div className="hidden md:flex flex-row md:grow items-center space-x-10 text-bluetiful">
            {links.map((val, key) => (
              <Link href={val[1]} key={key} className="hover:underline">
                {val[0]}
              </Link>
            ))}
            {isAdminUser && (
              <>
                <Link href="/admin/dashboard" className="hover:underline text-red-500">
                  Admin Dashboard
                </Link>
                <Link href="/admin/reports" className="hover:underline text-red-500">
                  Laporan Konten
                </Link>
              </>
            )}
            <div className="grow"></div>
            <div className="flex flex-row items-center space-x-3">
              <Link href="/search" className="btn-bluetiful p-4">
                <LuSearch />
              </Link>

              {/* Tombol Login/Logout berdasarkan status login */}
              {user ? (
                <button onClick={handleLogout} className="btn-bluetiful">
                  Logout
                </button>
              ) : (
                <Link href="/login" className="btn-bluetiful">
                  Login
                </Link>
              )}
            </div>
          </div>
          <div className="md:hidden text-white">
            <button onClick={(e) => setOpen(!open)}>
              <GiHamburgerMenu />
            </button>
          </div>
        </div>

        {/* Menu Dropdown saat di mode mobile */}
        {open ? (
          <div className="flex flex-col w-full items-center space-y-4 pb-5 text-white">
            <hr className="w-full" />
            {links.map((val, key) => (
              <Link href={val[1]} key={key} className="hover:underline" onClick={(e) => setOpen(!open)}>
                {val[0]}
              </Link>
            ))}

            {/* Tombol Login/Logout di Menu Dropdown Mobile */}
            {user ? (
              <button onClick={handleLogout} className="btn-bluetiful">
                Logout
              </button>
            ) : (
              <Link href="/login" className="btn-bluetiful">
                Login
              </Link>
            )}
          </div>
        ) : null}
      </div>
    </header>
  );
}

export default Header;