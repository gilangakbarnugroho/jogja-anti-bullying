"use client";

import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import ReportButton from "./ReportButton";

interface Comment {
  id: string;
  content: string;
  user: string;
  timestamp: any;
}

interface CommentListProps {
  postId: string; 
}

const CommentList: React.FC<CommentListProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);

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
    });

    return () => unsubscribe();
  }, [postId]);

  return (
    <div className="space-y-4 mt-4">
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} className="p-2 border rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">{comment.user}</p>
            <p>{comment.content}</p>
            <p className="text-xs text-gray-400">
              {new Date(comment.timestamp.seconds * 1000).toLocaleString()}
            </p>

            {/* Tombol Lapor untuk Komentar */}
            <ReportButton postId={comment.id} contentType="comment" />

          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">Belum ada komentar.</p>
      )}
    </div>
  );
};

export default CommentList;
