"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, getDoc, query, collection, where, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
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
  title: string;
  content: string;
  user: string;
  timestamp: any;
}

interface Bookmark {
  userProfile: any;
  postId: string;
  timestamp: any;
  postDetail?: Post;
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
      const userId = auth.currentUser?.email;
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

    const fetchBookmarks = async () => {
      const userId = auth.currentUser?.uid;
      if (userId) {
        const q = query(collection(db, `users/${userId}/bookmarks`));
        const unsubscribe = onSnapshot(q, async (snapshot) => {
          const userBookmarks = snapshot.docs.map((doc) => ({
            postId: doc.data().postId,
            timestamp: doc.data().timestamp,
          })) as Bookmark[];

          // Ambil detail setiap post dan user profile berdasarkan postId
          const postDetails = await Promise.all(
            userBookmarks.map(async (bookmark) => {
              const postRef = doc(db, "posts", bookmark.postId);
              const postDoc = await getDoc(postRef);

              let userProfile: UserProfile | undefined;

              if (postDoc.exists()) {
                const postData = postDoc.data() as Post;

                // Ambil data user profile dari `users` collection berdasarkan `post.user`
                const userDoc = await getDoc(doc(db, "users", postData.user));
                if (userDoc.exists()) {
                  userProfile = userDoc.data() as UserProfile;
                }

                return {
                  ...bookmark,
                  postDetail: postData,
                  userProfile: userProfile || { name: "Pengguna Tidak Diketahui", profilePicture: "" },
                };
              }

              return bookmark;
            })
          );

          setBookmarks(postDetails);
        });
        return unsubscribe;
      }
    };

    fetchProfile();
    const unsubscribePosts = fetchPosts();
    let unsubscribeBookmarks: (() => void) | undefined = undefined; 

    const initializeBookmarks = async () => {
      unsubscribeBookmarks = await fetchBookmarks();
    };

    initializeBookmarks();

    return () => {
      if (typeof unsubscribePosts === "function") unsubscribePosts();
      if (typeof unsubscribeBookmarks === "function") unsubscribeBookmarks();
    };
  }, [router]);

  // Fungsi untuk menangani logout
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 mt-16">
      <h1 className="text-3xl text-center text-bluetiful font-bold mb-6">Profil Saya</h1>

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

      {/* Tombol Edit Profil dan Logout */}
      <div className="flex items-center space-x-4 mb-6">
        {/* Tombol Edit Profil */}
        <button
          onClick={() => router.push("/profile/edit")}
          className="bg-bluetiful shadow-md text-white px-7 py-2 rounded-full hover:bg-white hover:text-bluetiful"
        >
          Edit Profil
        </button>

        {/* Tombol Logout */}
        <button
          onClick={handleLogout}
          className="bg-red-700 shadow-md text-white px-7 py-2 rounded-full hover:bg-red-900"
        >
          Logout
        </button>
      </div>

      {/* Aktivitas pengguna (postingan yang pernah dibuat) */}
      <h3 className="text-lg text-bluetiful font-semibold mb-4">Aktivitas Saya</h3>

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

      {/* Bookmark pengguna */}
      <h3 className="text-lg text-bluetiful font-semibold mt-8 mb-4">Bookmark Saya</h3>

      {bookmarks.length > 0 ? (
        <div className="space-y-4">
          {bookmarks.map((bookmark) => (
            <Link
              key={bookmark.postId}
              href={`/ruang-bincang/${bookmark.postId}`}
              className="p-4 border rounded-lg shadow-md block"
            >
              <p className="text-sm text-gray-500">Diposting oleh: {bookmark.userProfile?.name || "Pengguna Tidak Diketahui"}</p>
              <p className="text-lg text-gray-700 py-2">{bookmark.postDetail?.content || "Konten Tidak Ditemukan"}</p>
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
