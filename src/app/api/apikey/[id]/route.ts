import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  
  const key = await prisma.apiKey.findUnique({ where: { id: params.id } });
  if (!key || key.userId !== s.userId) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  
  return NextResponse.json({
    apiKey: {
      id: key.id,
      key: key.key,
      name: key.name,
      requests: key.requests,
      limit: key.limit,
      lastUsedAt: key.lastUsedAt?.toISOString() || null,
      createdAt: key.createdAt.toISOString(),
    },
  });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  
  const key = await prisma.apiKey.findUnique({ where: { id: params.id } });
  if (!key || key.userId !== s.userId) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  
  const body = await req.json().catch(() => ({}));
  const data: any = {};
  
  if (body.name !== undefined) {
    data.name = (body.name as string).slice(0, 64) || "API Key";
  }
  
  if (body.limit !== undefined) {
    const limit = parseInt(body.limit as string);
    if (limit < 100 || limit > 100000) {
      return NextResponse.json(
        { message: "Limit harus antara 100 dan 100000" },
        { status: 400 }
      );
    }
    data.limit = limit;
  }
  
  const updated = await prisma.apiKey.update({
    where: { id: params.id },
    data,
  });
  
  return NextResponse.json({
    apiKey: {
      id: updated.id,
      key: updated.key,
      name: updated.name,
      requests: updated.requests,
      limit: updated.limit,
      lastUsedAt: updated.lastUsedAt?.toISOString() || null,
      createdAt: updated.createdAt.toISOString(),
    },
  });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  
  const key = await prisma.apiKey.findUnique({ where: { id: params.id } });
  if (!key || key.userId !== s.userId) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  
  const body = await req.json().catch(() => ({}));
  const action = body?.action as string;
  
  if (action === "reset") {
    const updated = await prisma.apiKey.update({
      where: { id: params.id },
      data: { requests: 0, lastUsedAt: null },
    });
    
    return NextResponse.json({
      message: "Rate limit direset",
      apiKey: {
        id: updated.id,
        key: updated.key,
        name: updated.name,
        requests: updated.requests,
        limit: updated.limit,
        lastUsedAt: updated.lastUsedAt?.toISOString() || null,
        createdAt: updated.createdAt.toISOString(),
      },
    });
  }
  
  return NextResponse.json({ message: "Action tidak valid" }, { status: 400 });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  
  const key = await prisma.apiKey.findUnique({ where: { id: params.id } });
  if (!key || key.userId !== s.userId) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  
  await prisma.apiKey.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "API key deleted", ok: true });
}
