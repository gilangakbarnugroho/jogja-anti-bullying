import React, { useState, useEffect } from "react";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import Link from "next/link";
import Image from "next/image";
import { db } from "../firebase/firebaseConfig";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { auth } from "../firebase/firebaseConfig";

interface PostCardProps {
  id: string;
  title: string;
  content: string;
  category?: string;
  imageUrl: string;
  createdAt: number;
  likes: number;
  onDelete?: () => Promise<void>;
  isAdmin: boolean;
}

const timeSince = (seconds: number) => {
  const now = Date.now() / 1000;
  const timeDifference = now - seconds;

  const minutesPassed = Math.floor(timeDifference / 60);
  const hoursPassed = Math.floor(timeDifference / 3600);
  const daysPassed = Math.floor(hoursPassed / 24);

  if (minutesPassed < 60) {
    return `${minutesPassed} menit yang lalu`;
  } else if (hoursPassed < 24) {
    return `${hoursPassed} jam yang lalu`;
  } else {
    return `${daysPassed} hari yang lalu`;
  }
};

const truncateContent = (content: string, wordLimit: number) => {
  const words = content.split(" ");
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(" ") + "...";
  }
  return content;
};

const PostCard: React.FC<PostCardProps> = ({
  id,
  title,
  content,
  category,
  imageUrl,
  createdAt,
  likes,
  onDelete,
  isAdmin,
}) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const placeholderImage = "https://via.placeholder.com/400";

  useEffect(() => {
    const fetchLikeStatus = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const postRef = doc(db, "gelarPosts", id);
      const postSnap = await getDoc(postRef);

      if (postSnap.exists() && postSnap.data().likedBy?.includes(user.uid)) {
        setLiked(true);
      }
    };

    fetchLikeStatus();
  }, [id]);

  const handleLike = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Anda harus login untuk memberikan like.");
      return;
    }

    const postRef = doc(db, "gelarPosts", id);

    if (liked) {
      await updateDoc(postRef, {
        likedBy: arrayRemove(user.uid),
        likes: likeCount - 1,
      });
      setLikeCount((prev) => prev - 1);
      setLiked(false);
    } else {
      await updateDoc(postRef, {
        likedBy: arrayUnion(user.uid),
        likes: likeCount + 1,
      });
      setLikeCount((prev) => prev + 1);
      setLiked(true);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative w-full h-80">
        <Image
          src={imageUrl || placeholderImage}
          alt={`Image for ${title}`}
          layout="fill"
          objectFit="cover"
          placeholder="blur"
          blurDataURL={placeholderImage}
          className="rounded-t-lg "
        />
      </div>
      <div className="p-4">
        {category && (
          <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs mb-2 inline-block">
            {category}
          </span>
        )}

        <Link href={`/gelar/${id}`} className="hover:underline">
          <h2 className="font-bold text-xl text-bluetiful mb-2">{title}</h2>
        </Link>

        <p className="text-gray-600 text-sm mb-4">{truncateContent(content, 50)}</p>

        <p className="text-gray-400 text-xs">{timeSince(createdAt)}</p>

        <div className="flex items-center space-x-4 mt-4">
          <button
            className={`flex items-center space-x-1 ${
              liked ? "text-blue-500" : "text-gray-500"
            }`}
            onClick={handleLike}
          >
            {liked ? <AiFillLike size={20} /> : <AiOutlineLike size={20} />}
            <span>{likeCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
