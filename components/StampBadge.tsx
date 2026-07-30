import React from "react";
import { Check, X } from "lucide-react";
import { StatusSeleksi } from "@/lib/scoring";

interface StampBadgeProps {
  status: StatusSeleksi;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const StampBadge: React.FC<StampBadgeProps> = ({
  status,
  size = "lg",
  className = "",
}) => {
  const isLulus = status === "LULUS";

  // Size configurations
  const config = {
    sm: {
      outer: "w-16 h-16 border-[1.5px]",
      inner: "w-14 h-14 border",
      text: "text-[10px] tracking-wider",
      subText: "text-[7px]",
      iconSize: 12,
      rotate: "-rotate-6",
    },
    md: {
      outer: "w-28 h-28 border-2",
      inner: "w-[100px] h-[100px] border-[1.5px]",
      text: "text-base tracking-widest",
      subText: "text-[10px]",
      iconSize: 18,
      rotate: "-rotate-6",
    },
    lg: {
      outer: "w-36 h-36 md:w-44 md:h-44 border-[2.5px]",
      inner: "w-32 h-32 md:w-40 md:h-40 border-2",
      text: "text-xl md:text-2xl tracking-[0.25em]",
      subText: "text-xs md:text-sm tracking-widest",
      iconSize: 24,
      rotate: "-rotate-6",
    },
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center font-serif transition-transform duration-300 hover:scale-105 select-none ${config.rotate} ${className}`}
      title={`Status Seleksi: ${isLulus ? "LULUS" : "TIDAK LULUS"}`}
    >
      {/* Cincin Luar Stempel */}
      <div
        className={`rounded-full flex items-center justify-center border-stamp-red/85 p-1 shadow-stamp ${config.outer}`}
        style={{
          boxShadow: isLulus
            ? "0 0 15px rgba(47, 110, 79, 0.15), inset 0 0 8px rgba(178, 58, 46, 0.1)"
            : "0 0 15px rgba(178, 58, 46, 0.15), inset 0 0 8px rgba(178, 58, 46, 0.1)",
        }}
      >
        {/* Cincin Dalam Stempel */}
        <div
          className={`rounded-full border-dashed border-stamp-red/75 flex flex-col items-center justify-center text-center p-2 backdrop-blur-[1px] ${config.inner}`}
        >
          {/* Header Lingkaran Stempel */}
          <span className={`font-medium uppercase text-stamp-red/80 ${config.subText}`}>
            PANITIA SELEKSI
          </span>

          {/* Ikon Indikator Status */}
          <div className="my-0.5 flex items-center justify-center">
            {isLulus ? (
              <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-pass-green/15 flex items-center justify-center text-pass-green">
                <Check size={config.iconSize} strokeWidth={3} />
              </div>
            ) : (
              <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-stamp-red/10 flex items-center justify-center text-stamp-red">
                <X size={config.iconSize} strokeWidth={3} />
              </div>
            )}
          </div>

          {/* Teks Status Utama (LULUS / TIDAK LULUS) */}
          <span
            className={`font-bold text-stamp-red drop-shadow-sm uppercase ${config.text}`}
          >
            {isLulus ? "LULUS" : "TIDAK LULUS"}
          </span>

          {/* Footer Stempel */}
          <span className={`font-semibold text-stamp-red/75 uppercase ${config.subText}`}>
            MPK SMKN 7
          </span>
        </div>
      </div>
    </div>
  );
};
