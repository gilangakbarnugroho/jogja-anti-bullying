"use client";

import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, query, orderBy, limit, onSnapshot, doc, getDoc, getDocs } from "firebase/firestore";
import ReportButton from "./ReportButton";
import UpvoteDownvote from "./UpvoteDownvote";
import BookmarkButton from "./BookmarkButton";
import Image from "next/image";
import Link from "next/link";
import { FaCommentDots } from "react-icons/fa";

interface Comment {
  id: string;
  content: string;
  user: string; 
  timestamp: any;
}

interface UserProfile {
  name: string;
  profilePicture: string;
}

interface PostCommentListProps {
  postId: string; // ID postingan untuk komentar
  setCommentCount?: (count: number) => void; // Optional: Fungsi untuk mengirim jumlah komentar ke parent
}

const PostCommentList: React.FC<PostCommentListProps> = ({ postId, setCommentCount }) => {
  const [comment, setComment] = useState<Comment | null>(null); // Hanya satu komentar yang akan ditampilkan
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Query untuk mengambil satu komentar terbaru
    const q = query(
      collection(db, `posts/${postId}/comments`),
      orderBy("timestamp", "desc"),
      limit(1) // Batasi hanya menampilkan satu komentar
    );

    // Snapshot untuk mengambil data secara real-time
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const comments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Comment[];

      // Ambil hanya komentar pertama atau null
      const firstComment = comments[0] || null;
      setComment(firstComment);
      
      // Jika komentar tersedia, ambil profil user
      if (firstComment) {
        fetchUserProfile(firstComment.user);
      }

      // Hitung jumlah total komentar untuk ditampilkan pada tombol
      const commentCountSnapshot = await getDocs(collection(db, `posts/${postId}/comments`));
      if (setCommentCount) setCommentCount(commentCountSnapshot.size);
    });

    return () => unsubscribe();
  }, [postId, setCommentCount]);

  // Fungsi untuk mengambil profil pengguna berdasarkan userId
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

  return (
    <div className="space-y-4 mt-4">
      {comment ? (
        <div className="p-4 border rounded-lg shadow-sm">
          <div className="flex items-center space-x-3">
            {/* Profil Picture dari user */}
            {userProfile?.profilePicture ? (
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

            {/* Tampilkan nama user sebagai tautan ke profil */}
            <Link href={`/profile/${comment.user}`} className="font-semibold text-bluetiful hover:underline">
              {userProfile?.name || comment.user}
            </Link>
          </div>

          <p className="py-2 text-gray-700">{comment.content}</p>
          <p className="text-xs text-gray-400">
            {/* Pengecekan untuk menghindari error jika timestamp tidak valid */}
            {comment.timestamp?.seconds
              ? new Date(comment.timestamp.seconds * 1000).toLocaleString()
              : "Waktu tidak tersedia"}
          </p>

        </div>
      ) : (
        <p className="text-sm text-gray-500">Belum ada komentar.</p>
      )}

      {/* Tambahkan tautan untuk menampilkan lebih banyak komentar */}
      <Link href={`/ruang-bincang/${postId}`} className="flex items-center text-bluetiful text-sm hover:underline mt-2">
        <FaCommentDots className="mr-1" /> Tampilkan lebih banyak komentar...
      </Link>
    </div>
  );
};

export default PostCommentList;
