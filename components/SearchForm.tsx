"use client";

import React, { useState } from "react";
import { Search, Loader2, AlertCircle } from "lucide-react";

interface SearchFormProps {
  onSearch: (nama: string, nomorPendaftaran: string) => Promise<void>;
  isLoading: boolean;
  errorMessage: string | null;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  isLoading,
  errorMessage,
}) => {
  const [nama, setNama] = useState("");
  const [nomorPendaftaran, setNomorPendaftaran] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!nama.trim() || !nomorPendaftaran.trim()) {
      setFormError("Silakan isi nama lengkap dan nomor pendaftaran Anda.");
      return;
    }

    await onSearch(nama.trim(), nomorPendaftaran.trim());
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-paper-card/92 backdrop-blur-md border border-gold/30 rounded-xl p-6 sm:p-8 shadow-navy relative z-10">
      {/* Header Form */}
      <div className="text-center mb-6">
        <span className="inline-block px-3 py-1 rounded-full bg-navy/5 text-navy font-mono text-[11px] font-bold uppercase tracking-[0.2em] mb-2">
          PENGUMUMAN RESMI
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy">
          Cek Hasil Seleksi Tahap 1
        </h2>
        <p className="text-ink-light text-xs sm:text-sm mt-1.5 max-w-md mx-auto">
          Masukkan Nama Lengkap dan Nomor Pendaftaran yang sesuai dengan data Anda.
        </p>
      </div>

      {/* Form Input */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nama-input" className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">
            Nama Lengkap <span className="text-stamp-red">*</span>
          </label>
          <input
            id="nama-input"
            type="text"
            placeholder="Contoh: Monica Bernadeth"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-2.5 rounded-lg border border-navy/20 bg-paper/90 text-ink placeholder:text-ink-muted text-sm font-sans focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition-all"
            required
          />
        </div>

        <div>
          <label htmlFor="nomor-input" className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">
            Nomor Pendaftaran <span className="text-stamp-red">*</span>
          </label>
          <input
            id="nomor-input"
            type="text"
            placeholder="Contoh: MPK-2026-001"
            value={nomorPendaftaran}
            onChange={(e) => setNomorPendaftaran(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-2.5 rounded-lg border border-navy/20 bg-paper/90 text-ink placeholder:text-ink-muted text-sm font-mono focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition-all uppercase"
            required
          />
        </div>

        {/* Error Messages */}
        {(formError || errorMessage) && (
          <div className="p-3.5 rounded-lg bg-stamp-red/10 border border-stamp-red/30 flex items-start gap-3 text-stamp-red text-xs sm:text-sm animate-fadeIn">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="leading-snug">{formError || errorMessage}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-6 rounded-lg bg-navy hover:bg-navy-dark text-white font-semibold text-sm tracking-wide shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 border border-gold/40 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-gold" />
              <span>Memproses Pencarian...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4 text-gold" />
              <span>Cek Hasil Seleksi</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-5 text-center pt-4 border-t border-navy/10 text-[11px] text-ink-muted">
        Pastikan ejaan nama dan nomor pendaftaran tidak ada kesalahan ketik.
      </div>
    </div>
  );
};
