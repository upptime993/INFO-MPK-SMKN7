import React from "react";
import Image from "next/image";

export const LogoWatermark: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
      {/* Watermark Logo MPK dengan setelan khusus Desktop (780x870, opacity 0.24, contrast 150%) & Skala Responsif Mobile */}
      <div className="relative w-[90vw] h-[90vw] max-w-[480px] max-h-[480px] md:w-[780px] md:h-[870px] md:max-w-none md:max-h-none opacity-[0.20] md:opacity-[0.24] grayscale contrast-[150%] transition-all duration-300">
        <Image
          src="/logo-mpk.png"
          alt="Watermark Logo MPK SMKN 7 Serang"
          fill
          sizes="(max-width: 768px) 90vw, 780px"
          priority={true}
          className="object-contain"
        />
      </div>
    </div>
  );
};



