"use client";

import React, { useEffect, useState, useCallback } from "react";
import { PesertaTable, PesertaItem } from "@/components/PesertaTable";
import { RefreshCw } from "lucide-react";

export default function AdminDashboardPage() {
  const [pesertaList, setPesertaList] = useState<PesertaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPeserta = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/peserta");
      const json = await res.json();
      if (res.ok && json.success) {
        setPesertaList(json.data || []);
      }
    } catch (error) {
      console.error("Error fetching peserta:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPeserta();
  }, [fetchPeserta]);

  // Statistik Ringkas
  const totalPeserta = pesertaList.length;
  const totalLulus = pesertaList.filter((p) => p.status === "LULUS").length;
  const totalTidakLulus = pesertaList.filter((p) => p.status === "TIDAK_LULUS").length;
  const totalPublished = pesertaList.filter((p) => p.published).length;

  return (
    <div className="space-y-6">
      {/* Header Dashboard & Refresh */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-navy/15 pb-4">
        <div>
          <span className="text-[11px] font-mono font-bold text-gold-dark uppercase tracking-widest block">
            MANAJEMEN HASIL SELEKSI
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-navy">
            Dashboard Peserta MPK
          </h1>
        </div>

        <button
          onClick={fetchPeserta}
          disabled={isLoading}
          className="px-3.5 py-2 rounded-lg bg-paper-card hover:bg-paper-muted border border-navy/20 text-navy font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin text-gold" : "text-navy"} />
          <span>Muat Ulang Data</span>
        </button>
      </div>

      {/* Ringkasan Statistik Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-paper-card p-4 rounded-xl border border-navy/15 shadow-sm">
          <span className="text-xs text-ink-muted font-semibold uppercase tracking-wider block">
            Total Peserta
          </span>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-navy">
            {totalPeserta}
          </span>
        </div>

        <div className="bg-paper-card p-4 rounded-xl border border-pass-green/30 shadow-sm">
          <span className="text-xs text-pass-green font-semibold uppercase tracking-wider block">
            Status LULUS
          </span>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-pass-green">
            {totalLulus}
          </span>
        </div>

        <div className="bg-paper-card p-4 rounded-xl border border-stamp-red/30 shadow-sm">
          <span className="text-xs text-stamp-red font-semibold uppercase tracking-wider block">
            Tidak Lulus
          </span>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-stamp-red">
            {totalTidakLulus}
          </span>
        </div>

        <div className="bg-paper-card p-4 rounded-xl border border-gold/40 shadow-sm">
          <span className="text-xs text-gold-dark font-semibold uppercase tracking-wider block">
            Sudah Published
          </span>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-navy">
            {totalPublished}{" "}
            <span className="text-xs font-sans text-ink-muted font-normal">
              / {totalPeserta}
            </span>
          </span>
        </div>
      </div>

      {/* Tabel Utama Peserta */}
      <PesertaTable
        pesertaList={pesertaList}
        isLoading={isLoading}
        onRefresh={fetchPeserta}
      />
    </div>
  );
}
