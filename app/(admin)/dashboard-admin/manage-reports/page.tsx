"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, doc, getDocs, deleteDoc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";
import Loader from "../../../../components/ui/Loader";
import { toast } from "react-hot-toast";

interface Report {
  id: string;
  postId: string;
  reportedBy: string;
  reason: string;
  reportedAt: any;
}

const ManageReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Ambil data laporan dari koleksi `reportedPost`
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const reportsSnapshot = await getDocs(collection(db, "reportedPosts"));
        const reportData = reportsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Report[];
        setReports(reportData);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Fungsi untuk menghapus postingan yang dilaporkan
  const handleDeletePost = async (postId: string, reportId: string) => {
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus postingan ini?");
    if (confirmDelete) {
      try {
        // Hapus postingan dari koleksi `posts`
        await deleteDoc(doc(db, "posts", postId));
        
        // Hapus laporan dari koleksi `reportedPost`
        await deleteDoc(doc(db, "reportedPosts", reportId));
        
        // Update state setelah penghapusan
        setReports((prevReports) => prevReports.filter((report) => report.id !== reportId));
        toast.success("Postingan berhasil dihapus.");
      } catch (error) {
        console.error("Error deleting post:", error);
        toast.error("Gagal menghapus postingan.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader /> {/* Tampilkan Loader saat memuat data */}
      </div>
    );
  }

  return (
    <div className="p-6 container mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-bluetiful">Manage Reported Posts</h1>
      
      {reports.length > 0 ? (
        <div className="space-y-6">
          {reports.map((report) => (
            <div key={report.id} className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl font-semibold text-gray-800">Post ID: {report.postId}</h2>
              <p className="text-gray-600 mb-2">Dilaporkan oleh: {report.reportedBy}</p>
              <p className="text-gray-600 mb-2">Alasan: {report.reason}</p>
              <p className="text-xs text-gray-400 mb-4">
                Dilaporkan pada: {new Date(report.reportedAt * 1000).toLocaleString()}
              </p>

              {/* Tombol untuk melihat detail postingan atau menghapus */}
              <div className="flex space-x-4">
                <button
                  onClick={() => router.push(`/ruang-bincang/${report.postId}`)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Lihat Postingan
                </button>
                <button
                  onClick={() => handleDeletePost(report.postId, report.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Hapus Postingan
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Belum ada laporan yang tersedia.</p>
      )}
    </div>
  );
};

export default ManageReports;
