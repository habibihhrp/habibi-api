import { NextRequest, NextResponse } from "next/server";
import { prisma } from "./prisma";

export type ApiKeyContext = {
  apiKeyId: string;
  userId: string;
  remaining: number;
};

export async function requireApiKey(
  req: NextRequest,
  endpoint: string
): Promise<{ ok: true; ctx: ApiKeyContext } | { ok: false; res: NextResponse }> {
  const url = new URL(req.url);
  const key =
    url.searchParams.get("apikey") ||
    url.searchParams.get("key") ||
    req.headers.get("x-api-key") ||
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    "";

  if (!key || key.trim() === "") {
    return {
      ok: false,
      res: NextResponse.json(
        { status: false, message: "API key wajib. Tambahkan ?apikey=KEY_KAMU" },
        { status: 401 }
      ),
    };
  }

  const apiKey = await prisma.apiKey.findUnique({ where: { key } });
  if (!apiKey) {
    return {
      ok: false,
      res: NextResponse.json(
        { status: false, message: "API key tidak valid" },
        { status: 403 }
      ),
    };
  }

  // Check if daily limit should be reset (reset at midnight)
  const now = new Date();
  const lastUsed = apiKey.lastUsedAt ? new Date(apiKey.lastUsedAt) : null;
  const shouldReset =
    !lastUsed ||
    lastUsed.toDateString() !== now.toDateString();

  let requests = apiKey.requests;
  if (shouldReset) {
    requests = 0;
  }

  if (requests >= apiKey.limit) {
    return {
      ok: false,
      res: NextResponse.json(
        {
          status: false,
          message: `Limit harian terlampaui (${apiKey.limit} request). Reset pada tengah malam.`,
        },
        { status: 429 }
      ),
    };
  }

  await prisma.apiKey.update({
    where: { id: apiKey.id },
    data: {
      requests: shouldReset ? 1 : { increment: 1 },
      lastUsedAt: new Date(),
    },
  });

  prisma.usage
    .create({ data: { apiKeyId: apiKey.id, endpoint, status: 200 } })
    .catch(() => {});

  return {
    ok: true,
    ctx: {
      apiKeyId: apiKey.id,
      userId: apiKey.userId,
      remaining: apiKey.limit - requests - 1,
    },
  };
}

export function jsonOk<T>(data: T, ctx: ApiKeyContext) {
  return NextResponse.json({
    status: true,
    creator: "Habibi API",
    remaining: ctx.remaining,
    result: data,
  });
}

export function jsonErr(message: string, status = 400) {
  return NextResponse.json({ status: false, message }, { status });
}
