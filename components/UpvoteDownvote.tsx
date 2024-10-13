import { useState, useEffect } from 'react';
import { auth, db, functions } from '../firebase/firebaseConfig'; 
import { httpsCallable } from 'firebase/functions';
import { doc, getDoc } from 'firebase/firestore';
import { BiSolidLike, BiSolidDislike } from 'react-icons/bi';

const UpvoteDownvote = ({ postId }) => {
  const [upvotes, setUpvotes] = useState<string[]>([]);
  const [downvotes, setDownvotes] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVotes = async () => {
      const postRef = doc(db, `posts/${postId}`);
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
  }, [postId]);

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    if (!userId || loading) return;

    setLoading(true);
    const votePost = httpsCallable(functions, 'votePost'); 

    try {
      await votePost({ postId, voteType });
      // Update local state based on voteType
      if (voteType === 'upvote') {
        if (upvotes.includes(userId)) {
          setUpvotes(upvotes.filter(id => id !== userId));
        } else {
          setUpvotes([...upvotes, userId]);
          setDownvotes(downvotes.filter(id => id !== userId)); 
        }
      } else {
        if (downvotes.includes(userId)) {
          setDownvotes(downvotes.filter(id => id !== userId));
        } else {
          setDownvotes([...downvotes, userId]);
          setUpvotes(upvotes.filter(id => id !== userId)); 
        }
      }
    } catch (error) {
      console.error("Error voting:", error);
      alert("Gagal melakukan voting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Upvote Button */}
      <button
        onClick={() => handleVote('upvote')}
        className={`p-2 rounded-full flex items-center space-x-1 ${
          upvotes.includes(userId || "") ? "text-blue-500" : "text-gray-400"
        } hover:text-bluetiful`}
        aria-label="Like"
        disabled={loading} 
      >
        <BiSolidLike size={16} />
        <span>{upvotes.length}</span>
      </button>

      {/* Downvote Button */}
      <button
        onClick={() => handleVote('downvote')}
        className={`p-2 rounded-full flex items-center space-x-1 ${
          downvotes.includes(userId || "") ? "text-red-500" : "text-gray-400"
        } hover:text-bluetiful`}
        aria-label="Dislike"
        disabled={loading} 
      >
        <BiSolidDislike size={16} />
        <span>{downvotes.length}</span>
      </button>
    </div>
  );
};

export default UpvoteDownvote;
