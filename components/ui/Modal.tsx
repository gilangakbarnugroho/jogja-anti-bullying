import React, { useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden"; 
    return () => {
      document.body.style.overflow = "auto"; 
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[70vh] overflow-y-auto mx-4 p-6">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-bluetiful hover:text-bluetiful-50"
        >
          ✖
        </button>
        <div className="text-gray-700 space-y-5">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
