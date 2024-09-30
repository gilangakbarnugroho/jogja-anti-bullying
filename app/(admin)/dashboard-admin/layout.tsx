import type { Metadata } from "next";
import { FC, ReactNode } from "react";
import "../../../styles/globals.css";
import Sidebar from "../../../components/ui/Sidebar";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
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
  metadataBase: new URL("https://jogjaantibully.com"),
};

const DashboardLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <body className={`antialiased min-h-screen flex`}>
        {/* Sidebar khusus dashboard */}
        <Sidebar />

        {/* Konten utama dashboard */}
        <div className="flex-1 p-6 bg-gray-100 min-h-screen ml-64">
          <Toaster />
          {children}
        </div>
      </body>
    </html>
  );
};

export default DashboardLayout;
