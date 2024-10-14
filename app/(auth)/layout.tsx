import type { Metadata } from "next";
import localFont from "next/font/local";
import { FC, ReactNode } from 'react';
import "../../styles/globals.css";
import { Toaster } from "react-hot-toast";

const plusJakartaSans = localFont({
  src: "./fonts/PlusJakartaSans-Italic-VariableFont_wght.ttf",
  variable: "--font-sans",
  weight: "100 900",
});


export const metadata: Metadata = {
  title: "Jogja Anti Bullying",
  description: "Gerakan Digital untuk Stop Bullying: Program, Artikel, dan Sumber Daya untuk Membuat Perubahan",
  icons: {
    icon:"favicon.ico",
  },
  openGraph: {
    title: "Jogja Anti Bullying",
    description:
      "Gerakan Digital untuk Stop Bullying: Program, Artikel, dan Sumber Daya untuk Membuat Perubahan",
    images: [
      {
        url: "https://jogjaantibully.com/thumbnail.png",
      },
    ],
  },
  metadataBase: new URL("https://jogjaantibully.com"),
}
const RootLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <body
        className={`${plusJakartaSans.variable} antialiased min-h-screen flex flex-col`}
      >
        <Toaster />
        <main className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}

export default RootLayout;
