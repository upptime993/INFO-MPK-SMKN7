import React from "react";
import Image from "next/image";

export const LogoWatermark: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
      {/* Mobile: lebih besar & opasitas lebih tinggi agar terlihat jelas */}
      <div className="relative w-[90vw] h-[90vw] max-w-[800px] max-h-[800px] opacity-[0.15] sm:opacity-[0.12] md:opacity-[0.08] grayscale contrast-125">
        <Image
          src="/logo-mpk.png"
          alt="Watermark Logo MPK SMKN 7 Serang"
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 600px, 800px"
          priority={true}
          className="object-contain"
        />
      </div>
    </div>
  );
};
