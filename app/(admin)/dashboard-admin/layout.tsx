import SidebarContainer from "../../../components/ui/SidebarContainer";
import { Toaster } from "react-hot-toast";
import "../../../styles/globals.css";

// Metadata yang ditangani di server-side
export const metadata = {
  title: "Dashboard - Kanal Digital Anti Bullying",
  description: "Dashboard Admin Jogja Anti Bullying",
  openGraph: {
    title: "Dashboard - Jogja Anti Bullying",
    description: "Dashboard Admin Jogja Anti Bullying",
    images: [
      {
        url: "https://jogjaantibully.com/thumbnail.png",
      },
    ],
  },
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en"> {/* Menambahkan elemen <html> */}
      <body className="antialiased min-h-screen flex"> {/* Menambahkan elemen <body> */}
        {/* Sidebar khusus dashboard */}
        <SidebarContainer />

        {/* Konten utama dashboard */}
        <div className="flex-1 pl-20 p-6 bg-gray-100 min-h-screen">
          <Toaster />
          {children}
        </div>
      </body>
    </html>
  );
};

export default DashboardLayout;
