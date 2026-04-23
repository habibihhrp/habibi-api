import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { signToken, generateApiKey } from "@/lib/auth";

export const runtime = "nodejs";

const schema = z.object({
  username: z.string().min(3).max(32).regex(/^[a-zA-Z0-9_]+$/, "Hanya huruf, angka, underscore"),
  email: z.string().email(),
  password: z.string().min(6).max(128),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0]?.message || "Input tidak valid" }, { status: 400 });
    }
    const { username, email, password } = parsed.data;

    const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
    if (existing) {
      return NextResponse.json({ message: "Email atau username sudah terdaftar" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashed,
        apiKeys: { create: { key: generateApiKey(), name: "Default" } },
      },
    });

    const token = await signToken({ userId: user.id, email: user.email });
    const res = NextResponse.json({ id: user.id, email: user.email, username: user.username });
    res.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch (e: any) {
    console.error("register error:", e);
    return NextResponse.json({ message: "Server error", error: e?.message || String(e), code: e?.code }, { status: 500 });
  }
}
