"use client";

import { useState, useRef } from "react";
import { db, storage, auth } from "../firebase/firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faUser, faUserSecret, faTimes } from "@fortawesome/free-solid-svg-icons";

const NewPostForm = () => {
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

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

    if (!auth.currentUser && !isAnonymous) {
      setFileError("Anda harus login untuk membuat postingan.");
      setLoading(false);
      return;
    }

    if (content.trim() === "" && !file) {
      setFileError("Isi postingan atau unggah file.");
      setLoading(false);
      return;
    }

    try {
      let fileURL = null;
      if (file) {
        const storageRef = ref(storage, `uploads/${file.name}_${Date.now()}`);
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

      await addDoc(collection(db, "posts"), {
        content,
        fileURL,
        fileType: file ? file.type : null,
        user: isAnonymous ? "anon" : auth.currentUser?.uid,
        name: isAnonymous ? "Anonim" : auth.currentUser?.displayName,
        profilePicture: isAnonymous ? "" : auth.currentUser?.photoURL || "",
        isAnonymous,
        timestamp: serverTimestamp(),
      });

      setContent("");
      setFile(null);
      setPreviewURL(null);
      router.push("/ruang-bincang");
    } catch (error) {
      console.error("Error posting: ", error);
      setFileError("Terjadi kesalahan saat membuat postingan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 my-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
        placeholder="Apa yang sedang ada di pikiranmu..."
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
            <img src={previewURL} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
          ) : (
            <video className="w-32 h-32 rounded-lg" controls>
              <source src={previewURL} />
            </video>
          )}
          <button
            type="button"
            onClick={handleRemoveFile}
            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
          >
            <FontAwesomeIcon icon={faTimes} size="sm" />
          </button>
        </div>
      )}

      <div className="flex space-x-3">
        <div className="group flex items-center bg-white hover:bg-bluetiful shadow-sm rounded-lg p-2 space-x-3 cursor-pointer" onClick={handleIconClick}>
          <FontAwesomeIcon
            icon={faImage}
            size="xl"
            className="text-bluetiful group-hover:text-white transition"
          />
          <span className="hidden text-gray-400 md:flex group-hover:text-white">
            {file ? file.name : "Pilih file (gambar/video)"}
          </span>
        </div>

        <div className="group flex items-center bg-white hover:bg-bluetiful shadow-sm rounded-lg p-2 space-x-2 cursor-pointer" onClick={toggleAnonymous}>
          <FontAwesomeIcon
            icon={isAnonymous ? faUserSecret : faUser}
            size="xl"
            className={`transition ${isAnonymous ? "text-red-700 group-hover:text-white" : "text-bluetiful group-hover:text-white"}`}
          />
          <span className={`hidden md:flex transition ${isAnonymous ? "text-red-700 group-hover:text-white" : "text-gray-400 group-hover:text-white"}`}>
            {isAnonymous ? "Anonim" : "Nama Terlihat"}
          </span>
        </div>

        {fileError && <p className="text-red-500">{fileError}</p>}

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

export default NewPostForm;
