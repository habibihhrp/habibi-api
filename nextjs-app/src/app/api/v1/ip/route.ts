import { NextRequest } from "next/server";
import { requireApiKey, jsonOk, jsonErr } from "@/lib/apikey";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const auth = await requireApiKey(req, "/api/v1/ip");
  if (!auth.ok) return auth.res;

  const url = new URL(req.url);
  const ip = url.searchParams.get("ip") || "";
  if (!ip) return jsonErr("Param `ip` wajib. Contoh: ?ip=8.8.8.8");

  try {
    const r = await fetch(`http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,message,query,country,countryCode,regionName,city,zip,lat,lon,timezone,isp,org,as`, { cache: "no-store" });
    if (!r.ok) return jsonErr("Sumber IP lookup gagal dijangkau", 502);
    const j = await r.json();
    if (j.status !== "success") return jsonErr(j.message || "IP tidak valid", 400);
    return jsonOk({
      ip: j.query, city: j.city, region: j.regionName,
      country: j.country, country_code: j.countryCode, postal: j.zip,
      latitude: j.lat, longitude: j.lon, timezone: j.timezone,
      isp: j.isp, org: j.org, asn: j.as,
    }, auth.ctx);
  } catch (e: any) {
    return jsonErr(e?.message || "Gagal fetch", 502);
  }
}
