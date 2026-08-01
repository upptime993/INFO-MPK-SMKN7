import React from "react";
import Image from "next/image";

export const LogoWatermark: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
      {/* Watermark Logo MPK - Setelan Hasil Tuner Presisi */}
      <div className="relative w-[550px] h-[550px] max-w-[92vw] max-h-[92vw] opacity-[0.32] md:w-[780px] md:h-[870px] md:max-w-none md:max-h-none md:opacity-[0.24] grayscale contrast-[150%] transition-all duration-300">
        <Image
          src="/logo-mpk.png"
          alt="Watermark Logo MPK SMKN 7 Serang"
          fill
          sizes="(max-width: 768px) 550px, 780px"
          priority={true}
          className="object-contain"
        />
      </div>
    </div>
  );
};
