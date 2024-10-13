"use client";

import { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth } from "../firebase/firebaseConfig";
import { MdOutlineReportProblem, MdReportProblem } from "react-icons/md";

interface ReportButtonProps {
  postId: string;
  contentType: "post" | "comment";
}

const ReportButton: React.FC<ReportButtonProps> = ({ postId, contentType }) => {
  const [isReported, setIsReported] = useState(false);
  const [showReasonForm, setShowReasonForm] = useState(false);
  const [reportReason, setReportReason] = useState("");

  const handleReport = async () => {
    if (!auth.currentUser) {
      alert("Anda harus login untuk melaporkan konten.");
      return;
    }

    if (reportReason.trim() === "") {
      alert("Silakan masukkan alasan pelaporan.");
      return;
    }

    try {
      await addDoc(collection(db, "reports"), {
        postId,
        contentType,
        reason: reportReason, // Alasan pelaporan
        user: auth.currentUser?.email || "Anonim",
        timestamp: serverTimestamp(),
      });

      setIsReported(true);
      setShowReasonForm(false);
      alert("Laporan berhasil dikirim. Admin akan meninjau laporan ini.");
    } catch (error) {
      console.error("Error melaporkan konten:", error);
    }
  };

  return (
    <div>
      {isReported ? (
        <MdReportProblem size={32} className="text-red-600" />
      ) : (
        <div>
          <button onClick={() => setShowReasonForm(!showReasonForm)} className="flex text-sm text-gray-500 hover:text-red-700">
            <MdOutlineReportProblem size={24} /> 
            <p>Laporkan Konten</p>
          </button>

          {showReasonForm && (
            <div className="mt-2 p-2 bg-gray-100 border border-gray-300 rounded-lg">
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                rows={3}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Alasan melaporkan postingan ini..."
              />
              <button
                onClick={handleReport}
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
              >
                Kirim Laporan
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportButton;
