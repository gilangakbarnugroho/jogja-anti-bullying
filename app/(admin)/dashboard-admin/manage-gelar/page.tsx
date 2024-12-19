"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../../../../firebase/firebaseConfig";
import PostCard from "../../../../components/PostCard";
import Loader from "../../../../components/ui/Loader";
import Modal from "../../../../components/ui/Modal";
import { FaNewspaper } from "react-icons/fa";


interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl: string;
  createdAt: { seconds: number };
  approved: boolean;
  likes: number;
}

export default function ManageGelar() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<"approved" | "unapproved">("approved");

  useEffect(() => {
    const checkAdminStatus = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(docRef);
        if (userDoc.exists() && userDoc.data().role === "admin") {
          setIsAdmin(true);
        }
      }
    };
    checkAdminStatus();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "gelarPosts"));
        const postsData: Post[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content || !category || !file) {
      alert("Judul, konten, kategori, dan gambar wajib diisi!");
      return;
    }

    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert("Ukuran gambar maksimal adalah 2MB. Silakan pilih gambar lain.");
      return;
    }

    try {
      setUploading(true);
      const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Error uploading file:", error);
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          await addDoc(collection(db, "gelarPosts"), {
            title,
            content,
            category,
            imageUrl: downloadURL,
            createdAt: new Date(),
            approved: false,
            likes: 0,
          });

          setTitle("");
          setContent("");
          setCategory("");
          setFile(null);
          alert("Postingan berhasil ditambahkan! Tunggu persetujuan admin.");
          setUploading(false);
        }
      );
    } catch (error) {
      console.error("Error adding post:", error);
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) {
      alert("Anda tidak memiliki izin untuk menghapus postingan.");
      return;
    }

    try {
      await deleteDoc(doc(db, "gelarPosts", id));
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
      alert("Postingan berhasil dihapus.");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleApprove = async (id: string, approved: boolean) => {
    try {
      await updateDoc(doc(db, "gelarPosts", id), { approved });
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === id ? { ...post, approved } : post))
      );
    } catch (error) {
      console.error("Error approving post:", error);
    }
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  const filteredPosts = posts.filter((post) =>
    selectedFilter === "approved" ? post.approved : !post.approved
  );

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-10">
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex items-center space-x-1 text-gray-500">
            < FaNewspaper />
          <p className="text-gray-500">Manage Gelar Pelajar</p>
          </div>
          
          <h2 className="text-2xl font-bold text-bluetiful mb-4">Tambah Postingan Baru</h2>
          <input
            type="text"
            placeholder="Judul Postingan"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-2 w-full text-gray-500 px-4 py-2 border rounded"
            required
          />
          <textarea
            placeholder="Konten Postingan"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mb-2 w-full text-gray-500 px-4 py-2 border rounded"
            required
          ></textarea>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mb-2 w-full text-gray-500 px-4 py-2 border rounded"
            required
          >
            <option value="">Pilih Kategori</option>
            <option value="Pendidikan">Pendidikan</option>
            <option value="Sosial">Sosial</option>
            <option value="Budaya">Budaya</option>
            <option value="Teknologi">Teknologi</option>
          </select>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            className="mb-2 w-full text-gray-500"
            accept="image/*"
            required
          />
          <button
            type="submit"
            className={`px-7 py-3 mt-2 shadow-md rounded-full ${
              uploading ? "bg-gray-500" : "bg-bluetiful text-white"
            } ${uploading ? "cursor-not-allowed" : "hover:bg-white hover:text-bluetiful font-semibold"}`}
            disabled={uploading}
          >
            {uploading ? "Mengunggah..." : "Tambah Post"}
          </button>
        </form>

        <div className="flex justify-center items-center mb-6">
          <button
            className={`px-4 py-2 rounded ${
              selectedFilter === "approved"
                ? "bg-bluetiful text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setSelectedFilter("approved")}
          >
            Approved Posts
          </button>
          <button
            className={`px-4 py-2 rounded ${
              selectedFilter === "unapproved"
                ? "bg-bluetiful text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setSelectedFilter("unapproved")}
          >
            Unapproved Posts
          </button>
        </div>

        {isLoading ? (
          <Loader />
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div key={post.id} className="border p-4 rounded-md shadow-md">
                <div onClick={() => handlePostClick(post)}>
                  <PostCard
                    id={post.id}
                    title={post.title}
                    content={post.content}
                    category={post.category}
                    imageUrl={post.imageUrl}
                    createdAt={post.createdAt.seconds}
                    likes={post.likes}
                    isAdmin={isAdmin}
                  />
                </div>
                <div className="mt-2 flex justify-between text-gray-700">
                  {selectedFilter === "unapproved" && (
                    <button
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      onClick={() => handleApprove(post.id, true)}
                    >
                      Approve
                    </button>
                  )}
                  {selectedFilter === "approved" && (
                    <button
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      onClick={() => handleApprove(post.id, false)}
                    >
                      Unapprove
                    </button>
                  )}
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => handleDelete(post.id)}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Tidak ada postingan ditemukan.</p>
        )}

        {selectedPost && (
          <Modal onClose={handleCloseModal}>
            <div className="p-4">
              <Image
                src={selectedPost.imageUrl}
                alt={selectedPost.title}
                width={800}
                height={450}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h2 className="font-bold text-xl mb-2">{selectedPost.title}</h2>
              <p className="mb-4">{selectedPost.content}</p>
              <button
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                onClick={handleCloseModal}
              >
                Tutup
              </button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
