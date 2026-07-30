import React from "react";
import { AdminSidebar } from "@/components/AdminSidebar";

export const metadata = {
  title: "Dashboard Admin - MPK SMKN 7 Kota Serang",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-paper">
      <AdminSidebar adminName="Panitia Seleksi MPK" />
      <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
