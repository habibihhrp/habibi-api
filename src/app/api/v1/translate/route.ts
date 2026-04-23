import { NextRequest } from "next/server";
import { requireApiKey, jsonOk, jsonErr } from "@/lib/apikey";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const auth = await requireApiKey(req, "/api/v1/translate");
  if (!auth.ok) return auth.res;

  const url = new URL(req.url);
  const text = url.searchParams.get("text");
  const to = url.searchParams.get("to") || "id";
  const from = url.searchParams.get("from") || "auto";
  if (!text) return jsonErr("Param `text` wajib. Contoh: ?text=hello&to=id");

  try {
    const r = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`,
      { cache: "no-store" }
    );
    if (!r.ok) return jsonErr("Sumber translate gagal dijangkau", 502);
    const data = await r.json();
    const translated = data[0]?.map((x: any) => x[0]).join("") || "";
    const detected = data[2] || from;
    return jsonOk({ from: detected, to, text, translated }, auth.ctx);
  } catch (e: any) {
    return jsonErr(e?.message || "Gagal translate", 502);
  }
}
