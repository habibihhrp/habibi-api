import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Habibi API — Free REST API untuk Bot WhatsApp",
  description:
    "Kumpulan REST API siap pakai: ytmp3, ytmp4, tiktok downloader, AI chat, random anime, news. Gratis, cepat, mudah.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <Navbar />
        <main className="min-h-[calc(100vh-140px)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
