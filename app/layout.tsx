import type { Metadata } from "next";
import localFont from "next/font/local";
import { FC, ReactNode } from 'react';
import "../styles/globals.css";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import { Toaster } from "react-hot-toast";

const plusJakartaSans = localFont({
  src: "./fonts/PlusJakartaSans-Italic-VariableFont_wght.ttf",
  variable: "--font-sans",
  weight: "100 900",
});


export const metadata: Metadata = {
  title: "Jogja Anti Bullying - Kanal Digital Anti Bullying",
  description: "Gerakan Digital untuk Stop Bullying: Program, Artikel, dan Sumber Daya untuk Membuat Perubahan",
  openGraph: {
    title: "Jogja Anti Bullying - Kanal Digital Anti Bullying",
    description:
      "Gerakan Digital untuk Stop Bullying: Program, Artikel, dan Sumber Daya untuk Membuat Perubahan",
    images: [
      {
        url: "https://jogjaantibully.com/thumbnail.png",
      },
    ],
  },
  metadataBase: new URL("https://jogjaantibully.com"),
  themeColor: "#FFF",
}
const RootLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <body
        className={`${plusJakartaSans.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <Toaster />
        {children}
        <Footer />
      </body>
    </html>
  );
}

export default RootLayout;
