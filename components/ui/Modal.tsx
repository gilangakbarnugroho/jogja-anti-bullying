import React, { useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  // Mengunci scroll ketika modal terbuka
  useEffect(() => {
    document.body.style.overflow = "hidden"; // Mencegah halaman di-scroll saat modal terbuka
    return () => {
      document.body.style.overflow = "auto"; // Mengembalikan scroll ketika modal ditutup
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[70vh] overflow-y-auto mx-4 p-6">
        {/* Tombol close di pojok kanan atas */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-bluetiful hover:text-bluetiful-50"
        >
          ✖
        </button>
        {/* Konten modal */}
        <div className="text-gray-700 space-y-5">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
