"use client";

import { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebaseConfig";
import { collection, query, orderBy, limit, onSnapshot, doc, getDoc, deleteDoc, getDocs } from "firebase/firestore";
import ReportButton from "./ReportButton";
import Upvote from "./Upvote";
import Downvote from "./Downvote";
import BookmarkButton from "./BookmarkButton";
import Image from "next/image";
import Link from "next/link";
import { FaCommentDots } from "react-icons/fa";
import { SlOptions } from "react-icons/sl";

interface Comment {
  id: string;
  content: string;
  user: string;
  isAnonymous: boolean;
  fileURL?: string;
  fileType?: string;
  timestamp: any;
}

interface UserProfile {
  name: string;
  profilePicture: string;
}

interface PostCommentListProps {
  postId: string;
  setCommentCount?: (count: number) => void;
}

const PostCommentList: React.FC<PostCommentListProps> = ({ postId, setCommentCount }) => {
  const [comment, setComment] = useState<Comment | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [commentCount, setLocalCommentCount] = useState(0);
  const [showOptions, setShowOptions] = useState(false); 

  useEffect(() => {
    const q = query(
      collection(db, `posts/${postId}/comments`),
      orderBy("timestamp", "desc"),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const comments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Comment[];

      const firstComment = comments[0] || null;
      setComment(firstComment);

      if (firstComment && !firstComment.isAnonymous) {
        fetchUserProfile(firstComment.user);
      }

      const commentCountSnapshot = await getDocs(collection(db, `posts/${postId}/comments`));
      const count = commentCountSnapshot.size;
      setLocalCommentCount(count);
      if (setCommentCount) setCommentCount(count);
    });

    return () => unsubscribe();
  }, [postId, setCommentCount]);

  const fetchUserProfile = async (userId: string) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setUserProfile(userDoc.data() as UserProfile);
      }
    } catch (error) {
      console.error("Error fetching user profile: ", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const confirmed = window.confirm("Apakah Anda yakin ingin menghapus komentar ini?");
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, `posts/${postId}/comments`, commentId));
      alert("Komentar berhasil dihapus.");
      setComment(null); 
    } catch (error) {
      console.error("Error deleting comment: ", error);
    }
  };

  return (
    <div className="space-y-4 mt-4">
      {comment ? (
        <div className="p-4 border rounded-lg shadow-sm relative">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              {comment.isAnonymous ? (
                <>
                  <div className="w-7 h-7 rounded-full bg-gray-400" />
                  <div className="font-semibold text-gray-600">Anonim</div>
                </>
              ) : userProfile?.profilePicture ? (
                <Image
                  src={userProfile.profilePicture}
                  alt={`${userProfile.name}'s profile picture`}
                  width={30}
                  height={30}
                  className="rounded-full"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gray-200" />
              )}

              {comment.isAnonymous ? (
                <div className="font-semibold text-gray-600"></div>
              ) : (
                <Link href={`/profile/${comment.user}`} className="font-semibold text-bluetiful hover:underline">
                  {userProfile?.name || comment.user}
                </Link>
              )}
            </div>

            <div className="relative">
              <SlOptions
                className="cursor-pointer text-gray-300"
                onClick={() => setShowOptions(!showOptions)}
              />
              {showOptions && (
                <div className="absolute right-0 top-6 w-44 space-y-2 bg-white border rounded-lg shadow-lg p-2">
                  {auth.currentUser?.uid === comment.user && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-500 hover:text-red-700 border-b p-2"
                    >
                      Hapus Komentar
                    </button>
                  )}
                  <ReportButton postId={comment.id} contentType="comment" />
                </div>
              )}
            </div>
          </div>

          <p className="py-2 text-gray-700">{comment.content}</p>

          {comment.fileURL && comment.fileType?.startsWith("image/") && (
            <Image
              src={comment.fileURL}
              alt="Comment Image"
              width={500}
              height={300}
              className="rounded-lg mb-4 mx-auto block"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          )}
          {comment.fileURL && comment.fileType?.startsWith("video/") && (
            <video controls className="w-full max-w-lg mt-4 rounded-lg mx-auto block">
              <source src={comment.fileURL} type={comment.fileType} />
            </video>
          )}

          <p className="text-xs text-gray-400">
            {comment.timestamp?.seconds
              ? new Date(comment.timestamp.seconds * 1000).toLocaleString()
              : "Waktu tidak tersedia"}
          </p>

          <div className="flex space-x-3 items-center mt-2">
            <Upvote postId={comment.id} />
            <Downvote postId={comment.id} />
            <BookmarkButton postId={comment.id} />
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500 text-center">Belum ada komentar.</p>
      )}

      {commentCount > 0 && (
        <Link href={`/ruang-bincang/${postId}`} className="flex items-center text-bluetiful text-sm hover:underline mt-2">
          <FaCommentDots className="mr-1" /> Tampilkan lebih banyak komentar...
        </Link>
      )}
    </div>
  );
};

export default PostCommentList;
