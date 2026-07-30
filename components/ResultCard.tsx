import React from "react";
import { StampBadge } from "./StampBadge";
import { ScoreCard } from "./ScoreCard";
import { RotateCcw, Award, MessageSquare, ArrowRight, Phone } from "lucide-react";
import { StatusSeleksi } from "@/lib/scoring";

export interface PesertaResultData {
  id: string;
  nama: string;
  kelasJurusan: string;
  nomorPendaftaran: string;
  nilai: {
    mengaji: number;
    akademik: number;
    wawancara: number;
  };
  catatan?: {
    mengaji?: string;
    akademik?: string;
    wawancara?: string;
  };
  pesanMPK?: string;
  linkWaGrup?: string;
  totalPoin: number;
  status: StatusSeleksi;
  persentaseTotal: number;
  persentaseDetail: {
    mengaji: number;
    akademik: number;
    wawancara: number;
  };
}

interface ResultCardProps {
  data: PesertaResultData;
  onReset: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ data, onReset }) => {
  const isLulus = data.status === "LULUS";
  const waUrl = data.linkWaGrup && data.linkWaGrup.trim() !== "" 
    ? data.linkWaGrup.trim() 
    : "https://chat.whatsapp.com/";

  return (
    <div className="w-full max-w-2xl mx-auto bg-paper-card border-2 border-gold/40 rounded-2xl p-6 sm:p-8 shadow-navy relative z-10 animate-fadeIn">
      {/* Header Dokumen Hasil */}
      <div className="border-b border-navy/15 pb-6 mb-6 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-gold/15 text-navy font-mono text-[11px] font-bold uppercase tracking-[0.2em] mb-2">
            SURAT KETERANGAN HASIL SELEKSI
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy">
            {data.nama}
          </h2>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-light mt-1 font-medium">
            <span className="bg-paper px-2.5 py-0.5 rounded border border-navy/10 font-mono">
              No. Reg: {data.nomorPendaftaran}
            </span>
            {data.kelasJurusan && (
              <span className="bg-paper px-2.5 py-0.5 rounded border border-navy/10">
                Kelas: {data.kelasJurusan}
              </span>
            )}
          </div>
        </div>

        {/* Stempel Hasil Seleksi Prominens */}
        <div className="flex-shrink-0">
          <StampBadge status={data.status} size="lg" />
        </div>
      </div>

      {/* Pesan Kelulusan */}
      <div
        className={`p-4 rounded-xl mb-6 border ${
          isLulus
            ? "bg-pass-green/10 border-pass-green/30 text-pass-green"
            : "bg-stamp-red/10 border-stamp-red/30 text-stamp-red"
        }`}
      >
        <div className="flex items-center gap-2.5 font-serif font-bold text-base sm:text-lg mb-1">
          <Award className="w-5 h-5 flex-shrink-0" />
          <span>
            {isLulus
              ? "SELAMAT! ANDA DINYATAKAN LULUS SELEKSI TAHAP 1"
              : "MOHON MAAF, ANDA BELUM MEMENUHI SYARAT KELULUSAN"}
          </span>
        </div>
        <p className="text-xs sm:text-sm font-sans text-ink leading-relaxed pl-7">
          {isLulus
            ? "Selamat atas pencapaian Anda! Silakan klik tombol di bawah untuk bergabung ke Grup WhatsApp resmi Tes Tahap 2 (Tes Debat & Simulasi Musyawarah)."
            : "Terima kasih atas partisipasi dan perjuangan Anda. Tetap semangat berkarya dan berkontribusi untuk SMKN 7 Kota Serang di kesempatan lainnya."}
        </p>
      </div>

      {/* Rincian Skor per Tes */}
      <div className="mb-6">
        <h3 className="font-serif font-bold text-navy text-base sm:text-lg mb-3 flex items-center justify-between border-b border-navy/10 pb-2">
          <span>Rincian Nilai Evaluasi</span>
          <span className="font-sans text-xs text-ink-muted font-normal">
            Skala 0 - 5 per Tes
          </span>
        </h3>

        <div className="divide-y divide-navy/10">
          <ScoreCard
            jenis="mengaji"
            nilai={data.nilai.mengaji}
            catatan={data.catatan?.mengaji}
            persentase={data.persentaseDetail.mengaji}
          />
          <ScoreCard
            jenis="akademik"
            nilai={data.nilai.akademik}
            catatan={data.catatan?.akademik}
            persentase={data.persentaseDetail.akademik}
          />
          <ScoreCard
            jenis="wawancara"
            nilai={data.nilai.wawancara}
            catatan={data.catatan?.wawancara}
            persentase={data.persentaseDetail.wawancara}
          />
        </div>
      </div>

      {/* Ringkasan Total Skor */}
      <div className="bg-paper p-4 rounded-xl border border-gold/40 flex items-center justify-between gap-4 mb-6 shadow-sm">
        <div>
          <span className="text-xs text-ink-muted font-semibold uppercase tracking-wider block">
            TOTAL AKUMULASI POIN
          </span>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-navy">
            {data.totalPoin.toFixed(1)}{" "}
            <span className="text-sm font-sans font-normal text-ink-muted">
              / 15 Poin
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-ink-muted font-semibold uppercase tracking-wider block">
            PERSENTASE AKHIR
          </span>
          <span className="font-mono text-xl sm:text-2xl font-bold text-gold-dark">
            {data.persentaseTotal}%
          </span>
        </div>
      </div>

      {/* Pesan Personal dari MPK */}
      {data.pesanMPK && (
        <div className="mb-6 p-4 rounded-xl bg-navy/5 border border-navy/15 relative">
          <div className="flex items-center gap-2 font-serif font-bold text-navy text-sm mb-1.5">
            <MessageSquare size={16} className="text-gold-dark" />
            <span>Pesan Khusus dari Panitia MPK</span>
          </div>
          <p className="text-xs sm:text-sm text-ink-light leading-relaxed italic pl-6">
            &ldquo;{data.pesanMPK}&rdquo;
          </p>
        </div>
      )}

      {/* Tombol Aksi Utama */}
      <div className="pt-2 flex flex-col items-center gap-3">
        {isLulus ? (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-pass-green hover:bg-pass-green/90 text-white font-bold text-sm sm:text-base tracking-wide shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 border border-emerald-400/40 cursor-pointer active:scale-[0.99] text-center"
          >
            <Phone className="w-5 h-5 animate-bounce" />
            <span>Lanjut ke Tahap 2 (Grup WhatsApp)</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        ) : (
          <button
            onClick={onReset}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-navy/30 bg-paper hover:bg-paper-muted text-navy font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <RotateCcw size={16} className="text-gold-dark" />
            <span>Cari Nama Peserta Lain</span>
          </button>
        )}

        {/* Link sekunder untuk cari peserta lain */}
        {isLulus && (
          <button
            onClick={onReset}
            className="text-xs text-ink-muted hover:text-navy underline underline-offset-2 transition-colors cursor-pointer mt-1"
          >
            ← Cari nama peserta lain
          </button>
        )}
      </div>
    </div>
  );
};
