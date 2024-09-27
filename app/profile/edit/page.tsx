"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const EditProfilePage = () => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
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
          setProfilePicture(userData.profilePicture || "");
        }
      } else {
        router.push("/login");
      }
    };

    fetchProfile();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const userId = auth.currentUser?.uid;
    if (userId) {
      await updateDoc(doc(db, "users", userId), {
        name,
        bio,
        profilePicture,
      });
      setLoading(false);
      router.push("/profile"); // Redirect kembali ke halaman profil
    }
  };

  return (
    <div className="container mx-auto p-4">
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
            URL Foto Profil
          </label>
          <input
            type="url"
            id="profilePicture"
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
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
