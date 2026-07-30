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
  openGraph: {
    title: "Pengumuman Hasil Seleksi MPK SMKN 7 Kota Serang",
    description:
      "Cek hasil seleksi Tes Tahap 1 calon anggota MPK SMKN 7 Kota Serang.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${sourceSerif.variable} ${plusJakarta.variable}`}>
      <body className="min-h-[100dvh] bg-paper text-ink flex flex-col antialiased selection:bg-gold/30 selection:text-navy">
        {children}
      </body>
    </html>
  );
}
