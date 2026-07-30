"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, User, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username || !password) {
      setErrorMessage("Silakan isi username dan password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        setErrorMessage(data.error || "Login gagal. Periksa username dan password.");
      }
    } catch (error) {
      setErrorMessage("Terjadi kesalahan sistem saat mencoba login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-navy flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Blur */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-paper-card border-2 border-gold/40 rounded-2xl p-6 sm:p-8 shadow-navy relative z-10 animate-scaleUp">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-navy mb-4 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Halaman Utama Publik</span>
        </Link>

        {/* Logo & Header */}
        <div className="text-center mb-6">
          <div className="relative w-16 h-16 mx-auto mb-3">
            <Image
              src="/logo-mpk.png"
              alt="Logo MPK SMKN 7"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="font-serif text-2xl font-bold text-navy">
            Portal Admin Panitia
          </h1>
          <p className="text-ink-light text-xs mt-1">
            Masuk untuk mengelola data peserta seleksi MPK SMKN 7 Kota Serang.
          </p>
        </div>

        {/* Form Login */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">
              Username Panitia
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
              <input
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-navy/20 bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
              <input
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-navy/20 bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
                required
              />
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-stamp-red/10 border border-stamp-red/30 flex items-center gap-2.5 text-stamp-red text-xs animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 rounded-lg bg-navy hover:bg-navy-dark text-white font-semibold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 border border-gold/40 disabled:opacity-70 cursor-pointer active:scale-[0.99]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-gold" />
                <span>Verifikasi Sesi...</span>
              </>
            ) : (
              <span>Masuk Portal Admin</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-navy/10 text-center text-[11px] text-ink-muted">
          Akses terbatas hanya untuk Panitia Seleksi MPK SMKN 7.
        </div>
      </div>
    </div>
  );
}
