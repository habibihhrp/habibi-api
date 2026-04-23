import { NextRequest, NextResponse } from "next/server";
import { getSession, generateApiKey } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const keys = await prisma.apiKey.findMany({
    where: { userId: s.userId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ apiKeys: keys });
}

export async function POST(req: NextRequest) {
  const s = await getSession();
  if (!s) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const name = (body?.name as string)?.slice(0, 64) || "API Key";

  const count = await prisma.apiKey.count({ where: { userId: s.userId } });
  if (count >= 10) {
    return NextResponse.json({ message: "Maksimum 10 API key per akun" }, { status: 400 });
  }

  const key = await prisma.apiKey.create({
    data: { userId: s.userId, name, key: generateApiKey() },
  });
  return NextResponse.json({
    apiKey: {
      id: key.id,
      key: key.key,
      name: key.name,
      requests: key.requests,
      limit: key.limit,
      createdAt: key.createdAt.toISOString(),
    },
  });
}
