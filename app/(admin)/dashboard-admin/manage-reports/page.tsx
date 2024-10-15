"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, doc, getDocs, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";
import Loader from "../../../../components/ui/Loader";
import { toast } from "react-hot-toast";
import Image from "next/image";

interface Report {
  id: string;
  postId: string;
  reportedBy: string;
  reportedAt: { seconds?: number };
  contentType: "post" | "comment";
  reason: string;
  userName: string;
}

const ManageReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reportedContents, setReportedContents] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const reportsSnapshot = await getDocs(collection(db, "reports"));
        const reportData = reportsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Report[];
        setReports(reportData);

        const contents: any = {};
        for (const report of reportData) {
          let contentRef;
          if (report.contentType === "post") {
            contentRef = doc(db, "posts", report.postId);
          } else if (report.contentType === "comment" && report.postId && report.id) {
            contentRef = doc(db, `posts/${report.postId}/comments`, report.id);
          }

          // Pastikan contentRef tidak undefined sebelum memanggil getDoc
          if (contentRef) {
            const contentSnap = await getDoc(contentRef);
            if (contentSnap.exists()) {
              contents[report.id] = contentSnap.data();
            }
          }
        }
        setReportedContents(contents);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleDeleteContent = async (postId: string, reportId: string) => {
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus konten ini?");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "posts", postId));
        await deleteDoc(doc(db, "reports", reportId));
        setReports((prevReports) => prevReports.filter((report) => report.id !== reportId));
        toast.success("Konten berhasil dihapus.");
      } catch (error) {
        console.error("Error deleting content:", error);
        toast.error("Gagal menghapus konten.");
      }
    }
  };

  const timeSince = (seconds: number) => {
    const now = Date.now() / 1000;
    const timeDifference = now - seconds;

    const minutesPassed = Math.floor(timeDifference / 60);
    const hoursPassed = Math.floor(timeDifference / 3600);
    const daysPassed = Math.floor(hoursPassed / 24);

    if (minutesPassed < 60) {
      return `${minutesPassed} menit yang lalu`;
    } else if (hoursPassed < 24) {
      return `${hoursPassed} jam yang lalu`;
    } else {
      return `${daysPassed} hari yang lalu`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-6 container mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-bluetiful">Manage Reported Content</h1>
      
      {reports.length > 0 ? (
        <div className="space-y-6">
          {reports.map((report) => (
            <div key={report.id} className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl font-semibold text-gray-800">ID Konten: {report.postId}</h2>
              <p className="text-gray-600 mb-2">Dilaporkan oleh: {report.userName}</p>
              <p className="text-gray-600 mb-2">Alasan: {report.reason}</p>
              <p className="text-xs text-gray-400 mb-4">
                Dilaporkan pada: {report.reportedAt?.seconds ? timeSince(report.reportedAt.seconds) : "Waktu tidak tersedia"}
              </p>

              {reportedContents[report.id] ? (
                <div className="bg-gray-100 p-2 rounded mb-4">
                  {report.contentType === "post" ? (
                    <>
                      <h3 className="font-bold">Preview Post:</h3>
                      <p>{reportedContents[report.id]?.content}</p>
                      {reportedContents[report.id]?.fileURL && (
                        <Image
                          src={reportedContents[report.id].fileURL}
                          alt="Post"
                          className="w-32 h-32 object-cover rounded-lg mt-2"
                        />
                      )}
                    </>
                  ) : (
                    <>
                      <h3 className="font-bold">Preview Comment:</h3>
                      <p>{reportedContents[report.id]?.content}</p>
                    </>
                  )}
                </div>
              ) : (
                <p className="text-red-500">Konten yang dilaporkan tidak ditemukan.</p>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={() => router.push(`/ruang-bincang/${report.postId}`)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Lihat Konten
                </button>
                <button
                  onClick={() => handleDeleteContent(report.postId, report.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Hapus Konten
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
