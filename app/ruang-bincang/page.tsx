"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, query, orderBy, limit, startAfter, getDocs } from "firebase/firestore";
import NewPostForm from "../../components/NewPostForm";
import UpvoteDownvote from "../../components/UpvoteDownvote";
import BookmarkButton from "../../components/BookmarkButton";
import ReportButton from "../../components/ReportButton";
import Loader from "../../components/ui/Loader";
import CommentForm from "../../components/CommentForm"; 
import CommentList from "../../components/CommentList"; 

interface Post {
  id: string;
  content: string;
  user: string;
  category: string;
  timestamp: any;
}

const postsPerPage = 5; 

const RuangBincang = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [lastVisible, setLastVisible] = useState<any>(null); 
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); 

  
  const fetchInitialPosts = async () => {
    try {
      setIsLoading(true);
      const q = query(collection(db, "posts"), orderBy("timestamp", "desc"), limit(postsPerPage));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const postData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];

        setPosts(postData);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]); 

        
        setHasMore(snapshot.docs.length === postsPerPage);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  
  const fetchMorePosts = async () => {
    if (!lastVisible || !hasMore) return;

    try {
      setIsLoading(true);
      const q = query(
        collection(db, "posts"),
        orderBy("timestamp", "desc"),
        startAfter(lastVisible),
        limit(postsPerPage)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const newPosts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];

        setPosts((prevPosts) => [...prevPosts, ...newPosts]); // Gabungkan postingan baru dengan yang lama
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]); // Perbarui dokumen terakhir
        setHasMore(snapshot.docs.length === postsPerPage); // Cek apakah masih ada lebih banyak postingan
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching more posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialPosts();
  }, []);

  return (
    <div className="container mx-auto p-4 mt-16">
      <h1 className="text-3xl font-bold mb-6 text-center text-bluetiful">Ruang Bincang</h1>

      {/* Form postingan baru */}
      <NewPostForm />

      {/* Loader saat data sedang dimuat */}
      {isLoading && <Loader />}

      {/* List feed postingan */}
      <div className="space-y-8">
        {posts.map((post) => (
          <div key={post.id} className="p-4 border rounded-lg shadow-md">
            <p className="text-sm text-gray-500">{post.user}</p>
            <p className="text-xl text-gray-700 py-2">{post.content}</p>
            <p className="text-xs text-gray-400">
              {new Date(post.timestamp.seconds * 1000).toLocaleString()}
            </p>
            <p className="flex items-stretch space-x-4">

            {/* Upvote/Downvote untuk postingan */}
            <UpvoteDownvote postId={post.id} />

            {/* Bookmark untuk postingan */}
            <BookmarkButton postId={post.id} />

            {/* Tombol Lapor */}
            <ReportButton postId={post.id} contentType="post" />

            </p>

            {/* Form komentar untuk postingan */}
            <CommentForm postId={post.id} />

            {/* List komentar untuk postingan */}
            <CommentList postId={post.id} />
          </div>
        ))}
      </div>

      {/* Tombol Pagination */}
      <div className="mt-8 flex justify-center">
        {hasMore && !isLoading && (
          <button
            onClick={fetchMorePosts}
            className="btn-bluetiful mt-2"
          >
            Tampilkan Lebih Banyak
          </button>
        )}

        {/* Loader untuk tombol pagination */}
        {isLoading && <Loader />}
      </div>
    </div>
  );
};

export default RuangBincang;
