import { NextRequest } from "next/server";
import { requireApiKey, jsonOk, jsonErr } from "@/lib/apikey";

export const runtime = "nodejs";

const VALID = ["waifu", "neko", "shinobu", "megumin", "bully", "cuddle", "cry", "hug", "kiss", "smile", "wave", "wink"];

export async function GET(req: NextRequest) {
  const auth = await requireApiKey(req, "/api/v1/anime");
  if (!auth.ok) return auth.res;

  const url = new URL(req.url);
  const cat = (url.searchParams.get("category") || "waifu").toLowerCase();
  if (!VALID.includes(cat)) return jsonErr(`category invalid. Pilih: ${VALID.join(", ")}`);

  try {
    const r = await fetch(`https://api.waifu.pics/sfw/${cat}`, { cache: "no-store" });
    if (!r.ok) return jsonErr("Sumber gambar gagal dijangkau", 502);
    const data = await r.json();
    return jsonOk({ category: cat, image: data.url }, auth.ctx);
  } catch (e: any) {
    return jsonErr(e?.message || "Gagal fetch", 502);
  }
}
