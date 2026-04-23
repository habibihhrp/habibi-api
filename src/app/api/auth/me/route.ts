import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ user: null }, { status: 401 });
  const user = await prisma.user.findUnique({
    where: { id: s.userId },
    select: { id: true, email: true, username: true, plan: true },
  });
  return NextResponse.json({ user });
}
