import React from "react";
import Image from "next/image";

export const LogoWatermark: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
      <div className="relative w-[340px] h-[340px] sm:w-[600px] sm:h-[600px] md:w-[800px] md:h-[800px] opacity-[0.10] grayscale contrast-125 transition-opacity duration-700">
        <Image
          src="/logo-mpk.png"
          alt="Watermark Logo MPK SMKN 7 Serang"
          fill
          sizes="(max-width: 768px) 340px, 800px"
          priority={false}
          className="object-contain"
        />
      </div>
    </div>
  );
};
