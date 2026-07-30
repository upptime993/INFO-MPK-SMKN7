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
      </div>
    </header>
  );
};
