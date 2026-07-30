"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, UserPlus, LogOut, ArrowLeft, Menu, X } from "lucide-react";

interface AdminSidebarProps {
  adminName?: string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ adminName }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Deteksi apakah saat ini di halaman login (belum terautentikasi)
  const isLoginPage = pathname === "/admin/login";

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navItems = [
    {
      label: "Dashboard Peserta",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Tambah Peserta Baru",
      href: "/admin/dashboard/peserta/baru",
      icon: UserPlus,
    },
  ];

  // Jika di halaman login, jangan tampilkan sidebar sama sekali
  if (isLoginPage) {
    return null;
  }

  return (
    <>
      {/* 📱 Mobile Top Header Bar (Tampil hanya di HP < md) */}
      <div className="md:hidden bg-navy text-white px-4 py-3 border-b border-gold/30 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 flex-shrink-0">
            <Image
              src="/logo-mpk.png"
              alt="Logo MPK SMKN 7"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h2 className="font-serif font-bold text-xs tracking-wide text-white">
              PANITIA MPK
            </h2>
            <p className="text-[9px] text-gold font-medium">Portal Admin</p>
          </div>
        </div>

        {/* Tombol Hamburger (≡) Menu */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* 📱 Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-navy/70 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* 💻 Desktop Fixed Sidebar & Mobile Slide-Out Drawer */}
      <aside
        className={`fixed md:static top-0 left-0 bottom-0 z-50 w-64 bg-navy text-white flex-shrink-0 border-r border-gold/30 shadow-navy flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } h-[100dvh]`}
      >
        {/* Brand & Menu Content */}
        <div>
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src="/logo-mpk.png"
                  alt="Logo MPK SMKN 7"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h2 className="font-serif font-bold text-sm tracking-wide text-white">
                  PANITIA MPK
                </h2>
                <p className="text-[11px] text-gold font-medium">Portal Admin Seleksi</p>
              </div>
            </div>

            {/* Close button inside mobile menu */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden text-white/70 hover:text-white p-1"
            >
              <X size={20} />
            </button>
          </div>

          {/* User Info */}
          <div className="px-5 py-3 bg-white/5 border-b border-white/10 text-xs">
            <span className="text-white/60 block">Login Sebagai:</span>
            <span className="font-semibold text-white truncate block">
              {adminName || "Panitia Admin"}
            </span>
          </div>

          {/* Navigation Menu Links — hanya tampil jika sudah login */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? "bg-gold text-navy font-bold shadow-md"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-navy" : "text-gold"} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/70 hover:text-gold hover:bg-white/5 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Lihat Halaman Publik</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-stamp-red/90 hover:text-white hover:bg-stamp-red/30 transition-colors font-medium cursor-pointer"
          >
            <LogOut size={16} />
            <span>Keluar Sesi (Logout)</span>
          </button>
        </div>
      </aside>
    </>
  );
};
