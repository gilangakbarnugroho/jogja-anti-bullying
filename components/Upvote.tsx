"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { BiSolidLike } from "react-icons/bi";

interface UpvoteProps {
  postId: string;
}

const Upvote: React.FC<UpvoteProps> = ({ postId }) => {
  const [upvotes, setUpvotes] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVotes = async () => {
      const postRef = doc(db, `posts/${postId}`);
      const postDoc = await getDoc(postRef);
      if (postDoc.exists()) {
        setUpvotes(postDoc.data().upvotes || []); 
      }
    };

    if (auth.currentUser) {
      setUserId(auth.currentUser.uid);
    }

    fetchVotes();
  }, [postId]);

  const handleUpvote = async () => {
    if (!userId || loading) return;

    setLoading(true);
    const postRef = doc(db, `posts/${postId}`);

    try {
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
      }
    } catch (error) {
      console.error("Error upvoting:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleUpvote}
      className={`p-2 rounded-full flex items-center space-x-1 ${
        upvotes.includes(userId || "") ? "text-blue-500" : "text-gray-400"
      } hover:text-bluetiful`}
      aria-label="Like"
      disabled={loading}
    >
      <BiSolidLike size={16} />
      <span>{upvotes.length}</span>
    </button>
  );
};

export default Upvote;
