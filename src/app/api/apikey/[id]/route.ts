import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const key = await prisma.apiKey.findUnique({ where: { id: params.id } });
  if (!key || key.userId !== s.userId) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  await prisma.apiKey.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
