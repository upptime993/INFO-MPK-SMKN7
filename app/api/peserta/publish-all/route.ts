import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Peserta from "@/lib/models/Peserta";
import { getSessionAdmin } from "@/lib/auth";

export async function PATCH() {
  try {
    const admin = await getSessionAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const result = await Peserta.updateMany(
      { published: false },
      { $set: { published: true } }
    );

    return NextResponse.json({
      success: true,
      message: `${result.modifiedCount} peserta berhasil di-publish.`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error: any) {
    console.error("Error PATCH /api/peserta/publish-all:", error);
    return NextResponse.json(
      { error: "Gagal mempublish semua data peserta." },
      { status: 500 }
    );
  }
}
