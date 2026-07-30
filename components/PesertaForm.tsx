"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StampBadge } from "./StampBadge";
import { hitungHasil, StatusSeleksi } from "@/lib/scoring";
import { Save, ArrowLeft, Loader2, AlertCircle, Link as LinkIcon } from "lucide-react";

export interface PesertaFormInitialData {
  _id?: string;
  nama: string;
  kelasJurusan?: string;
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
  namaPenguji?: {
    mengaji?: string;
    akademik?: string;
    wawancara?: string;
  };
  pesanMPK?: string;
  linkWaGrup?: string;
  published: boolean;
}

interface PesertaFormProps {
  initialData?: PesertaFormInitialData;
  isEditMode?: boolean;
}

export const PesertaForm: React.FC<PesertaFormProps> = ({
  initialData,
  isEditMode = false,
}) => {
  const router = useRouter();

  const [nama, setNama] = useState(initialData?.nama || "");
  const [kelasJurusan, setKelasJurusan] = useState(initialData?.kelasJurusan || "");
  const [nomorPendaftaran, setNomorPendaftaran] = useState(initialData?.nomorPendaftaran || "");

  const [nilaiMengaji, setNilaiMengaji] = useState<number>(initialData?.nilai?.mengaji ?? 0);
  const [nilaiAkademik, setNilaiAkademik] = useState<number>(initialData?.nilai?.akademik ?? 0);
  const [nilaiWawancara, setNilaiWawancara] = useState<number>(initialData?.nilai?.wawancara ?? 0);

  const [catatanMengaji, setCatatanMengaji] = useState(initialData?.catatan?.mengaji || "");
  const [catatanAkademik, setCatatanAkademik] = useState(initialData?.catatan?.akademik || "");
  const [catatanWawancara, setCatatanWawancara] = useState(initialData?.catatan?.wawancara || "");

  const [pengujiMengaji, setPengujiMengaji] = useState(initialData?.namaPenguji?.mengaji || "");
  const [pengujiAkademik, setPengujiAkademik] = useState(initialData?.namaPenguji?.akademik || "");
  const [pengujiWawancara, setPengujiWawancara] = useState(initialData?.namaPenguji?.wawancara || "");

  const [pesanMPK, setPesanMPK] = useState(initialData?.pesanMPK || "");
  const [linkWaGrup, setLinkWaGrup] = useState(initialData?.linkWaGrup || "");
  const [published, setPublished] = useState<boolean>(initialData?.published ?? false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [computedTotal, setComputedTotal] = useState(0);
  const [computedStatus, setComputedStatus] = useState<StatusSeleksi>("TIDAK_LULUS");

  useEffect(() => {
    const hasil = hitungHasil({
      mengaji: nilaiMengaji,
      akademik: nilaiAkademik,
      wawancara: nilaiWawancara,
    });
    setComputedTotal(hasil.totalPoin);
    setComputedStatus(hasil.status);
  }, [nilaiMengaji, nilaiAkademik, nilaiWawancara]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!nama.trim() || !nomorPendaftaran.trim()) {
      setErrorMessage("Nama dan nomor pendaftaran wajib diisi.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      nama: nama.trim(),
      kelasJurusan: kelasJurusan.trim(),
      nomorPendaftaran: nomorPendaftaran.trim(),
      nilai: {
        mengaji: Number(nilaiMengaji),
        akademik: Number(nilaiAkademik),
        wawancara: Number(nilaiWawancara),
      },
      catatan: {
        mengaji: catatanMengaji.trim(),
        akademik: catatanAkademik.trim(),
        wawancara: catatanWawancara.trim(),
      },
      namaPenguji: {
        mengaji: pengujiMengaji.trim(),
        akademik: pengujiAkademik.trim(),
        wawancara: pengujiWawancara.trim(),
      },
      pesanMPK: pesanMPK.trim(),
      linkWaGrup: linkWaGrup.trim(),
      published,
    };

    try {
      const url = isEditMode
        ? `/api/peserta/${initialData?._id}`
        : "/api/peserta";
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal menyimpan data peserta.");
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* Header Form */}
      <div className="flex items-center justify-between border-b border-navy/15 pb-4">
        <div>
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-navy mb-1 cursor-pointer font-medium"
          >
            <ArrowLeft size={14} />
            Kembali ke Dashboard
          </button>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-navy">
            {isEditMode ? "Edit Data Peserta" : "Tambah Peserta Baru"}
          </h1>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-navy hover:bg-navy-dark text-white font-semibold text-xs sm:text-sm flex items-center gap-2 border border-gold/40 shadow-sm disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin text-gold" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Save size={16} className="text-gold" />
              <span>Simpan Data</span>
            </>
          )}
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-lg bg-stamp-red/10 border border-stamp-red/30 flex items-center gap-3 text-stamp-red text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Identitas */}
          <div className="bg-paper-card p-4 sm:p-5 rounded-xl border border-navy/15 shadow-sm space-y-4">
            <h2 className="font-serif font-bold text-navy text-base border-b border-navy/10 pb-2">
              1. Identitas Peserta
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1">
                  Nama Lengkap <span className="text-stamp-red">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nama peserta"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-navy/20 bg-paper text-ink focus:ring-2 focus:ring-navy/30"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1">
                  Kelas & Jurusan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: XI RPL 2"
                  value={kelasJurusan}
                  onChange={(e) => setKelasJurusan(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-navy/20 bg-paper text-ink focus:ring-2 focus:ring-navy/30"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1">
                  Nomor Pendaftaran <span className="text-stamp-red">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: MPK-2026-001"
                  value={nomorPendaftaran}
                  onChange={(e) => setNomorPendaftaran(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-navy/20 bg-paper text-ink font-mono uppercase focus:ring-2 focus:ring-navy/30"
                  required
                />
              </div>
            </div>
          </div>

          {/* Form Evaluasi Nilai */}
          <div className="bg-paper-card p-4 sm:p-5 rounded-xl border border-navy/15 shadow-sm space-y-4">
            <h2 className="font-serif font-bold text-navy text-base border-b border-navy/10 pb-2">
              2. Nilai, Catatan & Nama Penguji
            </h2>

            {/* Mengaji */}
            <div className="p-3.5 rounded-lg bg-paper border border-navy/10 space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-xs text-navy uppercase tracking-wider">
                  a. Tes Mengaji (0 - 5.0)
                </label>
                <span className="font-mono text-xs font-bold text-navy bg-gold/15 px-2 py-0.5 rounded">
                  {nilaiMengaji} / 5.0
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-center">
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={nilaiMengaji}
                  onChange={(e) => setNilaiMengaji(Number(e.target.value))}
                  className="px-3 py-1.5 text-sm rounded border border-navy/20 bg-paper-card font-serif font-bold text-navy text-center"
                />
                <input
                  type="text"
                  placeholder="Nama Penguji (Opsional)..."
                  value={pengujiMengaji}
                  onChange={(e) => setPengujiMengaji(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded border border-navy/20 bg-paper-card text-ink"
                />
                <input
                  type="text"
                  placeholder="Catatan penguji tes mengaji..."
                  value={catatanMengaji}
                  onChange={(e) => setCatatanMengaji(e.target.value)}
                  className="sm:col-span-2 px-3 py-1.5 text-xs rounded border border-navy/20 bg-paper-card text-ink"
                />
              </div>
            </div>

            {/* Akademik */}
            <div className="p-3.5 rounded-lg bg-paper border border-navy/10 space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-xs text-navy uppercase tracking-wider">
                  b. Tes Akademik (0 - 5.0)
                </label>
                <span className="font-mono text-xs font-bold text-navy bg-gold/15 px-2 py-0.5 rounded">
                  {nilaiAkademik} / 5.0
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-center">
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={nilaiAkademik}
                  onChange={(e) => setNilaiAkademik(Number(e.target.value))}
                  className="px-3 py-1.5 text-sm rounded border border-navy/20 bg-paper-card font-serif font-bold text-navy text-center"
                />
                <input
                  type="text"
                  placeholder="Nama Penguji (Opsional)..."
                  value={pengujiAkademik}
                  onChange={(e) => setPengujiAkademik(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded border border-navy/20 bg-paper-card text-ink"
                />
                <input
                  type="text"
                  placeholder="Catatan penguji tes akademik..."
                  value={catatanAkademik}
                  onChange={(e) => setCatatanAkademik(e.target.value)}
                  className="sm:col-span-2 px-3 py-1.5 text-xs rounded border border-navy/20 bg-paper-card text-ink"
                />
              </div>
            </div>

            {/* Wawancara */}
            <div className="p-3.5 rounded-lg bg-paper border border-navy/10 space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-xs text-navy uppercase tracking-wider">
                  c. Tes Wawancara (0 - 5.0)
                </label>
                <span className="font-mono text-xs font-bold text-navy bg-gold/15 px-2 py-0.5 rounded">
                  {nilaiWawancara} / 5.0
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-center">
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={nilaiWawancara}
                  onChange={(e) => setNilaiWawancara(Number(e.target.value))}
                  className="px-3 py-1.5 text-sm rounded border border-navy/20 bg-paper-card font-serif font-bold text-navy text-center"
                />
                <input
                  type="text"
                  placeholder="Nama Penguji (Opsional)..."
                  value={pengujiWawancara}
                  onChange={(e) => setPengujiWawancara(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded border border-navy/20 bg-paper-card text-ink"
                />
                <input
                  type="text"
                  placeholder="Catatan penguji tes wawancara..."
                  value={catatanWawancara}
                  onChange={(e) => setCatatanWawancara(e.target.value)}
                  className="sm:col-span-2 px-3 py-1.5 text-xs rounded border border-navy/20 bg-paper-card text-ink"
                />
              </div>
            </div>
          </div>

          {/* Pesan, Link WA & Status */}
          <div className="bg-paper-card p-4 sm:p-5 rounded-xl border border-navy/15 shadow-sm space-y-4">
            <h2 className="font-serif font-bold text-navy text-base border-b border-navy/10 pb-2">
              3. Pesan, Link WA & Publikasi
            </h2>

            <div>
              <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <LinkIcon size={14} className="text-pass-green" />
                <span>Link Grup WhatsApp Tes Tahap 2</span>
              </label>
              <input
                type="url"
                placeholder="https://chat.whatsapp.com/..."
                value={linkWaGrup}
                onChange={(e) => setLinkWaGrup(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-navy/20 bg-paper text-ink font-mono focus:ring-2 focus:ring-navy/30"
              />
              <span className="text-[11px] text-ink-muted mt-1 block">
                Jika dikosongkan, bisa di-set massal untuk semua peserta dari menu Dashboard.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1">
                Pesan Khusus untuk Peserta
              </label>
              <textarea
                rows={3}
                placeholder="Pesan personal atau kata motivasi dari Panitia MPK..."
                value={pesanMPK}
                onChange={(e) => setPesanMPK(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-navy/20 bg-paper text-ink focus:ring-2 focus:ring-navy/30"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-navy/10">
              <div>
                <span className="font-semibold text-xs text-navy uppercase tracking-wider block">
                  Status Publikasi Pengumuman
                </span>
                <span className="text-[11px] text-ink-muted">
                  Peserta hanya bisa melihat hasil jika opsi ini di-centang.
                </span>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-paper-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-navy"></div>
                <span className="ml-2 text-xs font-semibold text-navy">
                  {published ? "Published" : "Draft"}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="space-y-4">
          <div className="bg-paper-card p-5 rounded-xl border-2 border-gold/40 shadow-navy sticky top-6">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-gold-dark bg-gold/10 px-2 py-0.5 rounded block text-center mb-3">
              LIVE PREVIEW SKOR AUTOMATIS
            </span>

            <div className="text-center my-4">
              <StampBadge status={computedStatus} size="md" />
            </div>

            <div className="space-y-2 border-t border-b border-navy/10 py-3 my-3">
              <div className="flex justify-between text-xs">
                <span className="text-ink-muted font-medium">Akumulasi Total:</span>
                <span className="font-serif font-bold text-navy text-sm">
                  {computedTotal.toFixed(1)} / 15 Poin
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-ink-muted font-medium">Status Otomatis:</span>
                <span
                  className={`font-bold ${
                    computedStatus === "LULUS" ? "text-pass-green" : "text-stamp-red"
                  }`}
                >
                  {computedStatus === "LULUS" ? "LULUS (≥ 10)" : "TIDAK LULUS (< 10)"}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-ink-muted text-center italic">
              * Total poin dan status dihitung otomatis oleh server berdasarkan aturan bisnis (Total ≥ 10 → LULUS).
            </p>
          </div>
        </div>
      </div>
    </form>
  );
};
