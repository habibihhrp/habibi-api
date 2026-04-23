import { NextRequest } from "next/server";
import { requireApiKey, jsonOk, jsonErr } from "@/lib/apikey";

export const runtime = "nodejs";

async function lookup(ip: string) {
  const sources = [
    { url: `https://ipapi.co/${ip}/json/`, map: (j: any) => ({ ip: j.ip, city: j.city, region: j.region, country: j.country_name, country_code: j.country_code, postal: j.postal, latitude: j.latitude, longitude: j.longitude, timezone: j.timezone, org: j.org, asn: j.asn }) },
    { url: `https://freeipapi.com/api/json/${ip}`, map: (j: any) => j.ipAddress ? ({ ip: j.ipAddress, city: j.cityName, region: j.regionName, country: j.countryName, country_code: j.countryCode, postal: j.zipCode, latitude: j.latitude, longitude: j.longitude, timezone: j.timeZone }) : null },
    { url: `https://ipinfo.io/${ip}/json`, map: (j: any) => j.ip ? ({ ip: j.ip, city: j.city, region: j.region, country: j.country, postal: j.postal, location: j.loc, timezone: j.timezone, org: j.org }) : null },
  ];
  for (const s of sources) {
    try {
      const r = await fetch(s.url, { cache: "no-store", headers: { "user-agent": "Mozilla/5.0 habibi-api", accept: "application/json" } });
      if (!r.ok) continue;
      const j = await r.json();
      if (j?.error || j?.reserved) continue;
      const mapped = s.map(j);
      if (mapped && mapped.ip) return mapped;
    } catch { /* try next */ }
  }
  return null;
}

export async function GET(req: NextRequest) {
  const auth = await requireApiKey(req, "/api/v1/ip");
  if (!auth.ok) return auth.res;

  const url = new URL(req.url);
  let ip = url.searchParams.get("ip") || "";
  if (!ip) {
    const xff = req.headers.get("x-forwarded-for") || "";
    ip = xff.split(",")[0].trim() || req.headers.get("x-real-ip") || "";
  }
  if (!ip) return jsonErr("Param `ip` wajib. Contoh: ?ip=8.8.8.8");

  const data = await lookup(ip);
  if (!data) return jsonErr("Gagal lookup IP dari semua sumber", 502);
  return jsonOk(data, auth.ctx);
}
