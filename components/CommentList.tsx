"use client";

import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, query, orderBy, onSnapshot, doc, getDoc } from "firebase/firestore";
import ReportButton from "./ReportButton";
import UpvoteDownvote from "./UpvoteDownvote";
import BookmarkButton from "./BookmarkButton";
import Image from "next/image";
import Link from "next/link";

interface Comment {
  id: string;
  content: string;
  user: string; // Menyimpan userId dari Firestore, bukan email
  isAnonymous: boolean; // Field isAnonymous untuk cek apakah komentar anonim
  timestamp: any;
}

interface UserProfile {
  name: string;
  profilePicture: string;
}

interface CommentListProps {
  postId: string; // ID postingan untuk komentar
}

const CommentList: React.FC<CommentListProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [userProfiles, setUserProfiles] = useState<{ [key: string]: UserProfile }>({});

  useEffect(() => {
    const q = query(
      collection(db, `posts/${postId}/comments`),
      orderBy("timestamp", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Comment[];

      setComments(commentData);
      fetchUserProfiles(commentData); // Ambil data profil user dari komentar
    });

    return () => unsubscribe();
  }, [postId]);

  const fetchUserProfiles = async (comments: Comment[]) => {
    const userIds = comments.map((comment) => comment.user);
    const uniqueUserIds = Array.from(new Set(userIds)); // Hapus ID yang duplikat

    const newProfiles: { [key: string]: UserProfile } = {};
    for (const userId of uniqueUserIds) {
      if (!userId) continue;

      try {
        const userDocRef = doc(db, "users", userId); // Ambil dari users collection dengan userId
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          newProfiles[userId] = userDoc.data() as UserProfile;
        }
      } catch (error) {
        console.error("Error fetching user profile: ", error);
      }
    }

    setUserProfiles((prevProfiles) => ({
      ...prevProfiles,
      ...newProfiles,
    }));
  };

  return (
    <div className="space-y-4 mt-4">
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} className="p-4 border rounded-lg shadow-sm">
            <div className="flex items-center space-x-3">
              {/* Profil Picture dari user */}
              {comment.isAnonymous ? (
                <div className="w-7 h-7 rounded-full bg-gray-400" />
              ) : userProfiles[comment.user]?.profilePicture ? (
                <Image
                  src={userProfiles[comment.user]?.profilePicture}
                  alt={`${userProfiles[comment.user]?.name}'s profile picture`}
                  width={30}
                  height={30}
                  className="rounded-full"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gray-200" />
              )}

              {/* Tampilkan nama user atau Anonim */}
              {comment.isAnonymous ? (
                <div className="font-semibold text-gray-600">Anonim</div>
              ) : (
                <Link href={`/profile/${comment.user}`} className="font-semibold text-bluetiful hover:underline">
                  {userProfiles[comment.user]?.name || comment.user}
                </Link>
              )}
            </div>

            <p className="py-2 text-gray-700">{comment.content}</p>
            <p className="text-xs text-gray-400">
              {comment.timestamp && comment.timestamp.seconds ? (
                new Date(comment.timestamp.seconds * 1000).toLocaleString()
              ) : (
                "Waktu tidak tersedia"
              )}
            </p>

            {/* Tombol Lapor untuk Komentar */}
            <div className="flex items-center space-x-4 mt-2">
              <UpvoteDownvote postId={comment.id} isAnswer={true} /> {/* Upvote/Downvote untuk Komentar */}
              <BookmarkButton postId={comment.id} /> {/* Bookmark Komentar */}
              <ReportButton postId={comment.id} contentType="comment" /> {/* Report Komentar */}
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">Belum ada komentar.</p>
      )}
    </div>
  );
};

export default CommentList;
