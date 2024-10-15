"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import Modal from "../../../components/ui/Modal"; // Pastikan Anda memiliki komponen Modal

interface Quote {
  id: string;
  caption: string;
  image: string;
}

const Quotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null); // State untuk menyimpan quote yang dipilih
  const [showModal, setShowModal] = useState(false); // State untuk modal

  // Fetch data dari Firestore
  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const snapshot = await getDocs(collection(db, "quotes"));
        const quotesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Quote[];
        setQuotes(quotesData);
      } catch (error) {
        console.error("Error fetching quotes:", error);
      }
    };

    fetchQuotes();
  }, []);

  // Fungsi untuk membuka modal dan menampilkan quote yang dipilih
  const openModal = (quote: Quote) => {
    setSelectedQuote(quote);
    setShowModal(true);
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedQuote(null);
  };

  return (
    <div className="container mx-auto px-4 py-10 mt-16">
      <h1 className="text-3xl font-bold mb-6 text-center text-bluetiful">Quotes</h1>

      {/* Grid layout untuk menampilkan quotes */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {quotes.map((quote) => (
          <div
            key={quote.id}
            className="relative w-full h-60 bg-gray-200 rounded-lg overflow-hidden shadow-lg cursor-pointer"
            onClick={() => openModal(quote)} // Ketika diklik, modal akan terbuka
          >
            {/* Gambar dengan aspek rasio 1:1 */}
            <Image
              src={quote.image}
              alt={quote.caption}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
            {/* Caption ditampilkan di bagian bawah gambar */}
            <div className="absolute bottom-0 bg-black bg-opacity-50 w-full text-white text-sm p-2 text-center">
              {quote.caption}
            </div>
          </div>
        ))}
      </div>

      {/* Modal untuk menampilkan detail quote */}
      {showModal && selectedQuote && (
        <Modal onClose={closeModal}>
          <div className="p-6">
            <div className="relative w-full h-[300px] sm:h-[500px] mb-4">
              <Image
                src={selectedQuote.image}
                alt={selectedQuote.caption}
                fill
                loading="lazy"
                className="object-cover rounded-lg"
              />
            </div>
            <h2 className="text-2xl font-bold mb-2">{selectedQuote.caption}</h2>
            <button
              className="mt-4 px-4 py-2 bg-bluetiful text-white rounded hover:bg-blue-600"
              onClick={closeModal}
            >
              Tutup
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Quotes;
