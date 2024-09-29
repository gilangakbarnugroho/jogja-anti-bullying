"use client";

import { useEffect, useState } from "react";
import { db } from "../../../firebase/firebaseConfig";
import { collection, query, orderBy, limit, startAfter, getDocs } from "firebase/firestore";
import NewPostForm from "../../../components/NewPostForm";
import UpvoteDownvote from "../../../components/UpvoteDownvote";
import BookmarkButton from "../../../components/BookmarkButton";
import ReportButton from "../../../components/ReportButton";
import PostCommentList from "@/components/PostCommentList"; 
import Loader from "../../../components/ui/Loader";
import { FaComment } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

interface Post {
  id: string;
  content: string;
  user: string;
  name: string; 
  profilePicture: string; 
  category?: string;
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

        setPosts((prevPosts) => [...prevPosts, ...newPosts]); 
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length === postsPerPage);
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
    <div className="container mx-auto p-4 mt-20">
      <h1 className="text-3xl font-bold mb-6 text-center text-bluetiful">Ruang Bincang</h1>

      {/* Form postingan baru */}
      <NewPostForm />

      {/* Loader saat data sedang dimuat */}
      {isLoading && <Loader />}

      {/* List feed postingan */}
      <div className="space-y-8">
        {posts.map((post) => (
          <div key={post.id} className="p-4 my-4 border rounded-lg shadow-md hover:shadow-lg transition duration-200">

            {/* Profil pengguna di samping username */}
            <Link href={`/profile/${post.user}`} className="flex items-center space-x-3 hover:opacity-75">
              {post.profilePicture ? (
                <Image
                  src={post.profilePicture}
                  alt={`${post.name}'s profile picture`}
                  width={30}
                  height={30}
                  className="rounded-full"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gray-200" />
              )}
              <div className="font-semibold text-bluetiful">{post.name || post.user}</div>
            </Link>

            {/* Tautan ke detail post */}
            <Link href={`/ruang-bincang/${post.id}`} className="block">
              <p className="text-xl text-gray-700 py-3 md:py-5">{post.content}</p>
              <p className="text-xs text-gray-400">
                {new Date(post.timestamp.seconds * 1000).toLocaleString()}
              </p>
            </Link>

            {/* Tombol interaksi postingan */}
            <div className="flex justify-stretch space-x-4 border-t my-2">
              <Link href={`/ruang-bincang/${post.id}`} className="flex items-center space-x-2 text-gray-400 hover:text-bluetiful">
                <FaComment size={16} />
              </Link>

              <UpvoteDownvote postId={post.id} />
              <BookmarkButton postId={post.id} />
              <ReportButton postId={post.id} contentType="post" />
            </div>

            {/* Komentar Terbatas */}
            <div className="mt-2">
              <PostCommentList postId={post.id} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        {hasMore && !isLoading && (
          <button onClick={fetchMorePosts} className="btn-bluetiful mt-2">
            Tampilkan Lebih Banyak
          </button>
        )}

        {isLoading && <Loader />}
      </div>
    </div>
  );
};

export default RuangBincang;
