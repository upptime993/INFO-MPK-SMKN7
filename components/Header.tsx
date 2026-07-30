import React from "react";
import Image from "next/image";
import Link from "next/link";

export const Header: React.FC = () => {
  return (
    <header className="relative z-10 bg-paper/90 backdrop-blur-sm border-b border-gold/30 shadow-paper">
      <div className="max-w-5xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
        {/* Logo Left: MPK & SMKN 7 */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
          <div className="relative w-8 h-8 sm:w-12 sm:h-12 flex-shrink-0 transition-transform group-hover:scale-105">
            <Image
              src="/logo-mpk.png"
              alt="Logo MPK SMKN 7 Serang"
              fill
              sizes="48px"
              className="object-contain"
              priority
            />
          </div>
          <div className="relative w-8 h-8 sm:w-12 sm:h-12 flex-shrink-0 transition-transform group-hover:scale-105">
            <Image
              src="/logo-smkn7.png"
              alt="Logo SMKN 7 Kota Serang"
              fill
              sizes="48px"
              className="object-contain"
              priority
            />
          </div>

          <div className="border-l border-navy/20 pl-2 sm:pl-3">
            <h1 className="font-serif text-xs sm:text-base md:text-lg font-bold text-navy leading-tight tracking-tight">
              MPK SMKN 7 KOTA SERANG
            </h1>
            <p className="text-[10px] sm:text-xs text-ink-light font-medium tracking-wide">
              Majelis Permusyawaratan Kelas • Periode 2026/2027
            </p>
          </div>
        </Link>

        {/* Badge Pengumuman Resmi — tampil di semua ukuran layar */}
        <div className="flex flex-col items-end flex-shrink-0">
          <span className="inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-navy/5 border border-navy/10 text-navy font-semibold text-[9px] sm:text-xs tracking-wider uppercase">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gold animate-pulse"></span>
            <span className="hidden xs:inline">Pengumuman</span> Resmi
          </span>
          <span className="text-[9px] sm:text-[11px] text-ink-muted mt-0.5">Seleksi Tahap 1</span>
        </div>
      </div>
    </header>
  );
};
