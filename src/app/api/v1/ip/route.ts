import { NextRequest } from "next/server";
import { requireApiKey, jsonOk, jsonErr } from "@/lib/apikey";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const auth = await requireApiKey(req, "/api/v1/ip");
  if (!auth.ok) return auth.res;

  const url = new URL(req.url);
  const ip = url.searchParams.get("ip") || "";

  try {
    const r = await fetch(`https://ipapi.co/${ip ? encodeURIComponent(ip) + "/" : ""}json/`, { cache: "no-store" });
    if (!r.ok) return jsonErr("Sumber IP lookup gagal dijangkau", 502);
    const j = await r.json();
    if (j.error) return jsonErr(j.reason || "IP tidak valid", 400);
    return jsonOk({
      ip: j.ip, city: j.city, region: j.region, country: j.country_name,
      country_code: j.country_code, postal: j.postal,
      latitude: j.latitude, longitude: j.longitude, timezone: j.timezone,
      org: j.org, asn: j.asn,
    }, auth.ctx);
  } catch (e: any) {
    return jsonErr(e?.message || "Gagal fetch", 502);
  }
}
