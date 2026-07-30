import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Peserta from "@/lib/models/Peserta";
import { getSessionAdmin } from "@/lib/auth";

export async function PATCH(request: Request) {
  try {
    const admin = await getSessionAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { linkWaGrup } = body;

    if (linkWaGrup === undefined) {
      return NextResponse.json(
        { error: "linkWaGrup wajib diisi" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const cleanLink = String(linkWaGrup).trim();

    const result = await Peserta.updateMany(
      {},
      { $set: { linkWaGrup: cleanLink } }
    );

    return NextResponse.json({
      success: true,
      message: `Link Grup WhatsApp berhasil diterapkan ke ${result.modifiedCount} peserta.`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error: any) {
    console.error("Error PATCH /api/peserta/update-wa-all:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui link WA semua peserta." },
      { status: 500 }
    );
  }
}
