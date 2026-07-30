import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Peserta from "@/lib/models/Peserta";
import { getSessionAdmin } from "@/lib/auth";
import { hitungHasil } from "@/lib/scoring";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getSessionAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const peserta = await Peserta.findById(params.id);
    if (!peserta) {
      return NextResponse.json(
        { error: "Peserta tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: peserta,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Gagal mengambil detail peserta." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getSessionAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { nama, kelasJurusan, nomorPendaftaran, nilai, catatan, pesanMPK, linkWaGrup, published } = body;

    await connectToDatabase();

    const peserta = await Peserta.findById(params.id);
    if (!peserta) {
      return NextResponse.json(
        { error: "Peserta tidak ditemukan." },
        { status: 404 }
      );
    }

    if (nomorPendaftaran && nomorPendaftaran !== peserta.nomorPendaftaran) {
      const existing = await Peserta.findOne({
        nomorPendaftaran: String(nomorPendaftaran).trim(),
        _id: { $ne: params.id },
      });
      if (existing) {
        return NextResponse.json(
          { error: `Nomor pendaftaran '${nomorPendaftaran}' sudah digunakan.` },
          { status: 400 }
        );
      }
      peserta.nomorPendaftaran = String(nomorPendaftaran).trim();
    }

    if (nama !== undefined) peserta.nama = String(nama).trim();
    if (kelasJurusan !== undefined) peserta.kelasJurusan = String(kelasJurusan).trim();
    if (pesanMPK !== undefined) peserta.pesanMPK = String(pesanMPK).trim();
    if (linkWaGrup !== undefined) peserta.linkWaGrup = String(linkWaGrup).trim();
    if (published !== undefined) peserta.published = Boolean(published);

    if (nilai) {
      const mengaji = Math.min(5, Math.max(0, Number(nilai.mengaji) ?? peserta.nilai.mengaji));
      const akademik = Math.min(5, Math.max(0, Number(nilai.akademik) ?? peserta.nilai.akademik));
      const wawancara = Math.min(5, Math.max(0, Number(nilai.wawancara) ?? peserta.nilai.wawancara));

      peserta.nilai = { mengaji, akademik, wawancara };

      const scoring = hitungHasil(peserta.nilai);
      peserta.totalPoin = scoring.totalPoin;
      peserta.status = scoring.status;
    }

    if (catatan) {
      peserta.catatan = {
        mengaji: catatan.mengaji !== undefined ? String(catatan.mengaji).trim() : peserta.catatan?.mengaji,
        akademik: catatan.akademik !== undefined ? String(catatan.akademik).trim() : peserta.catatan?.akademik,
        wawancara: catatan.wawancara !== undefined ? String(catatan.wawancara).trim() : peserta.catatan?.wawancara,
      };
    }

    await peserta.save();

    return NextResponse.json({
      success: true,
      data: peserta,
    });
  } catch (error: any) {
    console.error("Error PUT /api/peserta/[id]:", error);
    return NextResponse.json(
      { error: error.message || "Gagal mengupdate data peserta." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getSessionAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const deleted = await Peserta.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Peserta tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Data peserta berhasil dihapus.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Gagal menghapus data peserta." },
      { status: 500 }
    );
  }
}
