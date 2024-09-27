"use client";

import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { auth } from "../firebase/firebaseConfig"; // Untuk mendapatkan user yang login

interface UpvoteDownvoteProps {
  postId: string;
  isAnswer?: boolean;
}

const UpvoteDownvote: React.FC<UpvoteDownvoteProps> = ({ postId, isAnswer = false }) => {
  const [upvotes, setUpvotes] = useState<string[]>([]);
  const [downvotes, setDownvotes] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchVotes = async () => {
      const postRef = doc(db, isAnswer ? `posts/${postId}/answers/${postId}` : `posts/${postId}`);
      const postDoc = await getDoc(postRef);
      if (postDoc.exists()) {
        setUpvotes(postDoc.data().upvotes || []);
        setDownvotes(postDoc.data().downvotes || []);
      }
    };

    if (auth.currentUser) {
      setUserId(auth.currentUser.uid);
    }
    fetchVotes();
  }, [postId, isAnswer]);

  const handleUpvote = async () => {
    if (!userId) return;
    const postRef = doc(db, isAnswer ? `posts/${postId}/answers/${postId}` : `posts/${postId}`);
    
    if (upvotes.includes(userId)) {
      await updateDoc(postRef, {
        upvotes: arrayRemove(userId),
      });
      setUpvotes(upvotes.filter((id) => id !== userId));
    } else {
      await updateDoc(postRef, {
        upvotes: arrayUnion(userId),
        downvotes: arrayRemove(userId), // Hapus dari downvote jika ada
      });
      setUpvotes([...upvotes, userId]);
      setDownvotes(downvotes.filter((id) => id !== userId));
    }
  };

  const handleDownvote = async () => {
    if (!userId) return;
    const postRef = doc(db, isAnswer ? `posts/${postId}/answers/${postId}` : `posts/${postId}`);
    
    if (downvotes.includes(userId)) {
      await updateDoc(postRef, {
        downvotes: arrayRemove(userId),
      });
      setDownvotes(downvotes.filter((id) => id !== userId));
    } else {
      await updateDoc(postRef, {
        downvotes: arrayUnion(userId),
        upvotes: arrayRemove(userId), // Hapus dari upvote jika ada
      });
      setDownvotes([...downvotes, userId]);
      setUpvotes(upvotes.filter((id) => id !== userId));
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button onClick={handleUpvote} className={`p-2 ${upvotes.includes(userId || "") ? "text-blue-500" : "text-gray-400"}`}>
        Upvote ({upvotes.length})
      </button>
      <button onClick={handleDownvote} className={`p-2 ${downvotes.includes(userId || "") ? "text-red-500" : "text-gray-400"}`}>
        Downvote ({downvotes.length})
      </button>
    </div>
  );
};

export default UpvoteDownvote;
