import { NextRequest } from "next/server";
import { requireApiKey, jsonOk, jsonErr } from "@/lib/apikey";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const auth = await requireApiKey(req, "/api/v1/wikipedia");
  if (!auth.ok) return auth.res;

  const url = new URL(req.url);
  const query = url.searchParams.get("q") || url.searchParams.get("query");
  const lang = url.searchParams.get("lang") || "id";
  if (!query) return jsonErr("Param `q` wajib. Contoh: ?q=Indonesia");

  try {
    const r = await fetch(
      `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`,
      { cache: "no-store", headers: { "user-agent": "habibi-api" } }
    );
    if (r.status === 404) return jsonErr("Artikel tidak ditemukan", 404);
    if (!r.ok) return jsonErr("Sumber wikipedia gagal dijangkau", 502);
    const j = await r.json();
    return jsonOk({
      title: j.title,
      description: j.description,
      extract: j.extract,
      thumbnail: j.thumbnail?.source,
      url: j.content_urls?.desktop?.page,
    }, auth.ctx);
  } catch (e: any) {
    return jsonErr(e?.message || "Gagal fetch", 502);
  }
}
