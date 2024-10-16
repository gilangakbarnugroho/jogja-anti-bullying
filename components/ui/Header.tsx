"use client";

import Link from "next/link";
import Logo from "./Logo";
import React, { useState, useEffect } from "react";
import { CgOptions } from "react-icons/cg";
import { LuSearch } from "react-icons/lu";
import { FaTimes } from "react-icons/fa";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { VscAccount } from "react-icons/vsc";
import { IoChatboxEllipses } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { IoPeopleCircleOutline } from "react-icons/io5";
import { PiCertificateBold } from "react-icons/pi";
import { ImQuotesLeft } from "react-icons/im";
import { MdOutlineSpaceDashboard } from "react-icons/md";

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
  const [isAdminUser, setIsAdminUser] = useState(false);
  const router = useRouter();

  const scrollHandler = () => {
    window.pageYOffset > 10 ? setTop(false) : setTop(true);
  };

  useEffect(() => {
    scrollHandler();
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [top]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"; 
    } else {
      document.body.style.overflow = "auto"; 
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        checkAdminRole(user.uid); 
      } else {
        setUser(null);
        setIsAdminUser(false); 
      }
    });
    return () => unsubscribe();
  }, []);

  const checkAdminRole = async (uid: string) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === "admin") {
          setIsAdminUser(true);
        } else {
          setIsAdminUser(false);
        }
      }
    } catch (error) {
      console.error("Error fetching user role: ", error);
    }
  };

  return (
    <header className={`fixed w-full z-30 bg-opacity-90 bg-white transition duration-300 ease-in-out ${!top && !open ? "bg-white backdrop-blur-md shadow-lg" : ""}`}>
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <div className="flex items-center justify-between py-5">
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>

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

          <div className="hidden md:flex items-center space-x-4">
            {/* <Link href="/search" className="bg-bluetiful rounded-full p-2 text-white hover:bg-white hover:text-bluetiful">
              <LuSearch size={20} />
            </Link> */}

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

          <div className="md:hidden text-bluetiful">
            <button onClick={() => setOpen(true)}>
              <CgOptions size={32} />
            </button>
          </div>
        </div>
      </div>

      <div
        className={`fixed top-0 right-0 h-full w-1/2 bg-white z-50 backdrop-blur-lg transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-end p-5 mr-5 border-b">
            <button onClick={() => setOpen(false)} className="text-bluetiful font-semibold">
              <FaTimes size={24} />
            </button>
          </div>

          <div className="flex flex-col p-5 text-bluetiful space-y-5">

            {user ? (
              <Link href="/profile" className="btn-bluetiful flex space-x-2" onClick={() => setOpen(false)}>
                {/* <VscAccount size={24} /> */}
                <span>Profil</span>
              </Link>
            ) : (
              <Link href="/login" className="btn-bluetiful flex space-x-2" onClick={() => setOpen(false)}>
                <span>Login</span>
              </Link>
            )}
            
            {/* <Link href="/search" className="btn-bluetiful flex space-x-2">
              {/* <LuSearch size={24} /> 
              <span>Search</span>
            </Link> */}

            <div className="flex flex-col justify-between min-h-full space-y-5">

            {links.map((val, key) => (
              <Link href={val[1]} key={key} className="btn-bluetiful" onClick={() => setOpen(false)}>
                {val[0]}
              </Link>
            ))}

            <div className="grow"></div>

            </div>

            {isAdminUser && (
              <Link href="/dashboard-admin" className="btn-bluetiful flex space-x-2">
                < MdOutlineSpaceDashboard size={24} />
                Dashboard
              </Link>
            )}

          </div>
        </div>
      </div>

      {open && <div className="fixed inset-0 bg-black backdrop-blur-lg opacity-50 z-40" onClick={() => setOpen(false)}></div>}
    </header>
  );
}

export default Header;
