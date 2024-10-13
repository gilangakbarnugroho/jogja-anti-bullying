"use client";

import { useEffect, useState } from "react";
import { auth, db, storage } from "../../../../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import Image from "next/image";

const EditProfilePage = () => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null); // Menggunakan file untuk gambar
  const [preview, setPreview] = useState<string | null>(null); // Preview gambar yang diunggah
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = auth.currentUser?.uid;
      if (userId) {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setName(userData.name || "");
          setBio(userData.bio || "");
          setPreview(userData.profilePicture || ""); // Menggunakan URL gambar untuk preview awal
        }
      } else {
        router.push("/login");
      }
    };

    fetchProfile();
  }, [router]);

  const uploadProfilePicture = async (file: File) => {
    if (!auth.currentUser) return;

    const storageRef = ref(storage, `profilePictures/${auth.currentUser.uid}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const userId = auth.currentUser?.uid;
    if (userId) {
      let photoURL = preview;

      // Jika ada gambar baru, upload ke Firebase Storage
      if (profilePicture) {
        photoURL = await uploadProfilePicture(profilePicture);
      }

      // Update profil di Firestore
      await updateDoc(doc(db, "users", userId), {
        name,
        bio,
        profilePicture: photoURL,
      });

      setLoading(false);
      router.push(`/profile/${userId}`); // Redirect kembali ke halaman profil
    }
  };

  return (
    <div className="container mx-auto p-4 mt-20">
      <h1 className="text-3xl font-bold mb-6">Edit Profil</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nama
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">
            Foto Profil
          </label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2" />

          {preview && (
            <div className="mt-4">
              <Image src={preview} alt="Preview" width={100} height={100} className="rounded-full" />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-bluetiful text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
};

export default EditProfilePage;
