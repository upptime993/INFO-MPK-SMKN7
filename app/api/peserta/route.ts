import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Peserta from "@/lib/models/Peserta";
import { getSessionAdmin } from "@/lib/auth";
import { hitungHasil } from "@/lib/scoring";

export async function GET(request: Request) {
  try {
    const admin = await getSessionAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const publishedParam = searchParams.get("published") || "";

    await connectToDatabase();

    const query: any = {};

    if (search) {
      query.$or = [
        { nama: { $regex: search, $options: "i" } },
        { nomorPendaftaran: { $regex: search, $options: "i" } },
        { kelasJurusan: { $regex: search, $options: "i" } },
      ];
    }

    if (status && (status === "LULUS" || status === "TIDAK_LULUS")) {
      query.status = status;
    }

    if (publishedParam === "true") {
      query.published = true;
    } else if (publishedParam === "false") {
      query.published = false;
    }

    const list = await Peserta.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: list,
    });
  } catch (error: any) {
    console.error("Error GET /api/peserta:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data peserta." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getSessionAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { nama, kelasJurusan, nomorPendaftaran, nilai, catatan, namaPenguji, pesanMPK, linkWaGrup, published } = body;

    if (!nama || !nomorPendaftaran) {
      return NextResponse.json(
        { error: "Nama dan nomor pendaftaran wajib diisi." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existing = await Peserta.findOne({
      nomorPendaftaran: String(nomorPendaftaran).trim(),
    });

    if (existing) {
      return NextResponse.json(
        { error: `Nomor pendaftaran '${nomorPendaftaran}' sudah digunakan.` },
        { status: 400 }
      );
    }

    const nilaiMengaji = Math.min(5, Math.max(0, Number(nilai?.mengaji) || 0));
    const nilaiAkademik = Math.min(5, Math.max(0, Number(nilai?.akademik) || 0));
    const nilaiWawancara = Math.min(5, Math.max(0, Number(nilai?.wawancara) || 0));

    const scoring = hitungHasil({
      mengaji: nilaiMengaji,
      akademik: nilaiAkademik,
      wawancara: nilaiWawancara,
    });

    const newPeserta = await Peserta.create({
      nama: String(nama).trim(),
      kelasJurusan: String(kelasJurusan || "").trim(),
      nomorPendaftaran: String(nomorPendaftaran).trim(),
      nilai: {
        mengaji: nilaiMengaji,
        akademik: nilaiAkademik,
        wawancara: nilaiWawancara,
      },
      catatan: {
        mengaji: String(catatan?.mengaji || "").trim(),
        akademik: String(catatan?.akademik || "").trim(),
        wawancara: String(catatan?.wawancara || "").trim(),
      },
      namaPenguji: {
        mengaji: String(namaPenguji?.mengaji || "").trim(),
        akademik: String(namaPenguji?.akademik || "").trim(),
        wawancara: String(namaPenguji?.wawancara || "").trim(),
      },
      pesanMPK: String(pesanMPK || "").trim(),
      linkWaGrup: String(linkWaGrup || "").trim(),
      totalPoin: scoring.totalPoin,
      status: scoring.status,
      published: Boolean(published),
    });

    return NextResponse.json({
      success: true,
      data: newPeserta,
    });
  } catch (error: any) {
    console.error("Error POST /api/peserta:", error);
    return NextResponse.json(
      { error: error.message || "Gagal menambah data peserta." },
      { status: 500 }
    );
  }
}
