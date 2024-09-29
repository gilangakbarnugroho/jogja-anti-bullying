import React from "react";
import { AiFillLike, AiOutlineLike, AiOutlineEye } from "react-icons/ai";
import Link from "next/link"; 

interface PostCardProps {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  likes: number;
  onDelete: () => void;
  isAdmin: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
  id,
  title,
  content,
  imageUrl,
  createdAt,
  likes,
  onDelete,
  isAdmin,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img src={imageUrl} alt="Post Image" className="w-full h-48 object-cover" />
      <div className="p-4">
        {/* <div className="space-x-2 mb-2">
          <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">NEW POST</span>
          <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">ARTICLE</span>
        </div> */}
        
        <Link href={`/gelar/${id}`} className="hover:underline">
          <h2 className="font-bold text-xl text-bluetiful mb-2">{title}</h2>
        </Link>
        <p className="text-gray-600 text-sm mb-4">{content}</p>
        <p className="text-gray-400 text-xs">{createdAt}</p>

        {/* Bagian Like dan Views */}
        <div className="flex items-center space-x-4 mt-4">
          <div className="flex items-center space-x-1 text-gray-500">
            <AiOutlineLike size={20} />
            <span>{likes}</span>
          </div>
        </div>

        {/* Hanya Tampilkan Tombol Hapus jika Admin */}
        {isAdmin && (
          <button
            onClick={onDelete}
            className="mt-4 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Hapus
          </button>
        )}
      </div>
    </div>
  );
};

export default PostCard;
