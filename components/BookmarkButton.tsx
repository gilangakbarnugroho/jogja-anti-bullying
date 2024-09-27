"use client";

import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { auth } from "../firebase/firebaseConfig";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";

interface BookmarkButtonProps {
  postId: string;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ postId }) => {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const checkIfBookmarked = async () => {
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        const bookmarkRef = doc(db, `users/${userId}/bookmarks/${postId}`);
        const bookmarkDoc = await getDoc(bookmarkRef);
        if (bookmarkDoc.exists()) {
          setBookmarked(true);
        }
      }
    };
    checkIfBookmarked();
  }, [postId]);

  const handleBookmark = async () => {
    if (!auth.currentUser) {
      alert("Anda harus login untuk menyimpan postingan.");
      return;
    }

    const userId = auth.currentUser.uid;
    const bookmarkRef = doc(db, `users/${userId}/bookmarks/${postId}`);

    if (bookmarked) {
      // Jika sudah dibookmark, hapus bookmark
      await deleteDoc(bookmarkRef);
      setBookmarked(false);
    } else {
      // Jika belum dibookmark, tambahkan bookmark
      await setDoc(bookmarkRef, {
        postId,
        timestamp: new Date(),
      });
      setBookmarked(true);
    }
  };

  return (
    <button onClick={handleBookmark} className="flex items-center space-x-1">
      {bookmarked ? (
        <BsBookmarkFill size={20} className="text-yellow-500" />
      ) : (
        <BsBookmark size={20} className="text-gray-500" />
      )}
      <span>{bookmarked ? "Tersimpan" : "Simpan"}</span>
    </button>
  );
};

export default BookmarkButton;
