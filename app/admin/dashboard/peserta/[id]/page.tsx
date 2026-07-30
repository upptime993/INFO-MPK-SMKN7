"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PesertaForm, PesertaFormInitialData } from "@/components/PesertaForm";
import { Loader2 } from "lucide-react";

export default function EditPesertaPage() {
  const params = useParams();
  const id = params.id as string;

  const [initialData, setInitialData] = useState<PesertaFormInitialData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await fetch(`/api/peserta/${id}`);
        const json = await res.json();
        if (res.ok && json.success) {
          setInitialData(json.data);
        } else {
          setError(json.error || "Gagal mengambil data peserta.");
        }
      } catch (err) {
        setError("Terjadi kesalahan jaringan.");
      } finally {
        setIsLoading(false);
      }
    }
    if (id) {
      fetchDetail();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-navy mb-3" />
        <p className="text-sm text-ink-muted">Memuat data peserta...</p>
      </div>
    );
  }

  if (error || !initialData) {
    return (
      <div className="py-12 text-center text-stamp-red">
        <p className="font-semibold">{error || "Peserta tidak ditemukan."}</p>
      </div>
    );
  }

  return <PesertaForm initialData={initialData} isEditMode={true} />;
}
