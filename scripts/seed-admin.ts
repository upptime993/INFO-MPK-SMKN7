import fs from "fs";
import path from "path";

const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf8");
  for (const line of envConfig.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...values] = trimmed.split("=");
      if (key && values.length > 0) {
        process.env[key.trim()] = values.join("=").trim();
      }
    }
  }
}

import bcrypt from "bcryptjs";
import { connectToDatabase } from "../lib/mongodb";
import Admin from "../lib/models/Admin";
import Peserta from "../lib/models/Peserta";

async function seed() {
  try {
    console.log("🔌 Menghubungkan ke Database...");
    await connectToDatabase();
    console.log("✅ Terhubung ke database.");

    const username = process.env.ADMIN_USERNAME || "admin";
    const password = process.env.ADMIN_PASSWORD || "admin123";

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      console.log(`ℹ️ Admin dengan username '${username}' sudah ada.`);
    } else {
      const passwordHash = await bcrypt.hash(password, 10);
      await Admin.create({
        username,
        passwordHash,
        nama: "Panitia Seleksi MPK",
      });
      console.log(`✅ Admin '${username}' berhasil dibuat! Password: '${password}'`);
    }

    const countPeserta = await Peserta.countDocuments();
    if (countPeserta === 0) {
      console.log("🌱 Menambahkan data sampel peserta...");
      const dummyPeserta = [
        {
          nama: "Ahmad Fauzi",
          kelasJurusan: "XI RPL 1",
          nomorPendaftaran: "MPK-2026-001",
          nilai: { mengaji: 4.5, akademik: 4.0, wawancara: 4.5 },
          catatan: {
            mengaji: "Tajwid & kelancaran sangat baik, hafalan QS. Al-Mulk lancar.",
            akademik: "Wawasan kebangsaan & struktur organisasi sangat paham.",
            wawancara: "Sikap tenang, adab sopan, dan motivasi tinggi.",
          },
          pesanMPK: "Selamat Fauzi! Semangat menghadapi Tes Debat Tahap 2.",
          linkWaGrup: "https://chat.whatsapp.com/MPKSMKN7Tahap2Official",
          totalPoin: 13,
          status: "LULUS",
          published: true,
        },
        {
          nama: "Siti Rahmawati",
          kelasJurusan: "X TKJ 2",
          nomorPendaftaran: "MPK-2026-002",
          nilai: { mengaji: 4.0, akademik: 4.0, wawancara: 4.0 },
          catatan: {
            mengaji: "Bacaan fasih dan makhorijul huruf tepat.",
            akademik: "Nilai logika baik, perlu memperdalam aturan MPK.",
            wawancara: "Percaya diri dan mampu menjawab pertanyaan dengan logis.",
          },
          pesanMPK: "Performa kamu sangat mengesankan! Siapkan materi untuk sesi debat.",
          linkWaGrup: "https://chat.whatsapp.com/MPKSMKN7Tahap2Official",
          totalPoin: 12,
          status: "LULUS",
          published: true,
        },
        {
          nama: "Budi Santoso",
          kelasJurusan: "XI TKR 3",
          nomorPendaftaran: "MPK-2026-003",
          nilai: { mengaji: 3.0, akademik: 3.0, wawancara: 3.5 },
          catatan: {
            mengaji: "Perlu meningkatkan tajwid dan kelancaran membaca.",
            akademik: "Pemahaman organisasi masih cukup dasar.",
            wawancara: "Cukup komunikatif namun perlu lebih percaya diri.",
          },
          pesanMPK: "Terima kasih atas partisipasinya Budi. Tetap semangat berkarya!",
          linkWaGrup: "",
          totalPoin: 9.5,
          status: "TIDAK_LULUS",
          published: true,
        },
        {
          nama: "Dewi Lestari",
          kelasJurusan: "X AKL 1",
          nomorPendaftaran: "MPK-2026-004",
          nilai: { mengaji: 4.5, akademik: 4.5, wawancara: 4.5 },
          catatan: {
            mengaji: "Sangat baik dalam tartil dan tajwid.",
            akademik: "Pengetahuan umum dan ke-MPK-an luar biasa.",
            wawancara: "Kepemimpinan terlihat menonjol dan matang.",
          },
          pesanMPK: "Hasil luar biasa! Pertahankan semangat ini di tahap berikutnya.",
          linkWaGrup: "https://chat.whatsapp.com/MPKSMKN7Tahap2Official",
          totalPoin: 13.5,
          status: "LULUS",
          published: false,
        },
      ];

      for (const item of dummyPeserta) {
        await Peserta.create(item);
      }
      console.log(`✅ ${dummyPeserta.length} data peserta sampel berhasil ditambahkan.`);
    }

    console.log("🎉 Seeding selesai!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error saat seeding:", error);
    process.exit(1);
  }
}

seed();
