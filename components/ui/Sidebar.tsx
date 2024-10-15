"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaQuoteLeft, FaUserGraduate, FaNewspaper, FaExclamationTriangle, FaHome, FaUserShield, FaBars } from "react-icons/fa";
import { auth, db } from "../../firebase/firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Sidebar = ({ isExpanded, toggleSidebar }: { isExpanded: boolean; toggleSidebar: () => void }) => {
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    const checkSuperAdmin = async (user: any) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.superrole === "superadmin") {
            setIsSuperAdmin(true);
          }
        }
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        checkSuperAdmin(user);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div
      className={`h-screen bg-bluetiful text-white fixed top-0 left-0 transition-all duration-300 ${
        isExpanded ? "w-64" : "w-16"
      } flex flex-col`}
    >
      {/* Tombol untuk toggle expand/collapse sidebar */}
      <button
        onClick={toggleSidebar}
        className="p-4 focus:outline-none hover:bg-bluetiful-400"
      >
        <FaBars />
      </button>

      <Link href="/dashboard-admin" className={`p-4 text-2xl font-semibold border-b border-bluetiful-200 transition-opacity ${
        isExpanded ? "opacity-100" : "opacity-0"
      } overflow-hidden`}>
        Dashboard
      </Link>

      <nav className="flex-1 p-4 space-y-4">
        <Link href="/" className="flex items-center space-x-2 hover:bg-bluetiful-400 px-3 py-2 rounded">
          <FaHome />
          {isExpanded && <span>Home</span>}
        </Link>

        <Link href="/dashboard-admin/manage-quotes" className="flex items-center space-x-2 hover:bg-bluetiful-400 px-3 py-2 rounded">
          <FaQuoteLeft />
          {isExpanded && <span>Manage Quotes</span>}
        </Link>

        <Link href="/dashboard-admin/manage-duta" className="flex items-center space-x-2 hover:bg-bluetiful-400 px-3 py-2 rounded">
          <FaUserGraduate />
          {isExpanded && <span>Manage Duta</span>}
        </Link>

        <Link href="/dashboard-admin/manage-gelar" className="flex items-center space-x-2 hover:bg-bluetiful-400 px-3 py-2 rounded">
          <FaNewspaper />
          {isExpanded && <span>Manage Gelar</span>}
        </Link>

        <Link href="/dashboard-admin/manage-reports" className="flex items-center space-x-2 hover:bg-bluetiful-400 px-3 py-2 rounded">
          <FaExclamationTriangle />
          {isExpanded && <span>Report Posts</span>}
        </Link>

        <div className="grow"></div>

        {isSuperAdmin && (
          <Link href="/dashboard-admin/manage-account" className="flex items-center space-x-2 hover:bg-bluetiful-400 px-3 py-2 rounded">
            <FaUserShield />
            {isExpanded && <span>Manage Account</span>}
          </Link>
        )}
      </nav>

      {/* Footer Sidebar */}
      <div
        className={`p-4 border-t border-bluetiful-200 text-sm text-center transition-opacity ${
          isExpanded ? "opacity-100" : "opacity-0"
        } overflow-hidden`}
      >
        &copy; 2024 Jogja Anti Bullying
      </div>
    </div>
  );
};

export default Sidebar;
