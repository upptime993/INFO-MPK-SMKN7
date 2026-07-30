import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import Admin from "@/lib/models/Admin";
import { signAdminToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username dan password wajib diisi." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const admin = await Admin.findOne({ username: String(username).toLowerCase().trim() });
    if (!admin) {
      return NextResponse.json(
        { error: "Username atau password tidak cocok." },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(String(password), admin.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Username atau password tidak cocok." },
        { status: 401 }
      );
    }

    const token = signAdminToken({
      adminId: admin._id.toString(),
      username: admin.username,
      nama: admin.nama,
    });

    const response = NextResponse.json({
      success: true,
      message: "Login berhasil",
      admin: {
        username: admin.username,
        nama: admin.nama,
      },
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 hari
    });

    return response;
  } catch (error: any) {
    console.error("Error login:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server saat login." },
      { status: 500 }
    );
  }
}
