"use client";

import { useState, useEffect } from "react";
import { db, isAdmin } from "../../firebase/firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";

interface Report {
  id: string;
  postId: string;
  contentType: string;
  reason: string;
  user: string;
  timestamp: any;
}

const ReportsPage = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const adminStatus = await isAdmin();
      setIsAdminUser(adminStatus);

      if (!adminStatus) {
        router.push("/"); // Jika bukan admin, arahkan kembali ke homepage
      }
    };

    const fetchReports = async () => {
      const reportSnapshot = await getDocs(collection(db, "reports"));
      const reportData = reportSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Report[];
      setReports(reportData);
    };

    checkAdmin();
    fetchReports();
  }, [router]);

  if (!isAdminUser) return null;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Laporan Konten</h1>

      <div className="space-y-4">
        {reports.length === 0 ? (
          <p>Tidak ada laporan konten.</p>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="p-4 border rounded-lg shadow-md">
              <p className="text-sm text-gray-500">Dilaporkan oleh: {report.user}</p>
              <p className="text-lg">Alasan: {report.reason}</p>
              <p className="text-xs text-gray-400">
                {new Date(report.timestamp.seconds * 1000).toLocaleString()}
              </p>

              <p className="text-sm text-gray-700">Tipe Konten: {report.contentType}</p>
              <p className="text-sm text-gray-700">ID Konten: {report.postId}</p>

              <button
                onClick={() => router.push(`/ruang-bincang/${report.postId}`)}
                className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-lg hover:bg-blue-700"
              >
                Lihat Postingan
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
