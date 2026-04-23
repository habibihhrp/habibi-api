import { NextRequest } from "next/server";
import { requireApiKey, jsonOk, jsonErr } from "@/lib/apikey";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const auth = await requireApiKey(req, "/api/v1/jadwal-sholat");
  if (!auth.ok) return auth.res;

  const url = new URL(req.url);
  const city = url.searchParams.get("city") || "Jakarta";
  const country = url.searchParams.get("country") || "Indonesia";

  try {
    const r = await fetch(
      `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=8`,
      { cache: "no-store" }
    );
    if (!r.ok) return jsonErr("Sumber jadwal sholat gagal dijangkau", 502);
    const j = await r.json();
    const t = j.data?.timings || {};
    return jsonOk({
      city, country,
      date: j.data?.date?.readable,
      hijri: j.data?.date?.hijri?.date,
      timings: {
        Subuh: t.Fajr,
        Terbit: t.Sunrise,
        Dzuhur: t.Dhuhr,
        Ashar: t.Asr,
        Maghrib: t.Maghrib,
        Isya: t.Isha,
      },
    }, auth.ctx);
  } catch (e: any) {
    return jsonErr(e?.message || "Gagal fetch", 502);
  }
}
