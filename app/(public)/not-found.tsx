import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 text-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        {/* Icon Warning */}
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          size="3x"
          className="text-red-500 mb-4"
        />

        {/* Judul */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          404 - Halaman Tidak Ditemukan
        </h1>

        {/* Pesan */}
        <p className="text-gray-600 text-lg mb-6">
          Maaf, halaman yang Anda cari tidak dapat ditemukan. Mungkin URL salah atau halaman telah dihapus.
        </p>

        {/* Tombol kembali ke beranda */}
        <Link href="/" className="inline-block bg-bluetiful text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition">
          Kembali ke Halaman Utama
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
