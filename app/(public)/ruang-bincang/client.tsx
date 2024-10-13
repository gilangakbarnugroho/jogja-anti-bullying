"use client";

import { useEffect, useState } from "react";
import { db } from "../../../firebase/firebaseConfig";
import { collection, query, orderBy, limit, startAfter, getDocs } from "firebase/firestore";
import dynamic from "next/dynamic";
import Loader from "../../../components/ui/Loader";
import { FaComment } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

// Lazy load komponen
const NewPostForm = dynamic(() => import("../../../components/NewPostForm"), { ssr: false });
const UpvoteDownvote = dynamic(() => import("../../../components/UpvoteDownvote"), { ssr: false });
const BookmarkButton = dynamic(() => import("../../../components/BookmarkButton"), { ssr: false });
const ReportButton = dynamic(() => import("../../../components/ReportButton"), { ssr: false });
const PostCommentList = dynamic(() => import("../../../components/PostCommentList"), { ssr: false });

interface Post {
  id: string;
  content: string;
  user: string;
  name: string;
  profilePicture: string;
  isAnonymous: boolean; 
  category?: string;
  timestamp: any;
}

interface RuangBincangClientProps {
  initialPosts: Post[]; 
}

const RuangBincangClient: React.FC<RuangBincangClientProps> = ({ initialPosts }) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const postsPerPage = 5;

  const fetchMorePosts = async () => {
    if (!lastVisible || !hasMore || isLoading) return;

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

  return (
    <div>
      {/* Form postingan baru */}
      <NewPostForm />

      {/* List feed postingan */}
      <div className="space-y-8">
        {posts.map((post) => (
          <div key={post.id} className="p-4 my-4 border rounded-lg shadow-md hover:shadow-lg transition duration-200">
            {/* Profil pengguna di samping username */}
            <Link href={post.isAnonymous ? "#" : `/profile/${post.user}`} className="flex items-center space-x-3 hover:opacity-75">
              {post.isAnonymous ? (
                <div className="flex items-center space-x-3">
                  {/* Jika post anonim, tampilkan gambar default */}
                  <div className="w-7 h-7 rounded-full bg-gray-400" />
                  <div className="font-semibold text-gray-600">Anonim</div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
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
                </div>
              )}
            </Link>

            {/* Tampilkan waktu yang diformat dengan locale */}
            <Link href={`/ruang-bincang/${post.id}`} className="block">
              <p className="text-xl text-gray-700 py-3 md:py-5">{post.content}</p>
              
              {/* Tampilkan gambar atau video jika ada */}
              {post.fileURL && post.fileType?.startsWith("image/") && (
                <Image
                    src={post.fileURL}
                    alt="Post Image"
                    width={500}
                    height={300}
                    className="rounded-lg mb-4"
                />
                )}
                {post.fileURL && post.fileType?.startsWith("video/") && (
                    <video controls className="w-full max-w-lg mt-4 rounded-lg">
                    <source src={post.fileURL} type={post.fileType} />
                    Browser Anda tidak mendukung pemutar video.
                </video>
                )}
              
              <p className="text-xs text-gray-400">
                {/* Pastikan locale konsisten */}
                {new Date(post.timestamp.seconds * 1000).toLocaleString("id-ID")}
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

export default RuangBincangClient;
