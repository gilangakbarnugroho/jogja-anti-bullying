"use client";

import { useState, useEffect, useRef } from "react";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { db, storage, auth } from "../firebase/firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"; 
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserSecret, faImage, faTimes } from "@fortawesome/free-solid-svg-icons";

interface CommentFormProps {
  postId: string;
}

const CommentForm: React.FC<CommentFormProps> = ({ postId }) => {
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            uid: currentUser.uid,
            name: userData.name,
            profilePicture: userData.profilePicture,
            email: currentUser.email,
          });
        } else {
          setUser({
            uid: currentUser.uid,
            name: currentUser.displayName,
            profilePicture: currentUser.photoURL,
            email: currentUser.email,
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const isImage = selectedFile.type.startsWith("image/");
      const isVideo = selectedFile.type.startsWith("video/");

      if (isImage && selectedFile.size > 2 * 1024 * 1024) {
        setFileError("Ukuran maksimal gambar adalah 2MB.");
        setFile(null);
        setPreviewURL(null);
      } else if (isVideo && selectedFile.size > 5 * 1024 * 1024) {
        setFileError("Ukuran maksimal video adalah 5MB.");
        setFile(null);
        setPreviewURL(null);
      } else {
        setFileError(null);
        setFile(selectedFile);
        setPreviewURL(URL.createObjectURL(selectedFile));
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewURL(null);
  };

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const toggleAnonymous = () => {
    setIsAnonymous(!isAnonymous);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!user && !isAnonymous) {
      setFileError("Anda harus login untuk berkomentar.");
      setLoading(false);
      return;
    }

    if (content.trim() === "" && !file) {
      setFileError("Isi komentar atau unggah file.");
      setLoading(false);
      return;
    }

    try {
      let fileURL = null;
      if (file) {
        const storageRef = ref(storage, `comments/${file.name}_${Date.now()}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => reject(error),
            async () => {
              fileURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(true);
            }
          );
        });
      }

      await addDoc(collection(db, `posts/${postId}/comments`), {
        content,
        fileURL,
        fileType: file ? file.type : null,
        user: isAnonymous ? "anon" : user.uid,
        name: isAnonymous ? "Anonim" : user.name,
        profilePicture: isAnonymous ? "" : user.profilePicture,
        isAnonymous,
        timestamp: serverTimestamp(),
      });

      setContent("");
      setFile(null);
      setPreviewURL(null);
      router.refresh();
    } catch (err) {
      console.error("Error adding comment: ", err);
      setFileError("Terjadi kesalahan saat menambahkan komentar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 my-4">
      <div className="flex items-center space-x-3">
        {isAnonymous ? (
          <div className="w-5 h-5 rounded-full bg-gray-400" />
        ) : (
          user?.profilePicture && (
            <Image
              src={user.profilePicture}
              alt={`${user.name}'s profile picture`}
              width={30}
              height={30}
              className="rounded-full"
            />
          )
        )}
        <h3 className="text-md text-gray-500 font-semibold">
          {isAnonymous ? "Anonim" : user?.name || "Pengguna"}
        </h3>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
        placeholder="Tambahkan komentar Anda..."
      ></textarea>

      <input
        type="file"
        accept="image/*,video/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {previewURL && (
        <div className="relative">
          {file?.type.startsWith("image/") ? (
            <Image src={previewURL} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
          ) : (
            <video className="w-32 h-32 rounded-lg" controls>
              <source src={previewURL} />
            </video>
          )}
          <button
            type="button"
            onClick={handleRemoveFile}
            className="absolute top-0 right-0 bg-red-700 text-white rounded-full p-1"
          >
            <FontAwesomeIcon icon={faTimes} size="sm" />
          </button>
        </div>
      )}

      <div className="flex items-center space-x-3">
        <div
          className="group flex items-center bg-white shadow-sm rounded-lg p-2 space-x-2 cursor-pointer hover:bg-bluetiful"
          onClick={handleIconClick}
        >
          <FontAwesomeIcon
            icon={faImage}
            size="lg"
            className="text-bluetiful group-hover:text-white transition"
          />
          <span className="hidden md:flex text-gray-700 group-hover:text-white text-sm">
            {file ? file.name : "Pilih file (gambar/video)"}
          </span>
        </div>

        {fileError && <p className="text-red-500">{fileError}</p>}

        <div
          className="group flex items-center bg-white shadow-sm rounded-lg p-2 space-x-2 cursor-pointer hover:bg-bluetiful"
          onClick={toggleAnonymous}
        >
          <FontAwesomeIcon
            icon={isAnonymous ? faUserSecret : faUser}
            size="lg"
            className={`transition ${isAnonymous ? "text-red-700 group-hover:text-white" : "text-bluetiful group-hover:text-white"}`}
          />
          <span className={`hidden md:flex text-sm transition ${isAnonymous ? "text-red-700 group-hover:text-white" : "text-gray-700 group-hover:text-white"}`}>
            {isAnonymous ? "Anonim" : "Nama Terlihat"}
          </span>
        </div>

        <div className="grow"></div>

        <button
          type="submit"
          className="self-end px-6 py-2 btn-bluetiful transition duration-200 disabled:bg-gray-300"
          disabled={loading}
        >
          {loading ? "Mengirim..." : "Kirim"}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
