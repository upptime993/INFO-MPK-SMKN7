import React from "react";
import { BookOpen, GraduationCap, Users, UserCheck } from "lucide-react";

interface ScoreCardProps {
  jenis: "mengaji" | "akademik" | "wawancara";
  nilai: number;
  catatan?: string;
  namaPenguji?: string;
  persentase: number;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  jenis,
  nilai,
  catatan,
  namaPenguji,
  persentase,
}) => {
  const meta = {
    mengaji: {
      title: "Tes Mengaji & Tajwid",
      icon: BookOpen,
    },
    akademik: {
      title: "Tes Akademik & Wawasan",
      icon: GraduationCap,
    },
    wawancara: {
      title: "Tes Wawancara & Kepribadian",
      icon: Users,
    },
  }[jenis];

  const IconComponent = meta.icon;

  return (
    <div className="py-3.5 border-b border-navy/10 last:border-b-0">
      <div className="flex items-center justify-between gap-3 mb-1.5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-navy/5 text-navy flex items-center justify-center flex-shrink-0">
            <IconComponent size={15} />
          </div>
          <span className="font-semibold text-xs sm:text-sm text-navy">{meta.title}</span>
        </div>

        <div className="flex items-baseline gap-2 text-right flex-shrink-0">
          <span className="font-serif font-bold text-base sm:text-lg text-navy">
            {nilai.toFixed(1)} <span className="text-xs font-sans text-ink-muted font-normal">/ 5</span>
          </span>
          <span className="text-xs font-mono font-semibold text-gold-dark bg-gold/10 px-1.5 py-0.5 rounded">
            {persentase}%
          </span>
        </div>
      </div>

      {/* Progress Bar Tipis 2-3px */}
      <div className="w-full bg-navy/10 h-1.5 rounded-full overflow-hidden mb-2">
        <div
          className="bg-gold h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, Math.max(0, persentase))}%` }}
        />
      </div>

      {/* Catatan & Nama Penguji */}
      {(catatan || namaPenguji) && (
        <div className="bg-paper/80 p-2.5 rounded-lg border border-navy/10 space-y-1">
          {namaPenguji && (
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-navy">
              <UserCheck size={13} className="text-gold-dark" />
              <span>Penguji: {namaPenguji}</span>
            </div>
          )}
          {catatan && (
            <p className="text-xs text-ink-light leading-relaxed italic">
              &ldquo;{catatan}&rdquo;
            </p>
          )}
        </div>
      )}
    </div>
  );
};
