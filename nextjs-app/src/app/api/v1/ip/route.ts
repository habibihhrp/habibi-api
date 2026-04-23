import { NextRequest } from "next/server";
import { requireApiKey, jsonOk, jsonErr } from "@/lib/apikey";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const auth = await requireApiKey(req, "/api/v1/ip");
  if (!auth.ok) return auth.res;

  const url = new URL(req.url);
  const queryIp = url.searchParams.get("ip") || "";
  const xff = req.headers.get("x-forwarded-for") || "";
  const callerIp = xff.split(",")[0].trim() || req.headers.get("x-real-ip") || "";
  const targetIp = queryIp || callerIp;

  // Vercel provides geo info via headers for the caller
  const vercelGeo = {
    city: req.headers.get("x-vercel-ip-city"),
    country: req.headers.get("x-vercel-ip-country"),
    country_region: req.headers.get("x-vercel-ip-country-region"),
    latitude: req.headers.get("x-vercel-ip-latitude"),
    longitude: req.headers.get("x-vercel-ip-longitude"),
    timezone: req.headers.get("x-vercel-ip-timezone"),
  };

  // If asking for own IP and Vercel has geo headers → use those (works 100%)
  if (!queryIp && vercelGeo.country) {
    return jsonOk({
      ip: callerIp,
      city: vercelGeo.city ? decodeURIComponent(vercelGeo.city) : null,
      region: vercelGeo.country_region,
      country: vercelGeo.country,
      latitude: vercelGeo.latitude ? Number(vercelGeo.latitude) : null,
      longitude: vercelGeo.longitude ? Number(vercelGeo.longitude) : null,
      timezone: vercelGeo.timezone,
      source: "vercel-geo",
    }, auth.ctx);
  }

  // Otherwise try external providers as fallback
  if (!targetIp) return jsonErr("Param `ip` wajib. Contoh: ?ip=8.8.8.8");

  const providers = [
    {
      url: `https://ipapi.co/${targetIp}/json/`,
      map: (j: any) => j?.ip && !j.error ? { ip: j.ip, city: j.city, region: j.region, country: j.country_name, country_code: j.country_code, postal: j.postal, latitude: j.latitude, longitude: j.longitude, timezone: j.timezone, org: j.org } : null,
    },
    {
      url: `https://ipinfo.io/${targetIp}/json`,
      map: (j: any) => j?.ip ? { ip: j.ip, city: j.city, region: j.region, country: j.country, postal: j.postal, location: j.loc, timezone: j.timezone, org: j.org } : null,
    },
    {
      url: `https://freeipapi.com/api/json/${targetIp}`,
      map: (j: any) => j?.ipAddress ? { ip: j.ipAddress, city: j.cityName, region: j.regionName, country: j.countryName, country_code: j.countryCode, postal: j.zipCode, latitude: j.latitude, longitude: j.longitude, timezone: j.timeZone } : null,
    },
  ];

  for (const p of providers) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 4000);
      const r = await fetch(p.url, { cache: "no-store", signal: ctrl.signal, headers: { accept: "application/json", "user-agent": "habibi-api/1.0" } });
      clearTimeout(timer);
      if (!r.ok) continue;
      const j = await r.json().catch(() => null);
      const mapped = p.map(j);
      if (mapped) return jsonOk({ ...mapped, source: new URL(p.url).hostname }, auth.ctx);
    } catch { /* try next */ }
  }

  return jsonErr("Gagal lookup IP dari semua provider (coba lagi nanti)", 502);
}
