"use client";

import { useState, useEffect } from 'react';
import { auth, db, functions } from '../firebase/firebaseConfig';
import { httpsCallable } from 'firebase/functions';
import { doc, getDoc } from 'firebase/firestore';
import { BiSolidDislike } from 'react-icons/bi';

interface DownvoteProps {
  postId: string;  // Explicitly define the type of postId as string
}

const Downvote: React.FC<DownvoteProps> = ({ postId }) => {
  const [downvotes, setDownvotes] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVotes = async () => {
      const postRef = doc(db, `posts/${postId}`);
      const postDoc = await getDoc(postRef);
      if (postDoc.exists()) {
        setDownvotes(postDoc.data().downvotes || []);
      }
    };

    if (auth.currentUser) {
      setUserId(auth.currentUser.uid);
    }
    fetchVotes();
  }, [postId]);

  const handleDownvote = async () => {
    if (!userId || loading) return;

    setLoading(true);
    const votePost = httpsCallable(functions, 'votePost');

    try {
      await votePost({ postId, voteType: 'downvote' });
      if (downvotes.includes(userId)) {
        setDownvotes(downvotes.filter(id => id !== userId));
      } else {
        setDownvotes([...downvotes, userId]);
      }
    } catch (error) {
      console.error('Error voting:', error);
      alert('Gagal melakukan voting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownvote}
      className={`p-2 rounded-full flex items-center space-x-1 ${downvotes.includes(userId || '') ? 'text-red-500' : 'text-gray-400'} hover:text-bluetiful`}
      aria-label="Dislike"
      disabled={loading}
    >
      <BiSolidDislike size={16} />
      <span>{downvotes.length}</span>
    </button>
  );
};

export default Downvote;
