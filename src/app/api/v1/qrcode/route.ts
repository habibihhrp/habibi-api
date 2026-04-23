import { NextRequest } from "next/server";
import { requireApiKey, jsonOk, jsonErr } from "@/lib/apikey";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const auth = await requireApiKey(req, "/api/v1/qrcode");
  if (!auth.ok) return auth.res;

  const url = new URL(req.url);
  const text = url.searchParams.get("text");
  const size = url.searchParams.get("size") || "300";
  if (!text) return jsonErr("Param `text` wajib. Contoh: ?text=hello");

  const image = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(text)}&size=${size}x${size}`;
  return jsonOk({ text, size: `${size}x${size}`, image }, auth.ctx);
}
