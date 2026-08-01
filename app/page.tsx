"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SearchForm } from "@/components/SearchForm";
import { ResultCard, PesertaResultData } from "@/components/ResultCard";
import { LogoWatermark } from "@/components/LogoWatermark";

export default function HomePage() {
  const [resultData, setResultData] = useState<PesertaResultData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSearch = async (nama: string, nomorPendaftaran: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/cek-hasil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, nomorPendaftaran }),
      });

      const json = await res.json();

      if (res.ok && json.success && json.data) {
        setResultData(json.data);
      } else {
        setResultData(null);
        setErrorMessage(
          json.error ||
            "Data tidak ditemukan. Pastikan nama lengkap dan nomor pendaftaran yang Anda masukkan sudah benar."
        );
      }
    } catch (error) {
      console.error("Search error:", error);
      setErrorMessage("Terjadi gangguan koneksi. Silakan coba beberapa saat lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResultData(null);
    setErrorMessage(null);
  };

  return (
    <div className="relative min-h-[100dvh] flex flex-col justify-between overflow-x-hidden bg-paper">
      {/* Background Watermark MPK Logo */}
      <LogoWatermark />

      {/* Navigation Header */}
      <Header />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-4 py-8 sm:py-12 flex flex-col justify-center items-center">
        {resultData ? (
          <ResultCard data={resultData} onReset={handleReset} />
        ) : (
          <SearchForm
            onSearch={handleSearch}
            isLoading={isLoading}
            errorMessage={errorMessage}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}


