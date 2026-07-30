"use client";

import React, { useState } from "react";
import Link from "next/link";
import { StampBadge } from "./StampBadge";
import {
  Search,
  Plus,
  Globe,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  Link as LinkIcon,
  Check,
} from "lucide-react";
import { StatusSeleksi } from "@/lib/scoring";

export interface PesertaItem {
  _id: string;
  nama: string;
  kelasJurusan?: string;
  nomorPendaftaran: string;
  nilai: {
    mengaji: number;
    akademik: number;
    wawancara: number;
  };
  totalPoin: number;
  status: StatusSeleksi;
  published: boolean;
  linkWaGrup?: string;
  createdAt: string;
}

interface PesertaTableProps {
  pesertaList: PesertaItem[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const PesertaTable: React.FC<PesertaTableProps> = ({
  pesertaList,
  isLoading,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [publishedFilter, setPublishedFilter] = useState("");
  const [isPublishingAll, setIsPublishingAll] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);

  // Modal Mass Link WA
  const [showWaModal, setShowWaModal] = useState(false);
  const [globalWaLink, setGlobalWaLink] = useState("");
  const [isUpdatingWa, setIsUpdatingWa] = useState(false);
  const [waSuccessMsg, setWaSuccessMsg] = useState<string | null>(null);

  // Toggle publish single participant
  const handleTogglePublish = async (id: string, currentPublished: boolean) => {
    try {
      const res = await fetch(`/api/peserta/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !currentPublished }),
      });
      if (res.ok) {
        onRefresh();
      }
    } catch (error) {
      console.error("Error toggle publish:", error);
    }
  };

  // Delete participant
  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data peserta ini?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/peserta/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        onRefresh();
      }
    } catch (error) {
      console.error("Error delete peserta:", error);
    } finally {
      setDeletingId(null);
    }
  };

  // Publish all unpublished participants
  const handlePublishAll = async () => {
    setIsPublishingAll(true);
    try {
      const res = await fetch("/api/peserta/publish-all", {
        method: "PATCH",
      });
      if (res.ok) {
        setShowPublishModal(false);
        onRefresh();
      }
    } catch (error) {
      console.error("Error publish all:", error);
    } finally {
      setIsPublishingAll(false);
    }
  };

  // Mass update Link WA
  const handleUpdateWaAll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalWaLink.trim()) return;

    setIsUpdatingWa(true);
    setWaSuccessMsg(null);

    try {
      const res = await fetch("/api/peserta/update-wa-all", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkWaGrup: globalWaLink.trim() }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setWaSuccessMsg(json.message);
        setTimeout(() => {
          setShowWaModal(false);
          setWaSuccessMsg(null);
          onRefresh();
        }, 1500);
      }
    } catch (error) {
      console.error("Error mass update WA:", error);
    } finally {
      setIsUpdatingWa(false);
    }
  };

  const filteredList = pesertaList.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nomorPendaftaran.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.kelasJurusan &&
        item.kelasJurusan.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchStatus = !statusFilter || item.status === statusFilter;

    let matchPublished = true;
    if (publishedFilter === "true") matchPublished = item.published === true;
    if (publishedFilter === "false") matchPublished = item.published === false;

    return matchSearch && matchStatus && matchPublished;
  });

  const unpublishedCount = pesertaList.filter((p) => !p.published).length;

  return (
    <div className="space-y-4">
      {/* Header Actions: Search, Filter, Buttons */}
      <div className="bg-paper-card p-3.5 sm:p-4 rounded-xl border border-navy/15 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search & Filter */}
        <div className="flex flex-1 flex-col sm:flex-row items-center gap-2.5">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
            <input
              type="text"
              placeholder="Cari nama / no. reg / kelas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-navy/20 bg-paper text-ink focus:outline-none focus:ring-2 focus:ring-navy/30"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-36">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full py-2 px-2.5 text-xs sm:text-sm rounded-lg border border-navy/20 bg-paper text-ink focus:outline-none focus:ring-2 focus:ring-navy/30"
              >
                <option value="">Semua Status</option>
                <option value="LULUS">LULUS</option>
                <option value="TIDAK_LULUS">TIDAK LULUS</option>
              </select>
            </div>

            <div className="relative flex-1 sm:w-36">
              <select
                value={publishedFilter}
                onChange={(e) => setPublishedFilter(e.target.value)}
                className="w-full py-2 px-2.5 text-xs sm:text-sm rounded-lg border border-navy/20 bg-paper text-ink focus:outline-none focus:ring-2 focus:ring-navy/30"
              >
                <option value="">Semua Publikasi</option>
                <option value="true">Published</option>
                <option value="false">Draft (Belum)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* Tombol Set Link WA Massal */}
          <button
            onClick={() => setShowWaModal(true)}
            className="px-3 py-2 rounded-lg bg-pass-green/15 hover:bg-pass-green/25 text-pass-green font-semibold text-xs border border-pass-green/40 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Set Link Grup WhatsApp otomatis untuk semua peserta"
          >
            <LinkIcon size={14} />
            <span>Set Link WA Semua</span>
          </button>

          {unpublishedCount > 0 && (
            <button
              onClick={() => setShowPublishModal(true)}
              className="px-3 py-2 rounded-lg bg-gold/20 hover:bg-gold/30 text-navy font-semibold text-xs border border-gold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Publish semua peserta yang statusnya masih draft"
            >
              <Globe size={14} className="text-gold-dark" />
              <span>Publish Semua ({unpublishedCount})</span>
            </button>
          )}

          <Link
            href="/admin/dashboard/peserta/baru"
            className="px-3.5 py-2 rounded-lg bg-navy hover:bg-navy-dark text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all border border-gold/30"
          >
            <Plus size={15} className="text-gold" />
            <span>Tambah Peserta</span>
          </Link>
        </div>
      </div>

      {/* Tabel Data Peserta */}
      <div className="bg-paper-card rounded-xl border border-navy/15 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-navy text-white font-serif text-xs uppercase tracking-wider">
                <th className="py-3 px-3 w-10 text-center">No</th>
                <th className="py-3 px-3">Nama Peserta</th>
                <th className="py-3 px-3">Kelas & Jurusan</th>
                <th className="py-3 px-3">No. Reg</th>
                <th className="py-3 px-3 text-center">Total Poin</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Publikasi</th>
                <th className="py-3 px-3 text-center w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/10 text-ink">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-ink-muted">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-navy mb-2" />
                    Memuat data peserta...
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-ink-muted">
                    Tidak ada data peserta yang cocok dengan pencarian / filter.
                  </td>
                </tr>
              ) : (
                filteredList.map((item, index) => (
                  <tr
                    key={item._id}
                    className="hover:bg-paper/70 transition-colors"
                  >
                    <td className="py-2.5 px-3 text-center font-mono text-ink-muted">
                      {index + 1}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-navy">
                      {item.nama}
                    </td>
                    <td className="py-2.5 px-3 text-ink-light">
                      {item.kelasJurusan || "-"}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-medium text-navy">
                      {item.nomorPendaftaran}
                    </td>
                    <td className="py-2.5 px-3 text-center font-serif font-bold text-base text-navy">
                      {item.totalPoin.toFixed(1)}{" "}
                      <span className="text-[10px] font-sans text-ink-muted font-normal">
                        / 15
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex justify-center">
                        <StampBadge status={item.status} size="sm" />
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() =>
                          handleTogglePublish(item._id, item.published)
                        }
                        className={`px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold flex items-center gap-1 mx-auto cursor-pointer transition-all ${
                          item.published
                            ? "bg-pass-green/15 text-pass-green border border-pass-green/30"
                            : "bg-ink-muted/15 text-ink-muted border border-ink-muted/30"
                        }`}
                      >
                        {item.published ? (
                          <>
                            <CheckCircle2 size={11} />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <XCircle size={11} />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Link
                          href={`/admin/dashboard/peserta/${item._id}`}
                          className="p-1.5 rounded bg-navy/5 hover:bg-navy/15 text-navy transition-colors"
                          title="Edit Peserta"
                        >
                          <Edit size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(item._id)}
                          disabled={deletingId === item._id}
                          className="p-1.5 rounded bg-stamp-red/10 hover:bg-stamp-red/20 text-stamp-red transition-colors cursor-pointer"
                          title="Hapus Peserta"
                        >
                          {deletingId === item._id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="px-4 py-2.5 bg-paper border-t border-navy/10 text-xs text-ink-muted flex flex-wrap items-center justify-between gap-2">
          <span>Menampilkan {filteredList.length} dari {pesertaList.length} total peserta</span>
          <span>Status LULUS: {pesertaList.filter(p => p.status === 'LULUS').length} orang</span>
        </div>
      </div>

      {/* Modal Mass Set Link WA */}
      {showWaModal && (
        <div className="fixed inset-0 z-50 bg-navy/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleUpdateWaAll}
            className="bg-paper-card border-2 border-pass-green rounded-xl max-w-md w-full p-6 shadow-navy space-y-4 animate-scaleUp"
          >
            <div className="flex items-center gap-2.5 text-pass-green">
              <LinkIcon className="w-6 h-6 flex-shrink-0" />
              <h3 className="font-serif font-bold text-lg text-navy">
                Set Link WA Ke Semua Peserta
              </h3>
            </div>

            <p className="text-xs text-ink-light leading-relaxed">
              Masukkan tautan Grup WhatsApp resmi Tes Tahap 2. Tautan ini akan **otomatis diisi ke seluruh data peserta** sehingga Anda tidak perlu mengetiknya satu per satu.
            </p>

            <div>
              <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1">
                Link Grup WhatsApp (URL)
              </label>
              <input
                type="url"
                placeholder="https://chat.whatsapp.com/..."
                value={globalWaLink}
                onChange={(e) => setGlobalWaLink(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-navy/20 bg-paper text-ink font-mono focus:ring-2 focus:ring-navy/30"
                required
              />
            </div>

            {waSuccessMsg && (
              <div className="p-3 rounded-lg bg-pass-green/15 text-pass-green border border-pass-green/30 text-xs flex items-center gap-2">
                <Check size={16} />
                <span>{waSuccessMsg}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowWaModal(false)}
                disabled={isUpdatingWa}
                className="px-4 py-2 rounded-lg border border-navy/20 bg-paper text-ink text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isUpdatingWa || !globalWaLink.trim()}
                className="px-4 py-2 rounded-lg bg-pass-green hover:bg-pass-green/90 text-white text-xs font-semibold flex items-center gap-2 border border-emerald-400/40 disabled:opacity-50"
              >
                {isUpdatingWa ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Menerapkan...</span>
                  </>
                ) : (
                  <span>Terapkan ke Semua</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Konfirmasi Publish Semua */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 bg-navy/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-paper-card border-2 border-gold rounded-xl max-w-md w-full p-6 shadow-navy space-y-4 animate-scaleUp">
            <div className="flex items-center gap-3 text-stamp-red">
              <AlertTriangle className="w-7 h-7 flex-shrink-0" />
              <h3 className="font-serif font-bold text-lg text-navy">
                Konfirmasi Publish Massal
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-ink-light leading-relaxed">
              Anda akan mempublikasikan <strong className="text-navy">{unpublishedCount} peserta</strong> yang saat ini masih dalam status Draft. Setelah dipublikasikan, hasil seleksi peserta tersebut dapat dicari dan dilihat di halaman publik.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowPublishModal(false)}
                disabled={isPublishingAll}
                className="px-4 py-2 rounded-lg border border-navy/20 bg-paper hover:bg-paper-muted text-ink text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handlePublishAll}
                disabled={isPublishingAll}
                className="px-4 py-2 rounded-lg bg-navy hover:bg-navy-dark text-white text-xs font-semibold flex items-center gap-2 border border-gold/40"
              >
                {isPublishingAll ? (
                  <>
                    <Loader2 size={14} className="animate-spin text-gold" />
                    <span>Mempublikasikan...</span>
                  </>
                ) : (
                  <>
                    <Globe size={14} className="text-gold" />
                    <span>Ya, Publish Semua</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
