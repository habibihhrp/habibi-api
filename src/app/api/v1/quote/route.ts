import { NextRequest } from "next/server";
import { requireApiKey, jsonOk, jsonErr } from "@/lib/apikey";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const auth = await requireApiKey(req, "/api/v1/quote");
  if (!auth.ok) return auth.res;

  try {
    const r = await fetch("https://zenquotes.io/api/random", { cache: "no-store" });
    if (!r.ok) return jsonErr("Sumber quote gagal dijangkau", 502);
    const [q] = await r.json();
    return jsonOk({ quote: q?.q, author: q?.a }, auth.ctx);
  } catch (e: any) {
    return jsonErr(e?.message || "Gagal fetch", 502);
  }
}
