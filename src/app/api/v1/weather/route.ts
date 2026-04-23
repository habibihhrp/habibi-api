import { NextRequest } from "next/server";
import { requireApiKey, jsonOk, jsonErr } from "@/lib/apikey";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const auth = await requireApiKey(req, "/api/v1/weather");
  if (!auth.ok) return auth.res;

  const url = new URL(req.url);
  const city = url.searchParams.get("city");
  if (!city) return jsonErr("Param `city` wajib. Contoh: ?city=Jakarta");

  try {
    const r = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`, { cache: "no-store" });
    if (!r.ok) return jsonErr("Sumber weather gagal dijangkau", 502);
    const data = await r.json();
    const cur = data.current_condition?.[0] || {};
    const area = data.nearest_area?.[0] || {};
    return jsonOk({
      city: area.areaName?.[0]?.value || city,
      country: area.country?.[0]?.value,
      region: area.region?.[0]?.value,
      temperature: `${cur.temp_C}°C`,
      feels_like: `${cur.FeelsLikeC}°C`,
      description: cur.weatherDesc?.[0]?.value,
      humidity: `${cur.humidity}%`,
      wind: `${cur.windspeedKmph} km/h`,
      observation_time: cur.observation_time,
    }, auth.ctx);
  } catch (e: any) {
    return jsonErr(e?.message || "Gagal fetch", 502);
  }
}
