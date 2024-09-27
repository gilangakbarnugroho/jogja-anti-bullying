"use client";

import { useState, useEffect } from "react";
import { db, isAdmin } from "../../firebase/firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";

interface Post {
  id: string;
  content: string;
  user: string;
  timestamp: any;
}

const AdminDashboard = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const adminStatus = await isAdmin();
      setIsAdminUser(adminStatus);

      if (!adminStatus) {
        router.push("/"); // Jika bukan admin, arahkan kembali ke homepage
      }
    };

    const fetchPosts = async () => {
      const postSnapshot = await getDocs(collection(db, "posts"));
      const postData = postSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];
      setPosts(postData);
    };

    checkAdmin();
    fetchPosts();
  }, [router]);

  const handleDelete = async (postId: string) => {
    try {
      await deleteDoc(doc(db, "posts", postId));
      setPosts(posts.filter((post) => post.id !== postId));
      alert("Postingan berhasil dihapus.");
    } catch (error) {
      console.error("Error menghapus postingan:", error);
      alert("Terjadi kesalahan saat menghapus postingan.");
    }
  };

  if (!isAdminUser) return null;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <p>Tidak ada postingan.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="p-4 border rounded-lg shadow-md">
              <p className="text-sm text-gray-500">Diposting oleh: {post.user}</p>
              <p className="text-lg">{post.content}</p>
              <p className="text-xs text-gray-400">
                {new Date(post.timestamp.seconds * 1000).toLocaleString()}
              </p>

              <button
                onClick={() => handleDelete(post.id)}
                className="bg-red-500 text-white px-4 py-2 mt-2 rounded-lg hover:bg-red-700"
              >
                Hapus Postingan
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
