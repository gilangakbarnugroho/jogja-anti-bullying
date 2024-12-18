"use client";

import { useEffect, useState } from "react";
import { db, auth } from "../../../firebase/firebaseConfig";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import dynamic from "next/dynamic";
import Loader from "../../../components/ui/Loader";
import { FaComment } from "react-icons/fa";
import { SlOptions } from "react-icons/sl";
import { MdVerified } from "react-icons/md";
import Link from "next/link";
import Image from "next/image";

const NewPostForm = dynamic(() => import("../../../components/NewPostForm"), { ssr: false });
const Upvote = dynamic(() => import("../../../components/Upvote"), { ssr: false });
const Downvote = dynamic(() => import("../../../components/Downvote"), { ssr: false });
const BookmarkButton = dynamic(() => import("../../../components/BookmarkButton"), { ssr: false });
const ReportButton = dynamic(() => import("../../../components/ReportButton"), { ssr: false });
const PostCommentList = dynamic(() => import("../../../components/PostCommentList"), { ssr: false });

interface Post {
  id: string;
  content: string;
  user: string;
  name: string;
  profilePicture?: string;
  isAnonymous: boolean;
  category?: string;
  fileType?: string;
  fileURL?: string;
  timestamp: { seconds?: number };
}

interface RuangBincangClientProps {
  initialPosts: Post[];
}

const RuangBincangClient: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [showOptions, setShowOptions] = useState<Record<string, boolean>>({});
  const [adminStatus, setAdminStatus] = useState<Record<string, boolean>>({});
  const postsPerPage = 15;

  useEffect(() => {
    const postsQuery = query(collection(db, "posts"), orderBy("timestamp", "desc"), limit(postsPerPage));
    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const newPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];

      setPosts(newPosts);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === postsPerPage);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
        const newPosts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Post[];
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

  const handleDeletePost = async (postId: string) => {
    const confirmed = window.confirm("Apakah Anda yakin untuk menghapus postingan ini?");
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "posts", postId));
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      alert("Postingan berhasil dihapus.");
    } catch (error) {
      console.error("Error deleting post: ", error);
      alert("Terjadi kesalahan saat menghapus postingan.");
    }
  };

  const toggleOptions = (postId: string) => {
    setShowOptions((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const timeSince = (seconds: number) => {
    const now = Date.now() / 1000;
    const timeDifference = now - seconds;

    const minutesPassed = Math.floor(timeDifference / 60);
    const hoursPassed = Math.floor(timeDifference / 3600);
    const daysPassed = Math.floor(hoursPassed / 24);

    if (minutesPassed < 60) {
      return `${minutesPassed} menit yang lalu`;
    } else if (hoursPassed < 24) {
      return `${hoursPassed} jam yang lalu`;
    } else {
      return `${daysPassed} hari yang lalu`;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <NewPostForm />
      <div className="space-y-8">
        {posts.map((post) => (
          <div key={post.id} className="p-4 my-4 border rounded-lg shadow-md hover:shadow-lg transition duration-200 relative">
            <div className="flex justify-between items-start">
              <div className="flex-shrink-0 mr-3">
                {post.isAnonymous ? (
                  <div className="w-10 h-10 rounded-full bg-gray-400" />
                ) : (
                  <Image
                    src={post.profilePicture || "/default-profile.png"}
                    alt={`${post.name}'s profile picture`}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                )}
              </div>

              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <Link href={post.isAnonymous ? "#" : `/profile/${post.user}`} className="flex items-center space-x-2 hover:opacity-75">
                    <div className="font-semibold text-bluetiful flex items-center">
                      {post.isAnonymous ? "Anonim" : post.name || post.user}
                    </div>
                    <p className="text-xs text-gray-500">
                      {post.timestamp?.seconds ? timeSince(post.timestamp.seconds) : "Waktu tidak tersedia"}
                    </p>
                  </Link>

                  <div className="relative">
                    <SlOptions
                      className="cursor-pointer text-gray-300"
                      onClick={() => toggleOptions(post.id)}
                    />
                    {showOptions[post.id] && (
                      <div className="absolute right-0 top-6 w-44 space-y-2 bg-white border rounded-lg shadow-lg p-2">
                        {auth.currentUser?.uid === post.user && (
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="text-red-500 hover:text-red-700 border-b p-2"
                          >
                            Hapus Postingan
                          </button>
                        )}
                        <ReportButton postId={post.id} contentType="post" />
                      </div>
                    )}
                  </div>
                </div>

                <Link href={`/ruang-bincang/${post.id}`}>
                  <p className="text-lg text-gray-700 pb-3">{post.content}</p>

                  {post.fileURL && post.fileType?.startsWith("image/") && (
                    <Image
                      src={post.fileURL}
                      alt="Post Image"
                      width={1920}
                      height={1080}
                      className="rounded-lg mb-4 mx-auto block"
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                  )}
                  {post.fileURL && post.fileType?.startsWith("video/") && (
                    <video controls className="w-full mt-4 rounded-lg mx-auto block">
                      <source src={post.fileURL} type={post.fileType} />
                    </video>
                  )}
                </Link>

                <div className="flex justify-between items-center border-t my-2 pt-3">
                  <Link href={`/ruang-bincang/${post.id}`} className="flex-1 flex justify-center items-center text-gray-400 hover:text-bluetiful">
                    <FaComment size={20} />
                  </Link>

                  <div className="grow"></div>

                  <div className="flex-1 flex justify-center">
                    <Upvote postId={post.id} />
                  </div>

                  <div className="grow"></div>

                  <div className="flex-1 flex justify-center">
                    <Downvote postId={post.id} /> </div>
                    <div className="grow"></div>

              <div className="flex-1 flex justify-center">
                <BookmarkButton postId={post.id} />
              </div>
            </div>

            <div className="mt-2">
              <PostCommentList postId={post.id} />
            </div>
          </div>
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