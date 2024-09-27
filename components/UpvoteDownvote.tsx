"use client";

import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { auth } from "../firebase/firebaseConfig"; 
import { BiSolidLike, BiSolidDislike } from "react-icons/bi";

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
        downvotes: arrayRemove(userId), 
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
        upvotes: arrayRemove(userId), 
      });
      setDownvotes([...downvotes, userId]);
      setUpvotes(upvotes.filter((id) => id !== userId));
    }
  };

  return (
    <div className="flex items-center space-x-2">

      <button
        onClick={handleUpvote}
        className={`p-2 rounded-full flex items-center space-x-1 ${
          upvotes.includes(userId || "") ? "text-blue-500" : "text-gray-400"
        } hover:text-bluetiful`}
        aria-label="Like"
      >
        <BiSolidLike size={24} /> 
        <span>{upvotes.length}</span>
      </button>

      <button
        onClick={handleDownvote}
        className={`p-2 rounded-full flex items-center space-x-1 ${
          downvotes.includes(userId || "") ? "text-red-500" : "text-gray-400"
        } hover:text-bluetiful`}
        aria-label="Dislike"
      >
        <BiSolidDislike size={24} /> 
        <span>{downvotes.length}</span>
      </button>
    </div>
  );
};

export default UpvoteDownvote;
