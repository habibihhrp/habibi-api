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
    const r = await fetch(`https://freeipapi.com/api/json/${encodeURIComponent(ip)}`, { cache: "no-store", headers: { "user-agent": "Mozilla/5.0 habibi-api" } });
    if (!r.ok) return jsonErr(`Sumber IP lookup gagal (${r.status}): ${(await r.text()).slice(0, 120)}`, 502);
    const j = await r.json();
    if (!j.ipAddress) return jsonErr("IP tidak valid", 400);
    return jsonOk({
      ip: j.ipAddress,
      city: j.cityName,
      region: j.regionName,
      country: j.countryName,
      country_code: j.countryCode,
      zip: j.zipCode,
      latitude: j.latitude,
      longitude: j.longitude,
      timezone: j.timeZone,
    }, auth.ctx);
  } catch (e: any) {
    return jsonErr(e?.message || "Gagal fetch", 502);
  }
}
