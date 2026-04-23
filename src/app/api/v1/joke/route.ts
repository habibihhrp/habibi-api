import { NextRequest } from "next/server";
import { requireApiKey, jsonOk, jsonErr } from "@/lib/apikey";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const auth = await requireApiKey(req, "/api/v1/joke");
  if (!auth.ok) return auth.res;

  try {
    const r = await fetch("https://official-joke-api.appspot.com/random_joke", { cache: "no-store" });
    if (!r.ok) return jsonErr("Sumber joke gagal dijangkau", 502);
    const j = await r.json();
    return jsonOk({ type: j.type, setup: j.setup, punchline: j.punchline }, auth.ctx);
  } catch (e: any) {
    return jsonErr(e?.message || "Gagal fetch", 502);
  }
}
