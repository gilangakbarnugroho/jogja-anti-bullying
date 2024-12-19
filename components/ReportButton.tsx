"use client";

import { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth } from "../firebase/firebaseConfig";
import { MdOutlineReportProblem, MdReportProblem } from "react-icons/md";

interface ReportButtonProps {
  postId: string;
  contentType: "post" | "comment";
  commentId?: string; 
}

const ReportButton: React.FC<ReportButtonProps> = ({ postId, contentType, commentId }) => {
  const [isReported, setIsReported] = useState(false);
  const [showReasonForm, setShowReasonForm] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [customReason, setCustomReason] = useState(""); 
  const [selectedReason, setSelectedReason] = useState("");

  const reasonOptions = [
    "Spam",
    "Kekerasan",
    "Konten tidak pantas",
    "Pelanggaran hak cipta",
    "Lainnya (custom)", 
  ];

  const handleReport = async () => {
    if (!auth.currentUser) {
      alert("Anda harus login untuk melaporkan konten.");
      return;
    }

    if (selectedReason === "") {
      alert("Silakan pilih alasan pelaporan.");
      return;
    }

    const finalReason = selectedReason === "Lainnya (custom)" ? customReason : selectedReason;

    if (selectedReason === "Lainnya (custom)" && customReason.trim() === "") {
      alert("Silakan masukkan alasan pelaporan Anda.");
      return;
    }

    try {
      await addDoc(collection(db, "reports"), {
        postId,
        commentId: contentType === "comment" ? commentId : null, 
        contentType,
        reason: finalReason,
        user: auth.currentUser?.email || "Anonim",
        userName: auth.currentUser?.displayName || "Anonim",
        reportedAt: serverTimestamp(),
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
          <button
            onClick={() => setShowReasonForm(!showReasonForm)}
            className="flex text-sm text-gray-500 hover:text-red-700"
          >
            <MdOutlineReportProblem size={24} />
            <p>Laporkan Konten</p>
          </button>

          {showReasonForm && (
            <div className="mt-2 p-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500">
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-full p-2 mb-2 border rounded-lg"
              >
                <option className="text-gray-100 bg-gray-500" value="" disabled>
                  Pilih alasan pelaporan
                </option>
                {reasonOptions.map((reason, index) => (
                  <option key={index} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>

              {selectedReason === "Lainnya (custom)" && (
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  rows={3}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="Jelaskan alasan pelaporan Anda..."
                />
              )}

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
