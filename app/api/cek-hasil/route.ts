import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Peserta from "@/lib/models/Peserta";
import { hitungHasil } from "@/lib/scoring";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama, nomorPendaftaran } = body;

    if (!nama || !nomorPendaftaran) {
      return NextResponse.json(
        { error: "Nama lengkap dan nomor pendaftaran wajib diisi." },
        { status: 400 }
      );
    }

    const cleanNama = String(nama).trim();
    const cleanNomor = String(nomorPendaftaran).trim();

    await connectToDatabase();

    const peserta = await Peserta.findOne({
      nomorPendaftaran: { $regex: new RegExp(`^${cleanNomor}$`, "i") },
      nama: { $regex: new RegExp(cleanNama.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") },
    });

    if (!peserta || !peserta.published) {
      return NextResponse.json(
        {
          success: false,
          error: "Data tidak ditemukan. Pastikan nama lengkap dan nomor pendaftaran yang Anda masukkan sudah benar.",
        },
        { status: 444 }
      );
    }

    const hasil = hitungHasil(peserta.nilai);

    const dto = {
      id: peserta._id.toString(),
      nama: peserta.nama,
      kelasJurusan: peserta.kelasJurusan || "",
      nomorPendaftaran: peserta.nomorPendaftaran,
      nilai: peserta.nilai,
      catatan: peserta.catatan || {},
      namaPenguji: peserta.namaPenguji || {},
      pesanMPK: peserta.pesanMPK || "",
      pesanKelulusan: peserta.pesanKelulusan || "",
      linkWaGrup: peserta.linkWaGrup || "",
      totalPoin: hasil.totalPoin,
      status: hasil.status,
      persentaseTotal: hasil.persentaseTotal,
      persentaseDetail: hasil.persentaseDetail,
    };

    return NextResponse.json({
      success: true,
      data: dto,
    });
  } catch (error: any) {
    console.error("Error pada api/cek-hasil:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada sistem. Silakan coba beberapa saat lagi." },
      { status: 500 }
    );
  }
}
