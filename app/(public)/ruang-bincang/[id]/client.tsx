"use client";

import { FC, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { FaComment } from "react-icons/fa";
import { SlOptions } from "react-icons/sl";
import { MdVerified } from "react-icons/md";
import Link from "next/link";
import Image from "next/image";
import { auth, db } from "../../../../firebase/firebaseConfig";
import { deleteDoc, doc, getDoc } from "firebase/firestore"; 
import ReportButton from "../../../../components/ReportButton";

const Upvote = dynamic(() => import("../../../../components/Upvote"), { ssr: false });
const Downvote = dynamic(() => import("../../../../components/Downvote"), { ssr: false });
const BookmarkButton = dynamic(() => import("../../../../components/BookmarkButton"), { ssr: false });
const CommentList = dynamic(() => import("../../../../components/CommentList"), { ssr: false });
const CommentForm = dynamic(() => import("../../../../components/CommentForm"), { ssr: false });

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

interface DetailPostClientProps {
  post: Post;
}

const DetailPostClient: FC<DetailPostClientProps> = ({ post }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const toggleOptions = () => {
    setShowOptions((prev) => !prev); 
  };

  const handleDelete = async () => {
    if (window.confirm("Apakah Anda yakin untuk menghapus postingan ini?")) {
      try {
        await deleteDoc(doc(db, "posts", post.id)); 
        alert("Postingan berhasil dihapus.");
      } catch (error) {
        console.error("Error deleting post: ", error);
        alert("Terjadi kesalahan saat menghapus postingan.");
      }
    }
  };

  const formatTimestamp = (seconds: number) => {
    const date = new Date(seconds * 1000);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('id-ID', { month: 'long' });
    const year = date.getFullYear();
  
    return `${hours}:${minutes}  ·  ${day} ${month} ${year}`;
  };

  useEffect(() => {
    const checkAdmin = async () => {
      if (post.user) {
        const userDocRef = doc(db, "users", post.user); 
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.role === "admin") {
            setIsAdmin(true);
          }
        }
      }
    };

    checkAdmin();
  }, [post.user]);

  return (
    <div className="p-4 my-4 border rounded-lg shadow-md hover:shadow-lg transition duration-200 relative">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {post.isAnonymous ? (
            <div className="w-10 h-10 rounded-full bg-gray-400" />
          ) : (
            <Image
              src={post.profilePicture || "/default-profile.jpg"}
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
                {isAdmin && <MdVerified className="ml-1 text-blue-500" />} 
              </div>
            </Link>

            <div className="relative">
              <SlOptions
                className="cursor-pointer text-gray-300"
                onClick={toggleOptions}
              />
              {showOptions && (
                <div className="absolute right-0 top-6 w-44 space-y-2 bg-white border rounded-lg shadow-lg p-2">
                  {auth.currentUser?.uid === post.user && (
                    <button
                      onClick={handleDelete}
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

          <p className="text-xl text-gray-700 pb-3">{post.content}</p>

          {post.fileURL && post.fileType?.startsWith("image/") && (
            <Image
              src={post.fileURL}
              alt="Post Image"
              width={1920}
              height={1080}
              className="rounded-lg mb-4 w-full h-auto object-cover"
            />
          )}

          {post.fileURL && post.fileType?.startsWith("video/") && (
            <video controls className="w-full mt-4 rounded-lg">
              <source src={post.fileURL} type={post.fileType} />
            </video>
          )}

           {post.timestamp?.seconds && (
              <p className="text-sm text-gray-400">
                {post.timestamp?.seconds ? formatTimestamp(post.timestamp.seconds) : "Waktu tidak tersedia"}
              </p>
            )}

            <div className="flex justify-between items-center border-t my-3 pt-3">
                <Link href={`/ruang-bincang/${post.id}`} className="flex-1 flex justify-center items-center text-gray-400 hover:text-bluetiful">
                    <FaComment size={20} />
                </Link>

                <div className="grow"></div>

                <div className="flex-1 flex justify-center">
                    <Upvote postId={post.id} />
                </div>

                <div className="grow"></div>

                <div className="flex-1 flex justify-center">
                    <Downvote postId={post.id} />
                </div>

                <div className="grow"></div>

                <div className="flex-1 flex justify-center">
                    <BookmarkButton postId={post.id} />
                </div>
            </div>

            <CommentList postId={post.id} />

            <CommentForm postId={post.id} />
        </div>
      </div>

    </div>
  );
};

export default DetailPostClient;
