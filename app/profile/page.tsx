"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, getDoc, query, collection, where, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = auth.currentUser?.uid;
      if (userId) {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          setProfile(userDoc.data() as UserProfile);
        }
      } else {
        router.push("/login");
      }
    };

    const fetchPosts = () => {
      const userId = auth.currentUser?.email; // Menggunakan email untuk mencari postingan
      if (userId) {
        const q = query(collection(db, "posts"), where("user", "==", userId));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const userPosts = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Post[];
          setProfilePosts(userPosts);
        });
        return unsubscribe;
      }
    };

    const fetchBookmarks = () => {
      const userId = auth.currentUser?.uid;
      if (userId) {
        const q = query(collection(db, `users/${userId}/bookmarks`));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const userBookmarks = snapshot.docs.map((doc) => ({
            postId: doc.data().postId,
            timestamp: doc.data().timestamp,
          })) as Bookmark[];
          setBookmarks(userBookmarks);
        });
        return unsubscribe;
      }
    };

    fetchProfile();
    const unsubscribePosts = fetchPosts();
    const unsubscribeBookmarks = fetchBookmarks();

    return () => {
      if (unsubscribePosts) unsubscribePosts();
      if (unsubscribeBookmarks) unsubscribeBookmarks();
    };
  }, [router]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Profil Saya</h1>

      <div className="flex items-center space-x-4 mb-6">
        <img
          src={profile.profilePicture || "/default-profile.png"}
          alt="Profile"
          className="w-20 h-20 rounded-full"
        />
        <div>
          <h2 className="text-xl font-semibold">{profile.name}</h2>
          <p className="text-gray-500">{profile.email}</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold">Bio</h3>
        <p>{profile.bio || "Belum ada bio."}</p>
      </div>

      {/* Tautan untuk mengedit profil */}
      <button
        onClick={() => router.push("/profile/edit")}
        className="bg-bluetiful text-white px-4 py-2 rounded-lg hover:bg-blue-700 mb-6"
      >
        Edit Profil
      </button>

      {/* Aktivitas pengguna (postingan yang pernah dibuat) */}
      <h3 className="text-lg font-semibold mb-4">Aktivitas Saya</h3>

      {/* Menampilkan postingan yang dibuat oleh pengguna */}
      {profilePosts.length > 0 ? (
        <div className="space-y-4">
          {profilePosts.map((post) => (
            <div key={post.id} className="p-4 border rounded-lg shadow-md">
              <p className="text-sm text-gray-500">Diposting oleh: {post.user}</p>
              <p className="text-lg">{post.content}</p>
              <p className="text-xs text-gray-400">
                {new Date(post.timestamp.seconds * 1000).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>Belum ada postingan.</p>
      )}

      {/* Bookmark pengguna */}
      <h3 className="text-lg font-semibold mt-8 mb-4">Bookmark Saya</h3>

      {bookmarks.length > 0 ? (
        <div className="space-y-4">
          {bookmarks.map((bookmark) => (
            <Link key={bookmark.postId} href={`/ruang-bincang/${bookmark.postId}`} className="p-4 border rounded-lg shadow-md block">
              <p className="text-sm text-gray-500">Post ID: {bookmark.postId}</p>
              <p className="text-xs text-gray-400">
                Disimpan pada: {new Date(bookmark.timestamp.seconds * 1000).toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <p>Belum ada bookmark.</p>
      )}
    </div>
  );
};

export default ProfilePage;
