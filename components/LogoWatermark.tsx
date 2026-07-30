import React from "react";
import Image from "next/image";

export const LogoWatermark: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
      {/* Watermark Logo MPK dengan opasitas pas yang elegan baik di mobile maupun desktop */}
      <div className="relative w-[140vw] h-[140vw] max-w-[500px] max-h-[500px] sm:w-[620px] sm:h-[620px] md:w-[750px] md:h-[750px] opacity-[0.13] sm:opacity-[0.11] md:opacity-[0.11] grayscale contrast-125 transition-all duration-500 -translate-y-2 sm:translate-y-0">
        <Image
          src="/logo-mpk.png"
          alt="Watermark Logo MPK SMKN 7 Serang"
          fill
          sizes="(max-width: 640px) 140vw, (max-width: 1024px) 620px, 750px"
          priority={true}
          className="object-contain"
        />
      </div>
    </div>
  );
};
