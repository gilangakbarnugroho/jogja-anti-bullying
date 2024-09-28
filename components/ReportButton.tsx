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

  const handleReport = async () => {
    if (!auth.currentUser) {
      alert("Anda harus login untuk melaporkan konten.");
      return;
    }

    if (confirm("Apakah Anda yakin ingin melaporkan konten ini?")) {
      try {
        
        await addDoc(collection(db, "reports"), {
          postId,
          contentType,
          user: auth.currentUser?.email || "Anonim",
          timestamp: serverTimestamp(),
        });

        setIsReported(true);
        alert("Laporan berhasil dikirim. Admin akan meninjau laporan ini.");
      } catch (error) {
        console.error("Error melaporkan konten:", error);
      }
    }
  };

  return (
    <button
      onClick={handleReport}
      disabled={isReported}
      className="text-sm text-gray-500 hover:text-red-700"
    >
      {isReported ? <MdReportProblem size={18}/>  : <MdOutlineReportProblem size={18}/> }
    </button>
  );
};

export default ReportButton;
