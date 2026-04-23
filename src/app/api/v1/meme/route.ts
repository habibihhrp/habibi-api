import { NextRequest } from "next/server";
import { requireApiKey, jsonOk, jsonErr } from "@/lib/apikey";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const auth = await requireApiKey(req, "/api/v1/meme");
  if (!auth.ok) return auth.res;

  try {
    const r = await fetch("https://meme-api.com/gimme", { cache: "no-store" });
    if (!r.ok) return jsonErr("Sumber meme gagal dijangkau", 502);
    const j = await r.json();
    return jsonOk({
      title: j.title,
      image: j.url,
      subreddit: j.subreddit,
      author: j.author,
      source: j.postLink,
    }, auth.ctx);
  } catch (e: any) {
    return jsonErr(e?.message || "Gagal fetch", 502);
  }
}
