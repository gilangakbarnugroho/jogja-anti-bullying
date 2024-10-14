import Link from "next/link";
import { useRouter } from "next/router";
import { FaQuoteLeft, FaNewspaper, FaExclamationTriangle, FaHome } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-bluetiful text-white fixed top-0 left-0 flex flex-col">
      <Link href='/dashboard-admin' className="p-4 text-2xl font-semibold border-b border-bluetiful-200">
        
          Dashboard
        
      </Link>
      <nav className="flex-1 p-4 space-y-4">
        {/* Link ke Halaman Dashboard */}
        <Link href="/" className="flex items-center space-x-2 hover:bg-bluetiful-400 px-3 py-2 rounded">
          <FaHome />
          <span>Home</span>
        </Link>

        {/* Link ke Manage Quotes */}
        <Link href="/dashboard-admin/manage-quotes" className="flex items-center space-x-2 hover:bg-bluetiful-400 px-3 py-2 rounded">
          <FaQuoteLeft />
          <span>Manage Quotes</span>
        </Link>

        {/* Link ke Manage GelarPost */}
        <Link href="/dashboard-admin/manage-gelar" className="flex items-center space-x-2 hover:bg-bluetiful-400 px-3 py-2 rounded">
          <FaNewspaper />
          <span>Manage Gelar</span>
        </Link>

        {/* Link ke Manage Report */}
        <Link href="/dashboard-admin/manage-reports" className="flex items-center space-x-2 hover:bg-bluetiful-400 px-3 py-2 rounded">
          <FaExclamationTriangle />
          <span>Report Posts</span>
        </Link>
      </nav>
      {/* Footer Sidebar */}
      <div className="p-4 border-t border-bluetiful-200 text-sm text-center">
        &copy; 2024 Jogja Anti Bullying
      </div>
    </div>
  );
};

export default Sidebar;
