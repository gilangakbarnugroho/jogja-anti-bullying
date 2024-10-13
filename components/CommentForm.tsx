"use client";

import { useState, useEffect, useRef } from "react";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { db, storage, auth } from "../firebase/firebaseConfig"; // Tambahkan storage
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"; // Firebase storage functions
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserSecret, faImage, faTimes } from "@fortawesome/free-solid-svg-icons"; // Tambahkan faTimes untuk menghapus pratinjau

interface CommentFormProps {
  postId: string; // ID post untuk menambahkan komentar
}

const CommentForm: React.FC<CommentFormProps> = ({ postId }) => {
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false); // State untuk memilih anonim
  const [file, setFile] = useState<File | null>(null); // State untuk file gambar/video
  const [fileError, setFileError] = useState<string | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null); // Pratinjau file
  const [user, setUser] = useState<any>(null); // Simpan informasi user
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Ref untuk file input
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
        // Gambar melebihi 2MB
        setFileError("Ukuran maksimal gambar adalah 2MB.");
        setFile(null);
        setPreviewURL(null); // Hapus pratinjau jika file tidak valid
      } else if (isVideo && selectedFile.size > 5 * 1024 * 1024) {
        // Video melebihi 5MB
        setFileError("Ukuran maksimal video adalah 5MB.");
        setFile(null);
        setPreviewURL(null); // Hapus pratinjau jika file tidak valid
      } else {
        setFileError(null);
        setFile(selectedFile); // Set file jika valid
        setPreviewURL(URL.createObjectURL(selectedFile)); // Tampilkan pratinjau file
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewURL(null); // Hapus pratinjau file
  };

  const handleIconClick = () => {
    // Simulasikan klik input file ketika ikon diklik
    fileInputRef.current?.click();
  };

  const toggleAnonymous = () => {
    setIsAnonymous(!isAnonymous); // Toggle status anonim
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
        // Unggah file ke Firebase Storage
        const storageRef = ref(storage, `comments/${file.name}_${Date.now()}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        // Tunggu hingga file selesai diunggah
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

      // Simpan komentar ke Firestore
      await addDoc(collection(db, `posts/${postId}/comments`), {
        content,
        fileURL, // URL file yang diunggah (gambar/video)
        fileType: file ? file.type : null, // Jenis file (image/video)
        user: isAnonymous ? "anon" : user.uid, // Gunakan UID atau anon
        name: isAnonymous ? "Anonim" : user.name, // Gunakan "Anonim" jika anonim
        profilePicture: isAnonymous ? "" : user.profilePicture, // Kosongkan jika anonim
        isAnonymous, // Tambahkan flag anonim
        timestamp: serverTimestamp(),
      });

      setContent("");
      setFile(null); // Reset file
      setPreviewURL(null); // Reset pratinjau file
      setError(null);
      router.refresh(); // Refresh halaman
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

      {/* Input file yang disembunyikan */}
      <input
        type="file"
        accept="image/*,video/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Pratinjau Gambar/Video */}
      {previewURL && (
        <div className="relative">
          {file?.type.startsWith("image/") ? (
            <img
              src={previewURL}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg"
            />
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

      {/* Ikon untuk menggantikan tombol input file */}
      <div className="flex items-center space-x-3">
        <div
          className="flex items-center bg-white shadow-sm rounded-lg p-2 space-x-2 cursor-pointer"
          onClick={handleIconClick}
        >
          <FontAwesomeIcon
            icon={faImage}
            size="lg"
            className="cursor-pointer text-bluetiful hover:text-blue-800"
          />
          <span className="hidden md:flex text-gray-700 text-sm">{file ? file.name : "Pilih file (gambar/video)"}</span>
        </div>

        {fileError && <p className="text-red-500">{fileError}</p>}

        {/* Ikon anonim atau tidak anonim */}
        <div
          className="flex items-center bg-white shadow-sm rounded-lg p-2 space-x-2 cursor-pointer"
          onClick={toggleAnonymous}
        >
          <FontAwesomeIcon
            icon={isAnonymous ? faUserSecret : faUser} 
            size="lg"
            className={isAnonymous ? "text-red-700" : "text-bluetiful"} 
          />
          <span className={isAnonymous ? "hidden md:flex text-red-700 text-sm" : "hidden md:flex text-gray-700 text-sm"}>
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
