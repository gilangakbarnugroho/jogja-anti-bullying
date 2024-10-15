"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaQuoteLeft, FaUserGraduate, FaNewspaper, FaExclamationTriangle, FaHome, FaUserShield } from "react-icons/fa";
import { auth, db } from "../../firebase/firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Sidebar = () => {
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
    <div className="h-screen w-64 bg-bluetiful text-white fixed top-0 left-0 flex flex-col">
      <Link href="/dashboard-admin" className="p-4 text-2xl font-semibold border-b border-bluetiful-200">
        Dashboard
      </Link>
      <nav className="flex-1 p-4 space-y-4">
        {/* Link ke Home */}
        <Link href="/" className="flex items-center space-x-2 hover:bg-bluetiful-400 px-3 py-2 rounded">
          <FaHome />
          <span>Home</span>
        </Link>

        {/* Link ke Manage Quotes */}
        <Link href="/dashboard-admin/manage-quotes" className="flex items-center space-x-2 hover:bg-bluetiful-400 px-3 py-2 rounded">
          <FaQuoteLeft />
          <span>Manage Quotes</span>
        </Link>

        {/* Link ke Manage DutaPost */}
        <Link href="/dashboard-admin/manage-duta" className="flex items-center space-x-2 hover:bg-bluetiful-400 px-3 py-2 rounded">
          <FaUserGraduate />
          <span>Manage Duta</span>
        </Link>

        {/* Link ke Manage GelarPost */}
        <Link href="/dashboard-admin/manage-gelar" className="flex items-center space-x-2 hover:bg-bluetiful-400 px-3 py-2 rounded">
          <FaNewspaper />
          <span>Manage Gelar</span>
        </Link>

        {/* Link ke Manage Report */}
        <Link href="/dashboard-admin/manage-reports" className="flex items-center space-x-2 hover:bg-bluetiful-400 px-3 py-2 rounded">
          <FaExclamationTriangle />
          <span>Report Posts</span>
        </Link>

        <div className="grow"></div>

        {/* Link ke Manage Account (Hanya untuk Superadmin) */}
        {isSuperAdmin && (
          <Link href="/dashboard-admin/manage-account" className="flex items-center space-x-2 text-bluetiful bg-bluetiful-50 hover:bg-bluetiful-800 px-3 py-2 rounded">
            <FaUserShield />
            <span>Manage Account</span>
          </Link>
        )}
      </nav>
      {/* Footer Sidebar */}
      <div className="p-4 border-t border-bluetiful-200 text-sm text-center">
        &copy; 2024 Jogja Anti Bullying
      </div>
    </div>
  );
};

export default Sidebar;
