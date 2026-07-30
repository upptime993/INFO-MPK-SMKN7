import React from "react";
import Image from "next/image";
import Link from "next/link";

export const Header: React.FC = () => {
  return (
    <header className="relative z-10 bg-paper/90 backdrop-blur-sm border-b border-gold/30 shadow-paper">
      <div className="max-w-5xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
        {/* Logo Left: MPK & SMKN 7 */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 transition-transform group-hover:scale-105">
            <Image
              src="/logo-mpk.png"
              alt="Logo MPK SMKN 7 Serang"
              fill
              sizes="48px"
              className="object-contain"
              priority
            />
          </div>
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 transition-transform group-hover:scale-105">
            <Image
              src="/logo-smkn7.png"
              alt="Logo SMKN 7 Kota Serang"
              fill
              sizes="48px"
              className="object-contain"
              priority
            />
          </div>

          <div className="border-l border-navy/20 pl-3">
            <h1 className="font-serif text-sm sm:text-base md:text-lg font-bold text-navy leading-tight tracking-tight">
              MPK SMKN 7 KOTA SERANG
            </h1>
            <p className="text-[11px] sm:text-xs text-ink-light font-medium tracking-wide">
              Majelis Permusyawaratan Kelas • Periode 2026/2027
            </p>
          </div>
        </Link>

        {/* Badge Pengumuman Resmi */}
        <div className="hidden md:flex flex-col items-end">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-navy/5 border border-navy/10 text-navy font-semibold text-xs tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
            Pengumuman Resmi
          </span>
          <span className="text-[11px] text-ink-muted mt-0.5">Seleksi Tahap 1</span>
        </div>
      </div>
    </header>
  );
};
