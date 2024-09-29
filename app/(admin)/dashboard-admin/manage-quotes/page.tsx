"use client";

import React, { useState, useEffect } from "react"; // Tambahkan import React
import Image from "next/image";
import { db, storage } from "../../../../firebase/firebaseConfig";
import { collection, doc, deleteDoc, getDocs, addDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-hot-toast";

interface Quote {
  id: string;
  caption: string;
  image: string;
}

const ManageQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [newQuote, setNewQuote] = useState({ caption: "", image: "" });
  const [editQuoteId, setEditQuoteId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Ambil data quotes dari Firestore saat komponen di-mount
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

  // Fungsi untuk upload gambar ke Firebase Storage dan mendapatkan URL-nya
  const handleImageUpload = async () => {
    if (!imageFile) return;
    if (imageFile.size > 2 * 1024 * 1024) {
      toast.error("Ukuran gambar maksimal 2MB");
      return;
    }

    setIsUploading(true);
    try {
      const imageRef = ref(storage, `quotes/${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      const downloadURL = await getDownloadURL(imageRef);
      setNewQuote((prevQuote) => ({ ...prevQuote, image: downloadURL }));
      toast.success("Gambar berhasil diupload!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Gagal mengupload gambar!");
    } finally {
      setIsUploading(false);
    }
  };

  // Tambah quote baru ke Firestore
  const addQuote = async () => {
    if (!newQuote.caption || !newQuote.image) {
      toast.error("Caption dan gambar harus diisi!");
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "quotes"), newQuote);
      setQuotes([...quotes, { id: docRef.id, ...newQuote }]);
      setNewQuote({ caption: "", image: "" });
      setImageFile(null);
      toast.success("Quote berhasil ditambahkan!");
    } catch (error) {
      console.error("Error adding quote: ", error);
      toast.error("Gagal menambahkan quote.");
    }
  };

  // Update quote yang sudah ada di Firestore
  const updateQuote = async () => {
    if (editQuoteId) {
      try {
        await updateDoc(doc(db, "quotes", editQuoteId), newQuote);
        const updatedQuotes = quotes.map((quote) =>
          quote.id === editQuoteId ? { ...quote, ...newQuote } : quote
        );
        setQuotes(updatedQuotes);
        setEditQuoteId(null);
        setNewQuote({ caption: "", image: "" });
        setImageFile(null);
        toast.success("Quote berhasil diperbarui!");
      } catch (error) {
        console.error("Error updating quote:", error);
        toast.error("Gagal memperbarui quote.");
      }
    }
  };

  // Hapus quote dari Firestore
  const deleteQuote = async (id: string) => {
    try {
      await deleteDoc(doc(db, "quotes", id));
      setQuotes(quotes.filter((quote) => quote.id !== id));
      toast.success("Quote berhasil dihapus!");
    } catch (error) {
      console.error("Error deleting quote:", error);
      toast.error("Gagal menghapus quote.");
    }
  };

  return (
    <div className="p-6 container mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-4">Manage Quotes</h1>

      {/* Form untuk menambah / mengedit quote */}
      <div className="flex flex-col space-y-4 mb-6">
        <input
          type="text"
          placeholder="Quote Caption"
          value={newQuote.caption}
          onChange={(e) => setNewQuote({ ...newQuote, caption: e.target.value })}
          className="border p-2 rounded w-full"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files ? e.target.files[0] : null;
            setImageFile(file);
            file && handleImageUpload();
          }}
          className="border p-2 rounded w-full"
        />

        {/* Preview Gambar */}
        {newQuote.image && (
          <div className="relative w-32 h-32 mt-2 mb-4">
            <Image src={newQuote.image} alt="Preview" fill className="rounded-lg object-cover" />
          </div>
        )}

        {editQuoteId ? (
          <button onClick={updateQuote} className="bg-yellow-500 text-white px-4 py-2 rounded">
            Update
          </button>
        ) : (
          <button onClick={addQuote} className="bg-bluetiful text-white px-4 py-2 rounded">
            Add
          </button>
        )}
      </div>

      {/* List Quotes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quotes.map((quote) => (
          <div key={quote.id} className="border p-4 rounded shadow-md">
            <p className="font-semibold">{quote.caption}</p>
            <div className="relative w-full h-56 mt-2 mb-4">
              <Image src={quote.image} alt={quote.caption} fill className="rounded object-cover" />
            </div>
            <div className="flex justify-between space-x-2">
              <button
                onClick={() => {
                  setEditQuoteId(quote.id);
                  setNewQuote({ caption: quote.caption, image: quote.image });
                }}
                className="bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Edit
              </button>
              <button onClick={() => deleteQuote(quote.id)} className="bg-red-500 text-white px-4 py-2 rounded">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageQuotes;
