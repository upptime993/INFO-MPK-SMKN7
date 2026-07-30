import React from "react";
import Image from "next/image";

export const LogoWatermark: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
      <div className="relative w-[700px] h-[700px] md:w-[900px] md:h-[900px] opacity-[0.04] grayscale contrast-125 transition-opacity duration-700">
        <Image
          src="/logo-mpk.png"
          alt="Watermark Logo MPK SMKN 7 Serang"
          fill
          sizes="900px"
          priority={false}
          className="object-contain"
        />
      </div>
    </div>
  );
};
