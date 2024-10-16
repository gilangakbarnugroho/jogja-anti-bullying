"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth, db } from "../../../firebase/firebaseConfig";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Loader from "../../../components/ui/Loader"; 

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [gelarPostCount, setGelarPostCount] = useState(0);
  const [quoteCount, setQuoteCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const checkAdminStatus = async (user: any) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.role === "admin") {
            setIsAdmin(true);
            fetchStats();
          } else {
            router.push("/");
          }
        } else {
          router.push("/");
        }
      } else {
        router.push("/login");
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      checkAdminStatus(user);
    });

    return () => unsubscribe();
  }, [router]);

  const fetchStats = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, "users"));
      setUserCount(usersSnapshot.size);

      const postsSnapshot = await getDocs(collection(db, "posts"));
      setPostCount(postsSnapshot.size);

      const gelarPostsSnapshot = await getDocs(collection(db, "gelarPosts"));
      setGelarPostCount(gelarPostsSnapshot.size);

      const quotesSnapshot = await getDocs(collection(db, "quotes"));
      setQuoteCount(quotesSnapshot.size);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader /> 
      </div>
    );
  }

  return (
    <div className="p-6 container mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-bluetiful">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h3 className="text-2xl font-semibold text-gray-800">Users</h3>
          <p className="text-4xl font-bold text-bluetiful">{userCount}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h3 className="text-2xl font-semibold text-gray-800">Posts</h3>
          <p className="text-4xl font-bold text-bluetiful">{postCount}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h3 className="text-2xl font-semibold text-gray-800">Gelar Posts</h3>
          <p className="text-4xl font-bold text-bluetiful">{gelarPostCount}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h3 className="text-2xl font-semibold text-gray-800">Quotes</h3>
          <p className="text-4xl font-bold text-bluetiful">{quoteCount}</p>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
