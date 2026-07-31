import React from "react";
import Image from "next/image";

export const LogoWatermark: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
      {/* Watermark Logo MPK dengan opasitas & ukuran yang ditingkatkan agar tetap terlihat jelas di mobile maupun desktop */}
      <div className="relative w-[150vw] h-[150vw] max-w-[560px] max-h-[560px] sm:w-[700px] sm:h-[700px] md:w-[860px] md:h-[860px] lg:w-[1000px] lg:h-[1000px] opacity-[0.22] sm:opacity-[0.20] md:opacity-[0.20] lg:opacity-[0.22] grayscale contrast-125 mix-blend-multiply transition-all duration-500 -translate-y-2 sm:translate-y-0">
        <Image
          src="/logo-mpk.png"
          alt="Watermark Logo MPK SMKN 7 Serang"
          fill
          sizes="(max-width: 640px) 150vw, (max-width: 1024px) 700px, 1000px"
          priority={true}
          className="object-contain"
        />
      </div>
    </div>
  );
};
