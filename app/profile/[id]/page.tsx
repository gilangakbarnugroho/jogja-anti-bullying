"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { auth, db } from "../../../firebase/firebaseConfig";
import { doc, getDoc, query, collection, where, onSnapshot } from "firebase/firestore";
import Link from "next/link";
import { signOut } from "firebase/auth";

interface UserProfile {
  name: string;
  bio: string;
  email: string;
  profilePicture: string;
}

interface Post {
  id: string;
  content: string;
  user: string;
  timestamp: any;
}

interface Bookmark {
  postId: string;
  timestamp: any;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profilePosts, setProfilePosts] = useState<Post[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Ambil userId dari parameter URL
  const userId = pathname?.split("/").pop() || "";

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        setProfile(userDoc.data() as UserProfile);
      } else {
        console.error("Profil pengguna tidak ditemukan.");
      }
    };

    const fetchPosts = () => {
      const q = query(collection(db, "posts"), where("user", "==", userId));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const userPosts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];
        setProfilePosts(userPosts);
      });
      return unsubscribe;
    };

    const fetchBookmarks = () => {
      const q = query(collection(db, `users/${userId}/bookmarks`));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const userBookmarks = snapshot.docs.map((doc) => ({
          postId: doc.data().postId,
          timestamp: doc.data().timestamp,
        })) as Bookmark[];
        setBookmarks(userBookmarks);
      });
      return unsubscribe;
    };

    fetchProfile();
    const unsubscribePosts = fetchPosts();
    const unsubscribeBookmarks = fetchBookmarks();

    return () => {
      if (unsubscribePosts) unsubscribePosts();
      if (unsubscribeBookmarks) unsubscribeBookmarks();
    };
  }, [userId]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 mt-16">
      <h1 className="text-3xl text-center text-bluetiful font-bold mb-6">Profil {profile.name}</h1>

      {/* Informasi Profil */}
      <div className="flex items-center space-x-4 mb-6">
        <img
          src={profile.profilePicture || "/default-profile.png"}
          alt="Profile"
          className="w-20 h-20 rounded-full"
        />
        <div>
          <h2 className="text-xl text-bluetiful font-semibold">{profile.name}</h2>
          <p className="text-gray-500">{profile.email}</p>
        </div>
      </div>

      {/* Bio Profil */}
      <div className="mb-6">
        <h3 className="text-lg text-bluetiful font-semibold">Bio</h3>
        <p className="text-gray-500">{profile.bio || "Belum ada bio."}</p>
      </div>

      {/* Aktivitas pengguna (postingan yang pernah dibuat) */}
      <h3 className="text-lg text-bluetiful font-semibold mb-4">Aktivitas {profile.name}</h3>

      {/* Menampilkan postingan yang dibuat oleh pengguna */}
      {profilePosts.length > 0 ? (
        <div className="space-y-4">
          {profilePosts.map((post) => (
            <div key={post.id} className="p-4 border rounded-lg shadow-md">
              <p className="text-sm text-gray-500">{profile.name}</p>
              <p className="text-lg text-gray-700 py-2">{post.content}</p>
              <p className="text-xs text-gray-400">
                {new Date(post.timestamp.seconds * 1000).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>Belum ada postingan.</p>
      )}

    </div>
  );
};

export default ProfilePage;
