"use client";

import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, query, orderBy, limit, onSnapshot, doc, getDoc, getDocs } from "firebase/firestore";
import ReportButton from "./ReportButton";
import UpvoteDownvote from "./Upvote";
import BookmarkButton from "./BookmarkButton";
import Image from "next/image";
import Link from "next/link";
import { FaCommentDots } from "react-icons/fa";

interface Comment {
  id: string;
  content: string;
  user: string;
  isAnonymous: boolean; // Tambahkan field isAnonymous
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
  const [commentCount, setLocalCommentCount] = useState(0); // Untuk menyimpan jumlah komentar lokal

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

      const firstComment = comments[0] || null;
      setComment(firstComment);

      // Jika komentar tersedia dan bukan anonim, ambil profil user
      if (firstComment && !firstComment.isAnonymous) {
        fetchUserProfile(firstComment.user);
      }

      // Hitung jumlah total komentar untuk ditampilkan pada tombol
      const commentCountSnapshot = await getDocs(collection(db, `posts/${postId}/comments`));
      const count = commentCountSnapshot.size;
      setLocalCommentCount(count);
      if (setCommentCount) setCommentCount(count);
    });

    return () => unsubscribe();
  }, [postId, setCommentCount]);

  // Fungsi untuk mengambil profil pengguna berdasarkan userId jika komentar tidak anonim
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
            {/* Jika komentar anonim, tampilkan gambar dan nama default */}
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

            {/* Tampilkan nama user atau Anonim */}
            {comment.isAnonymous ? (
              <div className="font-semibold text-gray-600"></div>
            ) : (
              <Link href={`/profile/${comment.user}`} className="font-semibold text-bluetiful hover:underline">
                {userProfile?.name || comment.user}
              </Link>
            )}
          </div>

          <p className="py-2 text-gray-700">{comment.content}</p>
          <p className="text-xs text-gray-400">
            {comment.timestamp?.seconds
              ? new Date(comment.timestamp.seconds * 1000).toLocaleString()
              : "Waktu tidak tersedia"}
          </p>
        </div>
      ) : (
        <p className="text-sm text-gray-500 text-center">Belum ada komentar.</p>
      )}

      {/* Tampilkan tautan hanya jika ada lebih dari satu komentar */}
      {commentCount > 0 && (
        <Link href={`/ruang-bincang/${postId}`} className="flex  items-center text-bluetiful text-sm hover:underline mt-2">
          <FaCommentDots className="mr-1" /> Tampilkan lebih banyak komentar...
        </Link>
      )}
    </div>
  );
};

export default PostCommentList;
