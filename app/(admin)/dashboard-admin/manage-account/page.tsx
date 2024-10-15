"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../../../firebase/firebaseConfig";
import { doc, getDoc, collection, getDocs, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Loader from "../../../../components/ui/Loader";
import Image from "next/image";
import { toast } from "react-hot-toast"; // Import toast untuk notifikasi

interface User {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  role: string;
  superrole: string;
}

const ManageAccount = () => {
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSuperAdminStatus = async (user: any) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();

          if (userData.superrole === "superadmin") {
            setIsSuperAdmin(true);
            fetchUsers();
          } else {
            router.push("/"); // Redirect ke halaman utama jika bukan superadmin
          }
        } else {
          router.push("/"); // Redirect jika data pengguna tidak ditemukan
        }
      } else {
        router.push("/login"); // Redirect ke halaman login jika tidak ada user yang login
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      checkSuperAdminStatus(user);
    });

    return () => unsubscribe();
  }, [router]);

  // Fungsi untuk mengambil semua pengguna dari Firestore
  const fetchUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersList = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];
      setUsers(usersList);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fungsi untuk mengubah role pengguna
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        role: newRole,
      });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      toast.success("Role berhasil diperbarui!"); // Tampilkan notifikasi berhasil
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Gagal memperbarui role."); // Tampilkan notifikasi error
    }
  };

  // Fungsi untuk memastikan URL profile picture valid
  const getValidProfilePicture = (profilePicture: string | null) => {
    if (!profilePicture || !profilePicture.startsWith("http")) {
      return "/default-profile.jpg"; // Gambar default
    }
    return profilePicture;
  };

  if (!isSuperAdmin || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-6 container mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-bluetiful">Manage Account</h1>

      {/* Daftar Pengguna */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Profile Picture
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Role
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Image
                    src={getValidProfilePicture(user.profilePicture)} // Perbaikan src gambar
                    alt={user.name}
                    width={50}
                    height={50}
                    className="rounded-full object-cover"
                  />
                </td>
                <td className="px-6 py-4 text-gray-700 font-bold whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 text-gray-700 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="border border-gray-300 text-gray-700 rounded px-2 py-1"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageAccount;
