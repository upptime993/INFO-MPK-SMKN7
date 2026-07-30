import type { Metadata } from "next";
import { Source_Serif_4, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pengumuman Hasil Seleksi MPK SMKN 7 Kota Serang",
  description:
    "Portal resmi pengumuman hasil seleksi Tes Tahap 1 calon anggota Majelis Permusyawaratan Kelas (MPK) SMKN 7 Kota Serang periode 2026/2027.",
  icons: {
    icon: "/logo-mpk.png",
    shortcut: "/logo-mpk.png",
    apple: "/logo-mpk.png",
  },
  openGraph: {
    title: "Pengumuman Hasil Seleksi MPK SMKN 7 Kota Serang",
    description:
      "Cek hasil seleksi Tes Tahap 1 calon anggota MPK SMKN 7 Kota Serang.",
    type: "website",
    images: [
      {
        url: "/logo-mpk.png",
        width: 512,
        height: 512,
        alt: "Logo MPK SMKN 7 Kota Serang",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${sourceSerif.variable} ${plusJakarta.variable}`}>
      <head>
        <link rel="icon" href="/logo-mpk.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo-mpk.png" />
      </head>
      <body className="min-h-[100dvh] bg-paper text-ink flex flex-col antialiased selection:bg-gold/30 selection:text-navy">
        {children}
      </body>
    </html>
  );
}
