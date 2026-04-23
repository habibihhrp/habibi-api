import { NextRequest } from "next/server";
import { requireApiKey, jsonOk, jsonErr } from "@/lib/apikey";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const auth = await requireApiKey(req, "/api/v1/currency");
  if (!auth.ok) return auth.res;

  const url = new URL(req.url);
  const from = (url.searchParams.get("from") || "USD").toUpperCase();
  const to = (url.searchParams.get("to") || "IDR").toUpperCase();
  const amount = parseFloat(url.searchParams.get("amount") || "1");

  try {
    const r = await fetch(`https://open.er-api.com/v6/latest/${from}`, { cache: "no-store" });
    if (!r.ok) return jsonErr("Sumber currency gagal dijangkau", 502);
    const j = await r.json();
    const rate = j.rates?.[to];
    if (!rate) return jsonErr(`Currency tujuan "${to}" tidak ditemukan`, 400);
    return jsonOk({
      from, to, amount,
      rate,
      result: +(amount * rate).toFixed(4),
      last_update: j.time_last_update_utc,
    }, auth.ctx);
  } catch (e: any) {
    return jsonErr(e?.message || "Gagal fetch", 502);
  }
}
