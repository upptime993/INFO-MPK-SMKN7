import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 bg-navy text-white/90 border-t-2 border-gold py-6 mt-12">
      <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-xs sm:text-sm">
        <div>
          <p className="font-serif font-semibold text-gold text-base">
            Penerimaan Anggota Baru MPK
          </p>
          <p className="text-white/70 text-xs mt-0.5">
            SMKN 7 Kota Serang • Jl. Raya Taktakan, Kota Serang, Banten
          </p>
        </div>

        <div className="flex items-center gap-4 text-white/60 text-xs">
          <span>&copy; {new Date().getFullYear()} MPK SMKN 7</span>
        </div>
      </div>
    </footer>
  );
};
