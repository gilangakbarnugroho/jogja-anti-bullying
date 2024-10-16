"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../../../../firebase/firebaseConfig";
import PostCard from "../../../../components/PostCardDuta";
import Loader from "../../../../components/ui/Loader";
import Modal from "../../../../components/ui/Modal";

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: { seconds: number };
  approved?: boolean;
  likes: number;
  views: number;
}

export default function ManageDuta() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null); 
  const [editPost, setEditPost] = useState<Post | null>(null); 

  useEffect(() => {
    const checkAdminStatus = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(docRef);
        if (userDoc.exists() && userDoc.data().role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      }
    };
    checkAdminStatus();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "dutaPosts")); 
        const postsData: Post[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content || !file) {
      alert("Judul, konten, kategori, dan gambar wajib diisi!");
      return;
    }

    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setError("Ukuran gambar maksimal adalah 2MB. Silakan pilih gambar lain.");
      return;
    }

    try {
      setUploading(true);
      const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error("Error uploading file:", error);
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          const currentUser = auth.currentUser;
          const author = currentUser ? currentUser.email : "Anonim";

          await addDoc(collection(db, "dutaPosts"), { 
            title,
            content,
            imageUrl: downloadURL,
            createdAt: new Date(),
            author,
            approved: false,
            likes: 0,
          });

          setTitle("");
          setContent("");
          setFile(null);
          setUploading(false);
          alert("Postingan berhasil ditambahkan! Tunggu persetujuan admin.");
        }
      );
    } catch (error) {
      console.error("Error adding post:", error);
      setUploading(false);
      alert("Error adding post.");
    }
  };

  const handleApprove = async (id: string, approved: boolean) => {
    try {
      await updateDoc(doc(db, "dutaPosts", id), { approved }); 
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === id ? { ...post, approved } : post))
      );
    } catch (error) {
      console.error("Error approving post:", error);
      alert("Gagal mengubah status persetujuan.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) {
      alert("Anda tidak memiliki izin untuk menghapus postingan.");
      return;
    }

    try {
      await deleteDoc(doc(db, "dutaPosts", id)); 
      setPosts(posts.filter((post) => post.id !== id));
      alert("Postingan berhasil dihapus.");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post); 
  };

  const handleCloseModal = () => {
    setSelectedPost(null); 
  };

  const handleEditPost = (post: Post) => {
    setEditPost(post);
    setTitle(post.title);
    setContent(post.content);
  };

  const handleCloseEditModal = () => {
    setEditPost(null);
    setFile(null);
  };

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editPost) return;

    if (!title || !content) {
      alert("Judul, konten, dan kategori wajib diisi!");
      return;
    }

    const MAX_SIZE = 2 * 1024 * 1024;
    if (file && file.size > MAX_SIZE) {
      alert("Ukuran gambar maksimal adalah 2MB. Silakan pilih gambar lain.");
      return;
    }

    try {
      setUploading(true);
      let imageUrl = editPost.imageUrl;

      if (file) {
        const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => reject(error),
            async () => {
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }

      await updateDoc(doc(db, "dutaPosts", editPost.id), { 
        title,
        content,
        imageUrl,
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === editPost.id ? { ...post, title, content, imageUrl } : post
        )
      );

      setEditPost(null);
      setFile(null);
      setUploading(false);
      alert("Postingan berhasil diperbarui.");
    } catch (error) {
      console.error("Error updating post:", error);
      setUploading(false);
      alert("Error mengedit post.");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-10">
        <form onSubmit={handleSubmit} className="mb-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="border p-4 rounded-md shadow-md">
              <div onClick={() => handlePostClick(post)}>
                <PostCard
                  id={post.id}
                  title={post.title}
                  content={post.content}
                  imageUrl={post.imageUrl}
                  createdAt={post.createdAt.seconds}
                  likes={post.likes}
                  onDelete={() => handleDelete(post.id)}
                  isAdmin={isAdmin}
                />
              </div>
              <div className="mt-2 flex justify-between text-gray-700">
                <label>
                  <input
                    type="checkbox"
                    checked={post.approved}
                    className="mr-2"
                    onChange={(e) => handleApprove(post.id, e.target.checked)}
                  />
                  Approve Post
                </label>
                <button
                  onClick={() => handleEditPost(post)}
                  className="px-3 py-1 my-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="px-3 py-1 my-2 text-white bg-red-500 rounded hover:bg-red-600"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>

        {isLoading && <Loader />}

        {selectedPost && (
          <Modal onClose={handleCloseModal}>
            <div className="p-4">
              <Image
                src={selectedPost.imageUrl}
                alt={selectedPost.title}
                width={800}
                height={450}
                loading="lazy"
                className="w-full h-48 object-cover rounded-lg my-4"
              />
              <h2 className="font-bold text-xl mb-2">{selectedPost.title}</h2>
              <p className="mb-4">{selectedPost.content}</p>
              <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded" onClick={handleCloseModal}>
                Tutup
              </button>
            </div>
          </Modal>
        )}

        {editPost && (
          <Modal onClose={handleCloseEditModal}>
            <form onSubmit={handleUpdatePost} className="p-4">
              <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
              <input
                type="text"
                placeholder="Judul Postingan"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mb-2 w-full px-4 py-2 border rounded"
                required
              />
              <textarea
                placeholder="Konten Postingan"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mb-2 w-full px-4 py-2 border rounded"
                required
              ></textarea>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                className="mb-2 w-full"
                accept="image/*"
              />
              <button
                type="submit"
                className={`px-7 py-3 mt-2 shadow-md rounded-full ${
                  uploading ? "bg-gray-500" : "bg-bluetiful text-white"
                } ${uploading ? "cursor-not-allowed" : "hover:bg-white hover:text-bluetiful font-semibold"}`}
                disabled={uploading}
              >
                {uploading ? "Mengunggah..." : "Update Post"}
              </button>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
}
