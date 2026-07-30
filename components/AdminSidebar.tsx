"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, UserPlus, LogOut, ArrowLeft } from "lucide-react";

interface AdminSidebarProps {
  adminName?: string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ adminName }) => {
  const pathname = usePathname();
  const router = useRouter();

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

  return (
    <aside className="w-full md:w-64 bg-navy text-white flex-shrink-0 border-r border-gold/30 shadow-navy flex flex-col justify-between min-h-[100dvh]">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-white/10 flex items-center gap-3">
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

        {/* User Info */}
        <div className="px-5 py-3 bg-white/5 border-b border-white/10 text-xs">
          <span className="text-white/60 block">Login Sebagai:</span>
          <span className="font-semibold text-white truncate block">
            {adminName || "Panitia Admin"}
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
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
  );
};
