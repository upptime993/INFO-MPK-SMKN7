import React from "react";
import Image from "next/image";

export const LogoWatermark: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
      {/* Mobile: diperbesar signifikan (150vw / 520px) & opasitas 22% agar lingkaran stempel keluar melampaui kartu form */}
      <div className="relative w-[150vw] h-[150vw] max-w-[520px] max-h-[520px] sm:w-[650px] sm:h-[650px] md:w-[850px] md:h-[850px] opacity-[0.22] sm:opacity-[0.14] md:opacity-[0.09] grayscale contrast-125 transition-all duration-500 -translate-y-4 sm:translate-y-0">
        <Image
          src="/logo-mpk.png"
          alt="Watermark Logo MPK SMKN 7 Serang"
          fill
          sizes="(max-width: 640px) 150vw, (max-width: 1024px) 650px, 850px"
          priority={true}
          className="object-contain"
        />
      </div>
    </div>
  );
};
